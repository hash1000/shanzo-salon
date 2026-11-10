"use client";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ExternalLink, LogOut, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "@/app/admin/actions";
import { salonHoursSchema, type SalonHours } from "@/lib/salon-hours-schema";
import { SALON_WEEK, todayDateString } from "@/lib/hours-format";
import SalonHoursList from "@/components/hours/SalonHoursList";
import SalonDayEditor from "./SalonDayEditor";

export default function SalonHoursManager({
  initial,
  now,
}: {
  initial: SalonHours;
  now: string;
}) {
  const [data, setData] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [clock, setClock] = useState(now);
  const [saving, setSaving] = useState(false);
  const [loggingOut, startLogout] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [specialDate, setSpecialDate] = useState("");
  const dirty = JSON.stringify(data) !== JSON.stringify(saved);
  const validation = salonHoursSchema.safeParse(data);
  const today = todayDateString(new Date(clock), data.timezone);
  const busy = saving || loggingOut;
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date().toISOString()), 30000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const onClick = (event: MouseEvent) => {
      const link =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (
        link &&
        link.target !== "_blank" &&
        !window.confirm("You have unsaved changes. Leave without saving?")
      )
        event.preventDefault();
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);
  function change(next: SalonHours) {
    setData(next);
    setMessage("");
    setError("");
  }
  async function save() {
    if (!validation.success || !dirty || busy) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/salon-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Could not save hours.",
        );
      const next = salonHoursSchema.parse(result);
      setData(next);
      setSaved(next);
      setMessage("Changes saved. The public salon hours are updated.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Save did not complete. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="salon-admin">
      <header className="admin-heading">
        <p className="about-label">SHANZO SALON · OWNER ACCESS</p>
        <h1>Salon Opening Hours</h1>
        <p className="mt-4">
          These hours appear on the Contact page. Walk-in hours are managed
          separately.
        </p>
        <nav className="admin-tabs mt-5" aria-label="Hours managers">
          <Link className="admin-tab" href="/admin">
            Walk-in hours
          </Link>
          <Link
            className="admin-tab"
            data-active=""
            aria-current="page"
            href="/admin/salon-hours"
          >
            Salon hours
          </Link>
        </nav>
        <div className="flex flex-wrap gap-3 items-center mt-5">
          <a
            className="about-button about-button-outline"
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
          >
            View live page <ExternalLink size={16} aria-hidden="true" />
          </a>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => {
              if (
                dirty &&
                !window.confirm(
                  "You have unsaved changes. Log out without saving?",
                )
              )
                return;
              startLogout(async () => {
                await logout();
              });
            }}
          >
            <LogOut size={16} aria-hidden="true" />
            {loggingOut ? "Logging out…" : "Logout"}
          </Button>
        </div>
        <p className="mt-4">All times use America/Chicago.</p>
      </header>
      <div className="admin-workspace">
        <form
          className="admin-editor"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <fieldset className="admin-fields" disabled={busy}>
            <section
              className="admin-panel"
              aria-labelledby="salon-weekly-title"
            >
              <h2 id="salon-weekly-title">Weekly schedule</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  change({
                    ...data,
                    weekly: Object.fromEntries(
                      SALON_WEEK.map(({ key }) => [
                        key,
                        structuredClone(data.weekly.mon),
                      ]),
                    ) as SalonHours["weekly"],
                  })
                }
              >
                Apply Monday to all days
              </Button>
              <div className="admin-days mt-4">
                {SALON_WEEK.map(({ key, label }) => (
                  <SalonDayEditor
                    key={key}
                    id={`salon-${key}`}
                    label={label}
                    value={data.weekly[key]}
                    onChange={(ranges) =>
                      change({
                        ...data,
                        weekly: { ...data.weekly, [key]: ranges },
                      })
                    }
                  />
                ))}
              </div>
            </section>
            <section
              className="admin-panel"
              aria-labelledby="special-days-title"
            >
              <h2 id="special-days-title">Special days / holidays</h2>
              <p className="mb-4">
                A special schedule replaces the weekly hours for that date. Past
                dates are hidden.
              </p>
              <label htmlFor="salon-special-date">
                Date
                <Input
                  id="salon-special-date"
                  type="date"
                  min={today}
                  value={specialDate}
                  onChange={(event) => setSpecialDate(event.target.value)}
                />
              </label>
              <Button
                type="button"
                variant="outline"
                className="mt-3 mb-4"
                disabled={
                  !/^\d{4}-\d{2}-\d{2}$/.test(specialDate) ||
                  specialDate < today ||
                  data.overrides.some((item) => item.date === specialDate)
                }
                onClick={() => {
                  change({
                    ...data,
                    overrides: [
                      ...data.overrides,
                      { date: specialDate, note: "", ranges: [] },
                    ].sort((a, b) => a.date.localeCompare(b.date)),
                  });
                  setSpecialDate("");
                }}
              >
                Add special day
              </Button>
              <div className="grid gap-5">
                {data.overrides.map((item, index) =>
                  item.date < today ? null : (
                    <div key={item.date} className="grid gap-3">
                      <label htmlFor={`salon-note-${index}`}>
                        Note for {item.date} (optional)
                        <Input
                          id={`salon-note-${index}`}
                          maxLength={80}
                          value={item.note ?? ""}
                          onChange={(event) =>
                            change({
                              ...data,
                              overrides: data.overrides.map((entry, i) =>
                                i === index
                                  ? { ...entry, note: event.target.value }
                                  : entry,
                              ),
                            })
                          }
                        />
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!item.ranges.length}
                          onChange={(event) =>
                            change({
                              ...data,
                              overrides: data.overrides.map((entry, i) =>
                                i === index
                                  ? {
                                      ...entry,
                                      ranges: event.target.checked
                                        ? []
                                        : [{ open: "10:00", close: "19:00" }],
                                    }
                                  : entry,
                              ),
                            })
                          }
                        />
                        Closed on {item.date}
                      </label>
                      <SalonDayEditor
                        id={`salon-special-${index}`}
                        label={item.date}
                        value={item.ranges}
                        onChange={(ranges) =>
                          change({
                            ...data,
                            overrides: data.overrides.map((entry, i) =>
                              i === index ? { ...entry, ranges } : entry,
                            ),
                          })
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        aria-label={`Delete special day ${item.date}`}
                        onClick={() =>
                          change({
                            ...data,
                            overrides: data.overrides.filter(
                              (_, i) => i !== index,
                            ),
                          })
                        }
                      >
                        <Trash2 size={18} aria-hidden="true" />
                        Delete special day
                      </Button>
                    </div>
                  ),
                )}
              </div>
            </section>
            {!validation.success && (
              <div className="admin-panel admin-error" role="alert">
                <p>Fix these hours before saving:</p>
                <ul>
                  {validation.error.issues.map((issue, index) => (
                    <li key={index}>
                      {issue.path.join(" · ")}: {issue.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="admin-save">
              <p role="status">
                {dirty ? "Unsaved changes" : "All changes saved"}
              </p>
              <p role="status" className="admin-success">
                {message}
              </p>
              <p role="status" className="admin-error">
                {error}
              </p>
              <div className="admin-save-actions">
                <Button
                  type="submit"
                  disabled={busy || !dirty || !validation.success}
                >
                  <Save size={18} aria-hidden="true" />
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </div>
          </fieldset>
        </form>
        <section
          className="admin-preview admin-panel"
          aria-labelledby="salon-preview-title"
        >
          <h2 id="salon-preview-title">Preview. Public only after saving.</h2>
          {validation.success ? (
            <SalonHoursList data={validation.data} now={clock} />
          ) : (
            <p>Complete valid hours to see the preview.</p>
          )}
        </section>
      </div>
    </div>
  );
}
