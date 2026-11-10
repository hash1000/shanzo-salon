import type { SalonHours } from "@/lib/salon-hours-schema";
import {
  chicagoNow,
  todayDateString,
  isOpenNow,
  formatSalonRanges,
  SALON_WEEK,
} from "@/lib/hours-format";
import "./salon-hours.css";

export default function SalonHoursList({
  data,
  now,
}: {
  data: SalonHours;
  now: string;
}) {
  const date = new Date(now);
  const local = chicagoNow(date, data.timezone);
  const override = data.overrides.find(
    (item) => item.date === todayDateString(date, data.timezone),
  );
  const today = override?.ranges ?? data.weekly[local.day];
  return (
    <div className="salon-hours-list">
      <div className="contact-hours-heading">
        <h3>Opening hours</h3>
        <span className="contact-open-badge">
          {isOpenNow(today, local.minutes) ? "Open now" : "Closed now"}
        </span>
      </div>
      <table>
        <caption className="sr-only">Salon hours in {data.timezone}</caption>
        <tbody>
          {SALON_WEEK.map(({ key, label }) => (
            <tr
              key={key}
              className={key === local.day ? "contact-today today" : undefined}
            >
              <th scope="row">
                {label}
                {key === local.day && <span className="sr-only"> (today)</span>}
              </th>
              <td>
                {formatSalonRanges(
                  key === local.day ? today : data.weekly[key],
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {override?.note && <p className="salon-hours-note">{override.note}</p>}
    </div>
  );
}
