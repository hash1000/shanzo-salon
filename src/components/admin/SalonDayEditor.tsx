"use client";
import { Switch } from "@base-ui/react/switch";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { salonDaySchema } from "@/lib/salon-hours-schema";
import type { SalonRanges } from "@/lib/hours-format";

export default function SalonDayEditor({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: SalonRanges;
  onChange: (value: SalonRanges) => void;
}) {
  const validation = salonDaySchema.safeParse(value);
  return (
    <fieldset
      className="admin-day"
      aria-describedby={!validation.success ? `${id}-error` : undefined}
    >
      <legend>{label}</legend>
      <label className="flex items-center gap-3 mb-4">
        <Switch.Root
          className="admin-switch"
          checked={value.length > 0}
          onCheckedChange={(checked) =>
            onChange(checked ? [{ open: "10:00", close: "19:00" }] : [])
          }
        >
          <Switch.Thumb className="admin-switch-thumb" />
        </Switch.Root>
        <span>Open</span>
      </label>
      {value.map((shift, index) => (
        <div className="admin-shift" key={index}>
          {(["open", "close"] as const).map((key) => (
            <label key={key} htmlFor={`${id}-${index}-${key}`}>
              {key === "open" ? "Open" : "Close"}
              <Input
                id={`${id}-${index}-${key}`}
                type="time"
                step="900"
                value={shift[key]}
                aria-invalid={!validation.success}
                onChange={(event) =>
                  onChange(
                    value.map((item, i) =>
                      i === index
                        ? { ...item, [key]: event.target.value }
                        : item,
                    ),
                  )
                }
              />
            </label>
          ))}
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Remove ${label} shift ${index + 1}`}
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            <Trash2 size={18} aria-hidden="true" />
          </Button>
        </div>
      ))}
      {value.length > 0 && value.length < 3 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange([...value, { open: "", close: "" }])}
        >
          <Plus size={16} aria-hidden="true" />
          Add split shift
        </Button>
      )}
      {!validation.success && (
        <p id={`${id}-error`} className="admin-error mt-3">
          {validation.error.issues.map((issue) => issue.message).join(" ")}
        </p>
      )}
    </fieldset>
  );
}
