"use client";

import { Switch } from "@base-ui/react/switch";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DayHours, TimeRange } from "@/data/walk-in-hours";
import { ranges } from "@/lib/walk-in-hours";
import { dayHoursSchema } from "@/lib/hours-schema";

export default function DayHoursEditor({ id, label, value, onChange }: {
  id: string; label: string; value: DayHours; onChange: (value: DayHours) => void;
}) {
  const shifts = ranges(value);
  const validation = dayHoursSchema.safeParse(value);
  const update = (index: number, key: keyof TimeRange, time: string) => onChange(shifts.map((shift, i) => i === index ? { ...shift, [key]: time } : shift));
  return (
    <fieldset className="admin-day" aria-describedby={!validation.success ? `${id}-error` : undefined}>
      <legend>{label}</legend>
      <label className="flex items-center gap-3 mb-4">
        <Switch.Root className="admin-switch" checked={value !== null} onCheckedChange={checked => onChange(checked ? [{ open: "", close: "" }] : null)}>
          <Switch.Thumb className="admin-switch-thumb" />
        </Switch.Root>
        <span>Walk-ins available</span>
      </label>
      {shifts.map((shift, index) => (
        <div className="admin-shift" key={index}>
          <label htmlFor={`${id}-${index}-open`}>Open
            <Input id={`${id}-${index}-open`} type="time" value={shift.open} onChange={event => update(index, "open", event.target.value)} />
          </label>
          <label htmlFor={`${id}-${index}-close`}>Close
            <Input id={`${id}-${index}-close`} type="time" value={shift.close} onChange={event => update(index, "close", event.target.value)} />
          </label>
          <Button type="button" variant="outline" size="icon" aria-label={`Remove ${label} shift ${index + 1}`} onClick={() => {
            const remaining = shifts.filter((_, i) => i !== index);
            onChange(remaining.length ? remaining : null);
          }}><Trash2 size={18} aria-hidden="true" /></Button>
        </div>
      ))}
      {value !== null && shifts.length < 12 && <Button type="button" variant="outline" onClick={() => onChange([...shifts, { open: "", close: "" }])}><Plus size={16} aria-hidden="true" /> Add split shift</Button>}
      {!validation.success && <p id={`${id}-error`} className="admin-error mt-3">{validation.error.issues.map(issue => issue.message).join(" ")}</p>}
    </fieldset>
  );
}
