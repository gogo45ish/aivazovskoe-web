import { IconClock } from "@tabler/icons-react";
import type { Restaurant } from "@/types";

interface Props {
  restaurant: Pick<Restaurant, "hours" | "scheduleNote" | "scheduleRows">;
  dark?: boolean;
}

// Renders either a single-line opening time or a meal-by-meal schedule,
// with an optional seasonal note above. Pure presentational — safe in any tree.
export default function RestaurantSchedule({ restaurant, dark }: Props) {
  const { hours, scheduleNote, scheduleRows } = restaurant;
  if (!hours && !scheduleRows?.length && !scheduleNote) return null;

  const labelColor = dark ? "text-green-300" : "text-muted";
  const valueColor = dark ? "text-sand-100" : "text-ink";

  return (
    <div className="mt-5">
      {scheduleNote ? (
        <div className={`text-[13px] mb-2 ${labelColor}`}>{scheduleNote}</div>
      ) : null}

      {hours ? (
        <div className={`inline-flex items-center gap-2 text-[14px] ${valueColor}`}>
          <IconClock size={17} className="text-brass shrink-0" />
          <span>{hours}</span>
        </div>
      ) : null}

      {scheduleRows?.length ? (
        <dl className="flex flex-wrap gap-x-8 gap-y-2">
          {scheduleRows.map((row) => (
            <div key={row.label} className="flex items-center gap-2">
              <dt className={`text-[13px] tracking-[0.04em] ${labelColor}`}>
                {row.label}
              </dt>
              <dd className={`text-[14px] tabular-nums ${valueColor}`}>
                {row.time}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
