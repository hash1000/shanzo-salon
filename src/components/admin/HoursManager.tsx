"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs } from "@base-ui/react/tabs";
import { unstable_rethrow } from "next/navigation";
import { ExternalLink, LogOut, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DayHoursEditor from "@/components/admin/DayHoursEditor";
import HoursCards from "@/components/hours/HoursCards";
import { hoursSchema } from "@/lib/hours-schema";
import { getLocalNow, WEEK } from "@/lib/walk-in-hours";
import { logout, updateHours } from "@/app/admin/actions";
import type { Service, WalkInConfig } from "@/data/walk-in-hours";

type Override = NonNullable<WalkInConfig["overrides"]>[number];
const SERVICES: Service[] = ["hair", "nails"];
const title = (service: Service) => service === "hair" ? "Hair" : "Nails";
const clone = <T,>(value: T): T => structuredClone(value);

export default function HoursManager({ initial, now }: { initial: WalkInConfig; now: string }) {
  const [clock, setClock] = useState(now);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLElement>(null);
  const [loggingOut, startLogout] = useTransition();
  const initialToday = getLocalNow(new Date(now), initial.timezone).date;
  const { control, register, handleSubmit, setValue, getValues, reset, formState: { isDirty, isSubmitting } } = useForm<WalkInConfig>({
    resolver: zodResolver(hoursSchema),
    defaultValues: { ...initial, overrides: initial.overrides?.filter(item => item.date >= initialToday) ?? [] },
  });
  const config = useWatch({ control }) as WalkInConfig;
  const validation = hoursSchema.safeParse(config);
  const today = getLocalNow(new Date(clock), config.timezone).date;
  const overrides = config.overrides ?? [];
  const todayOverride = overrides.find(item => item.date === today);
  const unsaved = isDirty;

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date().toISOString()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!unsaved) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (link && link.target !== "_blank" && !window.confirm("You have unsaved changes. Leave without saving?")) event.preventDefault();
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", onClick, true);
    return () => { window.removeEventListener("beforeunload", beforeUnload); document.removeEventListener("click", onClick, true); };
  }, [unsaved]);

  const changed = () => { setMessage(""); setError(""); };
  const setOverrides = (next: Override[]) => { changed(); setValue("overrides", next, { shouldDirty: true }); };
  function closeToday(services: Service[], reopen: boolean) {
    const existing = clone(getValues("overrides") ?? []);
    const entry = existing.find(item => item.date === today) ?? { date: today };
    for (const service of services) {
      if (reopen) { if (entry[service] === null) delete entry[service]; }
      else entry[service] = null;
    }
    const next = existing.filter(item => item.date !== today);
    if (entry.hair !== undefined || entry.nails !== undefined) next.push(entry);
    setOverrides(next.sort((a, b) => a.date.localeCompare(b.date)));
  }

  return (
    <>
      <header className="admin-heading">
        <div><p className="about-label">Shanzo Salon · Owner access</p><h1>Walk-in Hours Manager</h1></div>
        <div className="flex flex-wrap gap-3 items-center mt-5">
          <a href="/hours" target="_blank" rel="noopener noreferrer" className="about-button about-button-outline">View live page <ExternalLink size={16} aria-hidden="true" /></a>
          <Button type="button" variant="outline" disabled={loggingOut || isSubmitting} onClick={() => {
            if (unsaved && !window.confirm("You have unsaved changes. Log out without saving?")) return;
            startLogout(async () => { await logout(); });
          }}><LogOut size={16} aria-hidden="true" />{loggingOut ? "Logging out…" : "Logout"}</Button>
        </div>
        <p className="mt-4">All times use {config.timezone}. Changes go live when you save.</p>
      </header>

      <div className="admin-workspace">
        <form className="admin-editor" onSubmit={handleSubmit(async values => {
          setError(""); setMessage("");
          try {
            const result = await updateHours(values);
            if (result.error) { setError(result.error); return; }
            if (result.config) { reset(result.config); setMessage("Changes saved. The public hours page is updated."); }
          } catch (cause) {
            unstable_rethrow(cause);
            setError("Save did not complete. Check your connection and try again.");
          }
        })} onChange={changed}>
          <fieldset disabled={isSubmitting || loggingOut} className="admin-fields">
            <section className="admin-panel" aria-labelledby="quick-title">
              <h2 id="quick-title">Today’s quick actions</h2>
              <p className="mb-4">{today} · Reopen removes today’s closure and restores the weekly schedule. These actions also need saving.</p>
              <div className="flex flex-wrap gap-3">
                {SERVICES.map(service => <Button key={service} type="button" variant="outline" onClick={() => closeToday([service], todayOverride?.[service] === null)}>
                  {todayOverride?.[service] === null ? `Reopen ${title(service)} today` : `Close ${title(service)} today`}
                </Button>)}
                <Button type="button" variant="outline" onClick={() => closeToday(SERVICES, todayOverride?.hair === null && todayOverride?.nails === null)}>
                  {todayOverride?.hair === null && todayOverride?.nails === null ? "Reopen both today" : "Close both today"}
                </Button>
              </div>
            </section>

            <section className="admin-panel" aria-labelledby="schedule-title">
              <h2 id="schedule-title">Weekly schedules</h2>
              <div className="flex flex-wrap gap-3 mb-5">
                {SERVICES.map(service => <Button key={service} type="button" variant="outline" onClick={() => {
                  const target = service === "hair" ? "nails" : "hair";
                  if (!window.confirm(`Replace ${title(target)}’s weekly schedule with ${title(service)}’s?`)) return;
                  changed(); setValue(`services.${target}.weekly`, clone(getValues(`services.${service}.weekly`)), { shouldDirty: true });
                }}>Copy {title(service)} to {title(service === "hair" ? "nails" : "hair")}</Button>)}
              </div>
              <Tabs.Root defaultValue="hair">
                <Tabs.List className="admin-tabs" aria-label="Service schedule">
                  {SERVICES.map(service => <Tabs.Tab className="admin-tab" key={service} value={service}>{title(service)}</Tabs.Tab>)}
                </Tabs.List>
                {SERVICES.map(service => <Tabs.Panel key={service} value={service} className="pt-5">
                  <Button type="button" variant="outline" onClick={() => {
                    if (!window.confirm(`Apply Monday’s hours to every ${title(service)} day?`)) return;
                    changed(); for (const day of WEEK) setValue(`services.${service}.weekly.${day.key}`, clone(getValues(`services.${service}.weekly.mon`)), { shouldDirty: true });
                  }}>Apply Monday to all days</Button>
                  <div className="admin-days mt-4">
                    {WEEK.map(day => <DayHoursEditor key={day.key} id={`${service}-${day.key}`} label={day.label} value={config.services[service].weekly[day.key]}
                      onChange={value => { changed(); setValue(`services.${service}.weekly.${day.key}`, value, { shouldDirty: true }); }} />)}
                  </div>
                  <div className="grid gap-2 mt-5"><Label htmlFor={`${service}-note`}>{title(service)} note (optional)</Label>
                    <Textarea id={`${service}-note`} maxLength={1000} {...register(`services.${service}.note`)} />
                  </div>
                </Tabs.Panel>)}
              </Tabs.Root>
            </section>

            <section className="admin-panel" aria-labelledby="announcement-title">
              <h2 id="announcement-title">Announcement</h2>
              <Label htmlFor="announcement">Banner text · leave empty to hide</Label>
              <Textarea id="announcement" className="mt-3" maxLength={2000} {...register("announcement")} />
            </section>

            {!validation.success && <div className="admin-error admin-panel" role="alert"><p>Fix these hours before saving:</p><ul>{validation.error.issues.map((issue, index) => <li key={index}>{issue.path.join(" · ")}: {issue.message}</li>)}</ul></div>}
            <div className="admin-save">
              <p aria-live="polite">{isDirty ? "Unsaved changes" : "All changes saved"}</p>
              <p role="status" className="admin-success">{message}</p>
              <p role="alert" className="admin-error">{error}</p>
              <div className="admin-save-actions">
                <Button type="button" variant="outline" className="admin-preview-button" aria-controls="admin-preview" onClick={() => {
                  previewRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
                  previewRef.current?.focus({ preventScroll: true });
                }}>Preview</Button>
                <Button type="submit" disabled={isSubmitting || !isDirty || !validation.success}><Save size={18} aria-hidden="true" />{isSubmitting ? "Saving…" : "Save changes"}</Button>
              </div>
            </div>
          </fieldset>
        </form>

        <section id="admin-preview" ref={previewRef} tabIndex={-1} className="walk-hours admin-preview" aria-labelledby="preview-title">
          <div className="admin-preview-heading">
            <h2 id="preview-title">Live preview</h2>
            {isDirty && <span className="admin-unsaved-badge">Unsaved changes</span>}
          </div>
          <p className="mb-5">Preview of your edits · changes are public only after saving.</p>
          {validation.success ? <>
            {config.announcement?.trim() && <aside className="walk-announcement" aria-label="Preview announcement">{config.announcement}</aside>}
            <HoursCards config={config} now={clock} />
          </> : <p>Complete valid hours to see the preview.</p>}
        </section>
      </div>
    </>
  );
}
