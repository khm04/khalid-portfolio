import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slot = { date: string; hour: number | null; is_full_day: boolean };

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8–20
const DAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function hourLabel(h: number) {
  if (h === 12) return "12PM";
  return h > 12 ? `${h - 12}PM` : `${h}AM`;
}

function weekStart(d: Date) {
  const day = new Date(d);
  day.setDate(day.getDate() - ((day.getDay() + 6) % 7));
  day.setHours(0, 0, 0, 0);
  return day;
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function fmtDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function ScheduleSection() {
  const { ref, inView } = useInView<HTMLElement>(0.05);
  const [weekOf, setWeekOf] = useState(() => weekStart(new Date()));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekOf, i));
  const dateFrom = fmtDate(weekDates[0]);
  const dateTo = fmtDate(weekDates[6]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("availability")
        .select("date, hour, is_full_day")
        .gte("date", dateFrom)
        .lte("date", dateTo);
      setSlots((data as Slot[]) ?? []);
      setLoading(false);
    };
    load();
  }, [dateFrom, dateTo]);

  const today = fmtDate(new Date());

  const isFullDay = (d: string) => slots.some((s) => s.date === d && s.is_full_day);
  const busyHours = (d: string) =>
    new Set(slots.filter((s) => s.date === d && s.hour !== null).map((s) => s.hour as number));

  const monthLabel = (() => {
    const a = weekDates[0], b = weekDates[6];
    if (a.getMonth() === b.getMonth())
      return `${MONTH_NAMES[a.getMonth()]} ${a.getFullYear()}`;
    return `${MONTH_NAMES[a.getMonth()]} – ${MONTH_NAMES[b.getMonth()]} ${b.getFullYear()}`;
  })();

  return (
    <section id="schedule" ref={ref} className="relative py-24 lg:py-36 overflow-hidden">
      <div className="absolute left-2 top-8 section-number">6</div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className={`mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p
            className="text-[oklch(0.72_0.12_65)] text-[9px] tracking-[0.35em] uppercase mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            — AVAILABILITY
          </p>
          <h2
            className="text-[oklch(0.92_0.02_75)]"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 600, lineHeight: 1.1 }}
          >
            When I'm{" "}
            <span className="italic text-[oklch(0.72_0.12_65)]">Free</span>
          </h2>
        </div>

        {/* Week navigation */}
        <div className={`flex items-center gap-4 mb-8 transition-all duration-700 delay-100 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <button
            onClick={() => setWeekOf(addDays(weekOf, -7))}
            className="p-1.5 border border-white/10 hover:border-[oklch(0.72_0.12_65/0.4)] text-[oklch(0.55_0.02_75)] hover:text-[oklch(0.72_0.12_65)] transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <span
            className="text-[oklch(0.55_0.02_75)] text-[10px] tracking-[0.2em] uppercase min-w-[140px] text-center"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {monthLabel}
          </span>
          <button
            onClick={() => setWeekOf(addDays(weekOf, 7))}
            className="p-1.5 border border-white/10 hover:border-[oklch(0.72_0.12_65/0.4)] text-[oklch(0.55_0.02_75)] hover:text-[oklch(0.72_0.12_65)] transition-colors"
          >
            <ChevronRight size={14} />
          </button>
          {loading && (
            <span className="text-[oklch(0.35_0.02_75)] text-[9px]" style={{ fontFamily: "var(--font-body)" }}>
              loading…
            </span>
          )}
        </div>

        {/* Days */}
        <div className={`space-y-2 transition-all duration-700 delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {weekDates.map((date, i) => {
            const ds = fmtDate(date);
            const full = isFullDay(ds);
            const busy = busyHours(ds);
            const isToday = ds === today;
            const isPast = ds < today;

            return (
              <div
                key={ds}
                className={`flex items-center gap-4 px-4 py-3 border transition-colors ${
                  isToday
                    ? "border-[oklch(0.72_0.12_65/0.25)] bg-[oklch(0.72_0.12_65/0.04)]"
                    : "border-white/5 bg-[oklch(0.17_0.018_55)]"
                } ${isPast ? "opacity-35" : ""}`}
              >
                {/* Day label */}
                <div className="w-16 flex-shrink-0">
                  <p
                    className="text-[oklch(0.40_0.02_75)] text-[8px] tracking-[0.25em] uppercase"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {DAY_NAMES[i]}
                  </p>
                  <p
                    className="text-[oklch(0.78_0.02_75)] text-sm"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {date.getDate()}{" "}
                    <span className="text-xs text-[oklch(0.45_0.02_75)]">
                      {MONTH_NAMES[date.getMonth()]}
                    </span>
                  </p>
                </div>

                {/* Availability */}
                <div className="flex-1 min-w-0">
                  {full ? (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.12_65)]" />
                      <span
                        className="text-[oklch(0.72_0.12_65)] text-[8px] tracking-[0.3em] uppercase"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Fully Booked
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-0.5 flex-wrap">
                      {HOURS.map((h) => {
                        const isBusy = busy.has(h);
                        return (
                          <div
                            key={h}
                            title={`${hourLabel(h)} — ${isBusy ? "Busy" : "Free"}`}
                            className={`w-[22px] h-[22px] flex items-center justify-center text-[6px] transition-colors ${
                              isBusy
                                ? "bg-[oklch(0.72_0.12_65/0.20)] text-[oklch(0.72_0.12_65)]"
                                : "bg-white/4 text-[oklch(0.30_0.02_75)]"
                            }`}
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {h}
                          </div>
                        );
                      })}
                      {busy.size === 0 && (
                        <span
                          className="text-[oklch(0.35_0.02_75)] text-[8px] tracking-[0.2em] uppercase self-center ml-1"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          All Free
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Today badge */}
                {isToday && (
                  <span
                    className="flex-shrink-0 text-[oklch(0.72_0.12_65)] text-[7px] tracking-[0.3em] uppercase border border-[oklch(0.72_0.12_65/0.3)] px-2 py-0.5"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Today
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className={`flex items-center gap-6 mt-5 transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/4 border border-white/5" />
            <span className="text-[oklch(0.35_0.02_75)] text-[8px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-body)" }}>Free</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[oklch(0.72_0.12_65/0.20)]" />
            <span className="text-[oklch(0.35_0.02_75)] text-[8px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-body)" }}>Busy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.12_65)]" />
            <span className="text-[oklch(0.35_0.02_75)] text-[8px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-body)" }}>Fully Booked</span>
          </div>
        </div>

      </div>
    </section>
  );
}
