import test from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
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
      compilerOptions: { target: ts.ScriptTarget.ES2017, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText;
    const localRequire = name => {
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

function testCredentials() {
  const password = randomBytes(24).toString("hex");
  const source = readFileSync("src/lib/admin-credentials.ts", "utf8").replace(
    /export const ADMIN_PASSWORD = .*;/,
    `export const ADMIN_PASSWORD = ${JSON.stringify(password)};`,
  ).replace(
    /export const SESSION_SECRET = .*;/,
    `export const SESSION_SECRET = ${JSON.stringify(randomBytes(32).toString("hex"))};`,
  );
  const credentials = loader({}, { "src/lib/admin-credentials.ts": source })("src/lib/admin-credentials.ts");
  return { password, credentials };
}

test("password comparison accepts matches and rejects incorrect input", () => {
  const { password, credentials } = testCredentials();
  assert.equal(credentials.verifyAdminPassword(password), true);
  assert.equal(credentials.verifyAdminPassword(`${password}wrong`), false);
  assert.equal(credentials.verifyAdminPassword(""), false);
});

test("hours reject invalid times, overlap, bad dates/timezones, and duplicate dates", () => {
  const { hoursSchema, dayHoursSchema } = loader()("src/lib/hours-schema.ts");
  const fixture = JSON.parse(readFileSync("data/walk-in-hours.json", "utf8"));
  assert.equal(hoursSchema.safeParse(fixture).success, true);
  for (const hours of [[], { open: "25:00", close: "26:00" }, { open: "19:00", close: "10:00" },
    [{ open: "10:00", close: "14:00" }, { open: "13:00", close: "17:00" }]]) {
    assert.equal(dayHoursSchema.safeParse(hours).success, false);
  }
  assert.equal(dayHoursSchema.safeParse([{ open: "10:00", close: "13:00" }, { open: "13:00", close: "17:00" }]).success, true);
  assert.equal(hoursSchema.safeParse({ ...fixture, timezone: "Invalid/Timezone" }).success, false);
  assert.equal(hoursSchema.safeParse({ ...fixture, overrides: [{ date: "2026-02-30", hair: null }] }).success, false);
  assert.equal(hoursSchema.safeParse({ ...fixture, overrides: [{ date: "2026-12-25", hair: null }, { date: "2026-12-25", nails: null }] }).success, false);
});

test("Chicago dates, DST, split shifts, and service-specific overrides", () => {
  const h = loader()("src/lib/walk-in-hours.ts");
  assert.equal(h.getLocalNow(new Date("2026-10-23T02:00:00Z"), "America/Chicago").date, "2026-10-22");
  for (const iso of ["2026-01-01T06:00:00Z", "2026-07-01T05:00:00Z"]) {
    assert.equal(h.getLocalNow(new Date(iso), "America/Chicago").minutes, 0);
  }
  const hours = [{ open: "10:00", close: "13:00" }, { open: "14:00", close: "19:00" }];
  for (const [minute, expected] of [[599, "Closed now"], [600, "Open now"], [780, "Closed now"], [840, "Open now"], [1140, "Closed now"]]) {
    assert.equal(h.getStatus(hours, minute), expected);
  }
  const config = JSON.parse(readFileSync("data/walk-in-hours.json", "utf8"));
  config.overrides = [{ date: "2026-10-23", hair: null }];
  assert.equal(h.resolveHours(config, "hair", "2026-10-23", "fri"), null);
  assert.deepEqual(h.resolveHours(config, "nails", "2026-10-23", "fri"), config.services.nails.weekly.fri);
});

test("sessions reject forgery, expiry, malformed tokens, and credential rotation", () => {
  const previous = { ...process.env };
  try {
    const { credentials } = testCredentials();
    const s = loader({ "@/lib/admin-credentials": credentials })("src/lib/admin-session.ts");
    const now = Date.now();
    const token = s.createSession(now);
    assert.equal(s.verifySession(token, now), true);
    assert.equal(s.verifySession(token, now + s.SESSION_SECONDS * 1000), false);
    for (const bad of [undefined, "", token + ".extra", token.slice(0, -2), "fake.payload", token.replace(/.$/, token.endsWith("0") ? "1" : "0")]) {
      assert.equal(s.verifySession(bad, now), false);
    }
    credentials.ADMIN_PASSWORD = testCredentials().credentials.ADMIN_PASSWORD;
    assert.equal(s.verifySession(token, now), false);
    const rotatedToken = s.createSession(now);
    credentials.SESSION_SECRET = randomBytes(32).toString("hex");
    assert.equal(s.verifySession(rotatedToken, now), false);
    assert.equal(s.equalSecret("a", "a"), true);
    assert.equal(s.equalSecret("a", "longer"), false);
  } finally { process.env = previous; }
});

test("rate limit locks after five failures, isolates addresses, and expires", () => {
  const r = loader()("src/lib/login-rate-limit.ts");
  const now = Date.now();
  for (let i = 0; i < 5; i++) { assert.equal(r.loginLocked("test-a", now), false); r.recordLoginFailure("test-a", now); }
  assert.equal(r.loginLocked("test-a", now), true);
  assert.equal(r.loginLocked("test-b", now), false);
  assert.equal(r.loginLocked("test-a", now + 15 * 60 * 1000), false);
  r.clearLoginFailures("test-a");
});

test("login uses generic failures, limits attempts, accepts case-insensitive email, and sets a protected cookie", async () => {
  const previous = { ...process.env };
  const { password, credentials } = testCredentials();
  process.env.ADMIN_TRUST_PROXY_HEADERS = "true";
  process.env.NODE_ENV = "production";
  const ip = `test-${randomBytes(8).toString("hex")}`;
  let cookie;
  let deleted;
  const load = loader({
    "@/lib/admin-credentials": credentials,
    "next/headers": {
      headers: async () => ({ get: () => ip }),
      cookies: async () => ({ set: (...args) => { cookie = args; }, get: () => ({ value: cookie?.[1] }), delete: name => { deleted = name; } }),
    },
    "next/navigation": { redirect: destination => { throw new Error(`redirect:${destination}`); } },
    "next/cache": { revalidatePath: () => {} },
  });
  try {
    const actions = load("src/app/admin/actions.ts");
    for (let i = 0; i < 5; i++) assert.deepEqual(await actions.login({ email: "other@example.test", password: "wrong" }), { error: "Invalid email or password" });
    assert.match((await actions.login({ email: credentials.ADMIN_EMAIL, password })).error, /Too many failed attempts/);
    load("src/lib/login-rate-limit.ts").clearLoginFailures(ip);
    await assert.rejects(actions.login({ email: `  ${credentials.ADMIN_EMAIL.toUpperCase()}  `, password }), /redirect:\/admin$/);
    assert.equal(cookie[0], "shanzo_admin");
    assert.equal(cookie[2].httpOnly, true);
    assert.equal(cookie[2].secure, true);
    assert.equal(cookie[2].sameSite, "strict");
    assert.equal(cookie[2].path, "/");
    assert.equal(cookie[2].maxAge, 7 * 24 * 60 * 60);
    await assert.rejects(actions.logout(), /redirect:\/admin\/login/);
    assert.equal(deleted, "shanzo_admin");
  } finally { process.env = previous; load("src/lib/login-rate-limit.ts").clearLoginFailures(ip); }
});

test("store reads fresh, falls back safely, validates writes, and leaves no temp files", async () => {
  const directory = await fs.mkdtemp("/private/tmp/shanzo-hours-test-");
  const previous = process.env.HOURS_DATA_PATH;
  process.env.HOURS_DATA_PATH = path.join(directory, "nested", "hours.json");
  try {
    const store = loader()("src/lib/hours-store.ts");
    assert.equal((await store.getHours()).services.hair.weekly.mon, null);
    const fixture = JSON.parse(readFileSync("data/walk-in-hours.json", "utf8"));
    const saved = await store.saveHours(fixture);
    assert.notEqual(saved.lastUpdated, fixture.lastUpdated);
    assert.deepEqual(await store.getHours(), saved);
    await fs.writeFile(process.env.HOURS_DATA_PATH, JSON.stringify({ ...saved, announcement: "Fresh read" }));
    assert.equal((await store.getHours()).announcement, "Fresh read");
    await assert.rejects(store.saveHours({ ...saved, timezone: "invalid" }));
    assert.equal((await store.getHours()).announcement, "Fresh read");
    assert.deepEqual(await fs.readdir(path.dirname(process.env.HOURS_DATA_PATH)), ["hours.json"]);
    await fs.writeFile(process.env.HOURS_DATA_PATH, "broken json");
    assert.equal((await store.getHours()).services.nails.weekly.mon, null);
    await store.saveHours(saved);
    assert.deepEqual((await store.getHours()).services, saved.services);
  } finally {
    if (previous === undefined) delete process.env.HOURS_DATA_PATH; else process.env.HOURS_DATA_PATH = previous;
    await fs.rm(directory, { recursive: true, force: true });
  }
});

test("save action refuses forged sessions, saves authenticated edits, and revalidates public hours", async () => {
  const previous = { ...process.env };
  const directory = await fs.mkdtemp("/private/tmp/shanzo-action-test-");
  process.env.HOURS_DATA_PATH = path.join(directory, "hours.json");
  const { credentials } = testCredentials();
  let token = "forged";
  const invalidations = [];
  const load = loader({
    "@/lib/admin-credentials": credentials,
    "next/headers": { cookies: async () => ({ get: () => ({ value: token }) }) },
    "next/navigation": { redirect: destination => { throw new Error(`redirect:${destination}`); } },
    "next/cache": { revalidatePath: route => invalidations.push(route) },
  });
  try {
    const actions = load("src/app/admin/actions.ts");
    const fixture = JSON.parse(readFileSync("data/walk-in-hours.json", "utf8"));
    await assert.rejects(actions.updateHours(fixture), /redirect:\/admin\/login/);
    await assert.rejects(fs.access(process.env.HOURS_DATA_PATH));
    token = load("src/lib/admin-session.ts").createSession();
    assert.ok((await actions.updateHours({ ...fixture, timezone: "invalid" })).error);
    const result = await actions.updateHours({ ...fixture, announcement: "Owner update" });
    assert.equal(result.config.announcement, "Owner update");
    assert.ok(invalidations.includes("/hours"));
    assert.equal(JSON.parse(await fs.readFile(process.env.HOURS_DATA_PATH, "utf8")).announcement, "Owner update");
  } finally { process.env = previous; await fs.rm(directory, { recursive: true, force: true }); }
});
