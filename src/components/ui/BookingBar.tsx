"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMinus,
  IconPlus,
  IconX,
} from "@tabler/icons-react";

// ── TravelLine constraints (per booking spec) ──
const MAX_ROOMS = 5;
const MAX_PER_ROOM = 5; // adults + children
const CHILD_MIN_AGE = 5;
const CHILD_MAX_AGE = 14;
const DEFAULT_CHILD_AGE = CHILD_MIN_AGE;
const DEFAULT_NIGHTS = 7;

interface RoomOccupancy {
  adults: number;
  childrenAges: number[];
}

// ── date helpers ──
const DAY_MS = 86_400_000;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function nightsBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);
}
/** Local-time YYYY-MM-DD — avoids the UTC shift of toISOString(). */
function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const fmtDay = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
});
const fmtMonth = new Intl.DateTimeFormat("ru-RU", {
  month: "long",
  year: "numeric",
});
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Russian plural picker: [1, 2–4, 0/5+]. */
function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
/** Monday-first column index for a JS getDay() value (0=Sun…6=Sat). */
const mondayIndex = (jsDay: number) => (jsDay + 6) % 7;

export default function BookingBar() {
  const today = useMemo(() => startOfDay(new Date()), []);

  const [checkIn, setCheckIn] = useState<Date>(() => today);
  const [checkOut, setCheckOut] = useState<Date | null>(() =>
    addDays(today, DEFAULT_NIGHTS)
  );
  const [rooms, setRooms] = useState<RoomOccupancy[]>([
    { adults: 2, childrenAges: [] },
  ]);
  const [open, setOpen] = useState<"dates" | "guests" | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const totalGuests = rooms.reduce(
    (s, r) => s + r.adults + r.childrenAges.length,
    0
  );
  const guestsLabel = `${totalGuests} ${plural(totalGuests, [
    "гость",
    "гостя",
    "гостей",
  ])}, ${rooms.length} ${plural(rooms.length, ["номер", "номера", "номеров"])}`;

  function selectDay(day: Date) {
    if (!checkOut || day <= checkIn) {
      // Start a fresh range.
      setCheckIn(day);
      setCheckOut(null);
    } else {
      setCheckOut(day);
      setOpen(null);
    }
  }

  function submit() {
    if (!checkOut) return;
    const adults = rooms.map((r) => r.adults).join(",");
    const hasChildren = rooms.some((r) => r.childrenAges.length > 0);
    const childrenAge = rooms
      .map((r) => r.childrenAges.join(";"))
      .join(",");

    // Built verbatim in TravelLine's format (commas separate rooms, semicolons
    // separate ages within a room) — the /booking widget reads these from the URL.
    const qs = [
      `date=${toISO(checkIn)}`,
      `nights=${nightsBetween(checkIn, checkOut)}`,
      `adults=${adults}`,
    ];
    if (hasChildren) qs.push(`children-age=${childrenAge}`);

    // Full-document load so TravelLine reads the params at loader init.
    window.location.assign(`/booking?${qs.join("&")}`);
  }

  return (
    <div ref={ref} className="relative">
      <div className="bg-sand-100/95 backdrop-blur-sm rounded-lg p-3.5 grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1.3fr_auto] md:max-w-220 gap-3 items-end shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] ring-1 ring-black/5">
        <FieldButton
          label="Заезд"
          value={cap(fmtDay.format(checkIn))}
          active={open === "dates"}
          onClick={() => setOpen((p) => (p === "dates" ? null : "dates"))}
        />
        <FieldButton
          label="Выезд"
          value={checkOut ? cap(fmtDay.format(checkOut)) : "Выберите"}
          active={open === "dates"}
          onClick={() => setOpen((p) => (p === "dates" ? null : "dates"))}
        />
        <FieldButton
          label="Гости"
          value={guestsLabel}
          active={open === "guests"}
          onClick={() => setOpen((p) => (p === "guests" ? null : "guests"))}
        />
        <button
          onClick={submit}
          disabled={!checkOut}
          className="btn col-span-full md:col-auto whitespace-nowrap py-3.5! disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Подобрать номер
        </button>
      </div>

      {open === "dates" && (
        <Panel className="left-0 w-80">
          <Calendar
            today={today}
            checkIn={checkIn}
            checkOut={checkOut}
            onSelect={selectDay}
          />
        </Panel>
      )}

      {open === "guests" && (
        <Panel className="left-0 md:left-auto md:right-0 w-85">
          <GuestsPanel
            rooms={rooms}
            setRooms={setRooms}
            onDone={() => setOpen(null)}
          />
        </Panel>
      )}
    </div>
  );
}

