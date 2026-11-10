import test from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import ts from "typescript";
const runtimeRequire = createRequire(import.meta.url);

// Compile project TS with the already-installed TypeScript; no test dependency.
function loader(stubs = {}, sources = {}) {
  const cache = new Map();
  function load(file) {
    const filename = path.resolve(file);
    if (cache.has(filename)) return cache.get(filename).exports;
    const compiledModule = { exports: {} };
    cache.set(filename, compiledModule);
    const source = ts.transpileModule(sources[file] ?? readFileSync(filename, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const localRequire = name => {
      if (name.endsWith(".css")) return {};
      if (name === "server-only") return {}; // Marker enforced by Next in builds.
      if (name in stubs) return stubs[name];
      if (name.startsWith("@/")) return load(`src/${name.slice(2)}.ts`);
      return runtimeRequire(name);
    };
    new Function("require", "module", "exports", source)(localRequire, compiledModule, compiledModule.exports);
    return compiledModule.exports;
  }
  return load;
}

const seed = JSON.parse(readFileSync("data/salon-hours.json", "utf8"));

test("salon hours schema rejects invalid times, reversed/overlapping shifts, invalid dates and duplicate dates", () => {
  const { salonHoursSchema, salonDaySchema } = loader()("src/lib/salon-hours-schema.ts");
  assert.ok(salonHoursSchema.safeParse(seed).success);
  for (const ranges of [[{ open: "25:00", close: "26:00" }], [{ open: "19:00", close: "10:00" }],
    [{ open: "10:00", close: "14:00" }, { open: "13:00", close: "17:00" }], Array(4).fill({ open: "10:00", close: "11:00" })]) {
    assert.equal(salonDaySchema.safeParse(ranges).success, false);
  }
  assert.ok(salonDaySchema.safeParse([]).success);
  assert.ok(salonDaySchema.safeParse([{ open: "13:00", close: "17:00" }, { open: "10:00", close: "13:00" }]).success);
  for (const overrides of [[{ date: "2026-02-30", ranges: [] }], [{ date: "2026-12-25", ranges: [], note: "x".repeat(81) }], [{ date: "2026-12-25", ranges: [] }, { date: "2026-12-25", ranges: [] }]]) {
    assert.equal(salonHoursSchema.safeParse({ ...seed, overrides }).success, false);
  }
});

test("Chicago time, DST, midnight, formatting and split-shift boundaries are independent of host timezone", () => {
  const h = loader()("src/lib/hours-format.ts");
  for (const date of ["2026-01-01T06:00:00Z", "2026-07-01T05:00:00Z"]) assert.equal(h.chicagoNow(new Date(date), seed.timezone).minutes, 0);
  assert.equal(h.todayDateString(new Date("2026-11-10T01:00:00Z"), seed.timezone), "2026-11-09");
  assert.equal(h.chicagoNow(new Date("2026-11-10T01:00:00Z"), seed.timezone).day, "mon");
  assert.equal(h.fmtTime("13:00"), "1 PM");
  assert.equal(h.fmtTime("10:30"), "10:30 AM");
  const split = [{ open: "10:00", close: "13:00" }, { open: "14:00", close: "19:00" }];
  assert.equal(h.formatSalonRanges(split), "10 AM – 1 PM, 2 PM – 7 PM");
  for (const [minutes, expected] of [[599, false], [600, true], [780, false], [840, true], [1140, false]]) assert.equal(h.isOpenNow(split, minutes), expected);
});

test("store falls back without a file or with invalid JSON; atomic saves persist, reread and update timestamp", async () => {
  const directory = await fs.mkdtemp(path.join(tmpdir(), "salon-hours-test-"));
  const previous = process.env.SALON_HOURS_DATA_PATH;
  process.env.SALON_HOURS_DATA_PATH = path.join(directory, "hours.json");
  try {
    const store = loader()("src/lib/salon-hours-store.ts");
    assert.deepEqual(await store.getSalonHours(), seed);
    await fs.writeFile(process.env.SALON_HOURS_DATA_PATH, "broken");
    assert.deepEqual(await store.getSalonHours(), seed);
    const input = structuredClone(seed); input.weekly.tue = [];
    input.weekly.thu = [{ open: "10:00", close: "13:00" }, { open: "14:00", close: "19:00" }];
    const saved = await store.saveSalonHours(input);
    assert.notEqual(saved.lastUpdated, seed.lastUpdated);
    assert.deepEqual(await store.getSalonHours(), saved);
    assert.equal((await fs.stat(process.env.SALON_HOURS_DATA_PATH)).mode & 0o777, 0o600);
    assert.equal((await fs.readdir(directory)).length, 1);
    await assert.rejects(store.saveSalonHours({ ...seed, weekly: { ...seed.weekly, tue: [{ open: "19:00", close: "10:00" }] } }));
  } finally {
    if (previous === undefined) delete process.env.SALON_HOURS_DATA_PATH; else process.env.SALON_HOURS_DATA_PATH = previous;
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("API uses existing session guard, rejects invalid input, persists schedules and revalidates consumers", async () => {
  let authenticated = false;
  let savedInput;
  const paths = [];
  const api = loader({
    "next/headers": { cookies: async () => ({ get: () => ({ value: authenticated ? "valid" : "" }) }) },
    "@/lib/admin-session": { SESSION_COOKIE: "shanzo_admin", verifySession: token => token === "valid" },
    "next/cache": { revalidatePath: value => paths.push(value) },
    "@/lib/salon-hours-store": { getSalonHours: async () => seed, saveSalonHours: async value => { savedInput = value; return { ...value, lastUpdated: new Date().toISOString() }; } },
  })("src/app/api/admin/salon-hours/route.ts");
  const request = data => new Request("https://shanzosalon.com/api/admin/salon-hours", { method: "PUT", headers: { host: "shanzosalon.com", "content-type": "application/json" }, body: JSON.stringify(data) });
  assert.equal((await api.GET()).status, 401);
  assert.equal((await api.PUT(request(seed))).status, 401);
  authenticated = true;
  assert.equal((await api.GET()).status, 200);
  for (const ranges of [[{ open: "19:00", close: "10:00" }], [{ open: "10:00", close: "14:00" }, { open: "13:00", close: "19:00" }]]) {
    const result = await api.PUT(request({ ...seed, weekly: { ...seed.weekly, tue: ranges } }));
    assert.equal(result.status, 400);
    assert.ok((await result.json()).error.length);
  }
  const result = await api.PUT(request(seed));
  assert.equal(result.status, 200);
  assert.deepEqual(savedInput, seed);
  assert.deepEqual(paths, ["/contact", "/", "/apply", "/admin/salon-hours"]);
});

test("shared public list renders today's closure/custom override in the badge, row and note", () => {
  const React = runtimeRequire("react");
  const { renderToStaticMarkup } = runtimeRequire("react-dom/server");
  const List = loader()("src/components/hours/SalonHoursList.tsx").default;
  const now = "2026-11-10T17:00:00Z";
  const render = overrides => renderToStaticMarkup(React.createElement(List, { data: { ...seed, overrides }, now }));
  const closed = render([{ date: "2026-11-10", ranges: [], note: "Holiday closure" }]);
  assert.match(closed, /Closed now/);
  assert.match(closed, /Tuesday.*?<td>Closed<\/td>/);
  assert.match(closed, /Holiday closure/);
  const custom = render([{ date: "2026-11-10", ranges: [{ open: "10:30", close: "12:00" }], note: "Short day" }]);
  assert.match(custom, /Open now/);
  assert.match(custom, /Tuesday.*?<td>10:30 AM – 12 PM<\/td>/);
  assert.match(custom, /Short day/);
  assert.match(render([{ date: "2026-11-09", ranges: [] }]), /Tuesday.*?<td>10 AM – 7 PM<\/td>/);
});
