import { Scissors, Sparkles } from "lucide-react";
import type { WalkInConfig, Service } from "@/data/walk-in-hours";
import { formatHours, getLocalNow, getStatus, resolveHours, WEEK } from "@/lib/walk-in-hours";

export default function HoursCards({ config, now }: { config: WalkInConfig; now: string }) {
  const local = getLocalNow(new Date(now), config.timezone);
  return (
      <div className="grid gap-5 md:grid-cols-2">
        {(["hair", "nails"] as Service[]).map(service => {
          const Icon = service === "hair" ? Scissors : Sparkles;
          const today = resolveHours(config, service, local.date, local.day);
          const status = getStatus(today, local.minutes);
          const todayRanges = formatHours(today);
          return (
            <section key={service} aria-labelledby={`${service}-heading`} className="walk-card">
              <div className="flex items-center gap-3">
                <Icon size={25} aria-hidden="true" />
                <h2 id={`${service}-heading`}>{service === "hair" ? "Hair" : "Nails"}</h2>
              </div>
              <p className={`walk-badge ${status === "Open now" ? "walk-open" : ""}`}>{status}</p>
              <p className="walk-today-label">Today · {WEEK.find(day => day.key === local.day)!.label}</p>
              <div className="walk-today">
                {todayRanges.length ? todayRanges.map(range => <p key={range}>{range}</p>) : <p>Not available for walk-ins</p>}
              </div>
              {config.services[service].note?.trim() && <p className="mb-5">{config.services[service].note}</p>}
              <h3 className="walk-week-label">Weekly walk-in hours</h3>
              <dl>
                {WEEK.map(({ key, label }) => {
                  const isToday = key === local.day;
                  const hours = formatHours(isToday ? today : config.services[service].weekly[key]);
                  return (
                    <div key={key} className={`walk-row ${isToday ? "walk-current" : ""}`}>
                      <dt>{label}{isToday && <span className="block text-xs">Today</span>}</dt>
                      <dd>{hours.length ? hours.map(range => <span className="block" key={range}>{range}</span>) : "Not available for walk-ins"}</dd>
                    </div>
                  );
                })}
              </dl>
              <p className="mt-4 text-sm">Today includes any one-off changes.</p>
            </section>
          );
        })}
      </div>
  );
}