function FieldButton({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.08em] text-muted mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={onClick}
        aria-haspopup="dialog"
        aria-expanded={active}
        className={`w-full text-left bg-white border rounded-lg px-3.5 py-3 text-sm text-ink font-medium transition-colors truncate ${
          active ? "border-brass" : "border-line hover:border-brass/60"
        }`}
      >
        {value}
      </button>
    </div>
  );
}

/** Popover shell — opens upward (the hero clips downward overflow). */
function Panel({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="dialog"
      data-lenis-prevent
      className={`absolute bottom-full mb-2 z-50 max-h-[70vh] overflow-y-auto max-w-[calc(100vw-2rem)] bg-white rounded-xl p-4 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/10 ${className}`}
    >
      {children}
    </div>
  );
}

function Calendar({
  today,
  checkIn,
  checkOut,
  onSelect,
}: {
  today: Date;
  checkIn: Date;
  checkOut: Date | null;
  onSelect: (d: Date) => void;
}) {
  const [view, setView] = useState<Date>(
    () => new Date(checkIn.getFullYear(), checkIn.getMonth(), 1)
  );

  const monthStart = view;
  const daysInMonth = new Date(
    view.getFullYear(),
    view.getMonth() + 1,
    0
  ).getDate();
  const leading = mondayIndex(monthStart.getDay());
  const cells: (Date | null)[] = [
    ...Array<null>(leading).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1)
    ),
  ];

  const canGoPrev =
    view.getFullYear() > today.getFullYear() ||
    (view.getFullYear() === today.getFullYear() &&
      view.getMonth() > today.getMonth());

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          aria-label="Предыдущий месяц"
          disabled={!canGoPrev}
          onClick={() =>
            setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
          }
          className="p-1.5 rounded-md text-ink hover:bg-sand-50 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <IconChevronLeft size={18} />
        </button>
        <span className="font-serif text-ink text-[15px]">
          {cap(fmtMonth.format(view))}
        </span>
        <button
          type="button"
          aria-label="Следующий месяц"
          onClick={() =>
            setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
          }
          className="p-1.5 rounded-md text-ink hover:bg-sand-50"
        >
          <IconChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-center text-[11px] text-muted py-1 select-none"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const past = day < today;
          const isStart = sameDay(day, checkIn);
          const isEnd = checkOut && sameDay(day, checkOut);
          const inRange =
            checkOut && day > checkIn && day < checkOut;
          const endpoint = isStart || isEnd;
          return (
            <button
              key={toISO(day)}
              type="button"
              disabled={past}
              onClick={() => onSelect(day)}
              className={`h-9 rounded-md text-[13px] transition-colors ${
                past
                  ? "text-muted/40 cursor-not-allowed"
                  : endpoint
                    ? "bg-brass text-white font-medium"
                    : inRange
                      ? "bg-brass/15 text-ink"
                      : "text-ink hover:bg-sand-50"
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GuestsPanel({
  rooms,
  setRooms,
  onDone,
}: {
  rooms: RoomOccupancy[];
  setRooms: React.Dispatch<React.SetStateAction<RoomOccupancy[]>>;
  onDone: () => void;
}) {
  function update(i: number, next: RoomOccupancy) {
    setRooms((rs) => rs.map((r, idx) => (idx === i ? next : r)));
  }

  return (
    <div>
      <div className="space-y-5">
        {rooms.map((room, i) => {
          const occupancy = room.adults + room.childrenAges.length;
          const full = occupancy >= MAX_PER_ROOM;
          return (
            <div key={i} className="pb-5 border-b border-line last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif text-ink text-[15px]">
                  Номер {i + 1}
                </span>
                {rooms.length > 1 && (
                  <button
                    type="button"
                    aria-label={`Удалить номер ${i + 1}`}
                    onClick={() =>
                      setRooms((rs) => rs.filter((_, idx) => idx !== i))
                    }
                    className="text-muted hover:text-ink transition-colors"
                  >
                    <IconX size={16} />
                  </button>
                )}
              </div>

              <Stepper
                label="Взрослые"
                value={room.adults}
                onDec={() => update(i, { ...room, adults: room.adults - 1 })}
                onInc={() => update(i, { ...room, adults: room.adults + 1 })}
                canDec={room.adults > 1}
                canInc={!full}
              />

              <Stepper
                label="Дети"
                hint={`${CHILD_MIN_AGE}–${CHILD_MAX_AGE} лет`}
                value={room.childrenAges.length}
                onDec={() =>
                  update(i, {
                    ...room,
                    childrenAges: room.childrenAges.slice(0, -1),
                  })
                }
                onInc={() =>
                  update(i, {
                    ...room,
                    childrenAges: [...room.childrenAges, DEFAULT_CHILD_AGE],
                  })
                }
                canDec={room.childrenAges.length > 0}
                canInc={!full}
              />

              {room.childrenAges.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {room.childrenAges.map((age, ci) => (
                    <label key={ci} className="block">
                      <span className="block text-[11px] text-muted mb-1">
                        Возраст ребёнка {ci + 1}
                      </span>
                      <select
                        value={age}
                        onChange={(e) => {
                          const ages = [...room.childrenAges];
                          ages[ci] = Number(e.target.value);
                          update(i, { ...room, childrenAges: ages });
                        }}
                        className="w-full bg-white border border-line rounded-md px-2 py-1.5 text-sm text-ink focus:border-brass focus:outline-none"
                      >
                        {Array.from(
                          { length: CHILD_MAX_AGE - CHILD_MIN_AGE + 1 },
                          (_, k) => CHILD_MIN_AGE + k
                        ).map((a) => (
                          <option key={a} value={a}>
                            {a} {plural(a, ["год", "года", "лет"])}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 mt-5">
        {rooms.length < MAX_ROOMS ? (
          <button
            type="button"
            onClick={() =>
              setRooms((rs) => [...rs, { adults: 2, childrenAges: [] }])
            }
            className="inline-flex items-center gap-1.5 text-brass text-[14px] font-medium hover:opacity-75 transition-opacity"
          >
            <IconPlus size={16} /> Добавить номер
          </button>
        ) : (
          <span className="text-[12px] text-muted">Максимум {MAX_ROOMS} номеров</span>
        )}
        <button type="button" onClick={onDone} className="btn py-2! px-5!">
          Готово
        </button>
      </div>
    </div>
  );
}

function Stepper({
  label,
  hint,
  value,
  onDec,
  onInc,
  canDec,
  canInc,
}: {
  label: string;
  hint?: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
  canDec: boolean;
  canInc: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-3 first:mt-0">
      <div>
        <span className="text-[14px] text-ink">{label}</span>
        {hint && <span className="block text-[11px] text-muted">{hint}</span>}
      </div>
      <div className="flex items-center gap-3">
        <StepButton
          ariaLabel={`Уменьшить: ${label}`}
          disabled={!canDec}
          onClick={onDec}
        >
          <IconMinus size={16} />
        </StepButton>
        <span className="w-5 text-center text-[15px] text-ink tabular-nums">
          {value}
        </span>
        <StepButton
          ariaLabel={`Увеличить: ${label}`}
          disabled={!canInc}
          onClick={onInc}
        >
          <IconPlus size={16} />
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({
  ariaLabel,
  disabled,
  onClick,
  children,
}: {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className="flex items-center justify-center w-8 h-8 rounded-full border border-line text-ink transition-colors hover:border-brass hover:text-brass disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
