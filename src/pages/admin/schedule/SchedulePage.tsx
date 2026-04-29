import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

type Slot = { id: string; date: string; hour: number | null; is_full_day: boolean };

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8–20

function hourLabel(h: number) {
  if (h === 12) return "12:00 PM";
  if (h > 12) return `${h - 12}:00 PM`;
  return `${h}:00 AM`;
}

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fullDaySlot = slots.find((s) => s.is_full_day);
  const busyHourSlots = slots.filter((s) => s.hour !== null && !s.is_full_day);
  const busyHourSet = new Set(busyHourSlots.map((s) => s.hour as number));

  const load = async (date: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("availability")
      .select("*")
      .eq("date", date);
    if (error) toast.error(error.message);
    else setSlots((data as Slot[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(selectedDate); }, [selectedDate]);

  const toggleFullDay = async () => {
    setSaving(true);
    if (fullDaySlot) {
      const { error } = await supabase.from("availability").delete().eq("id", fullDaySlot.id);
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Full day cleared");
    } else {
      if (busyHourSlots.length > 0) {
        await supabase.from("availability").delete().in("id", busyHourSlots.map((s) => s.id));
      }
      const { error } = await supabase.from("availability").insert({
        date: selectedDate, hour: null, is_full_day: true,
      });
      if (error) { toast.error(error.message); setSaving(false); return; }
      toast.success("Marked as fully booked");
    }
    await load(selectedDate);
    setSaving(false);
  };

  const toggleHour = async (h: number) => {
    if (fullDaySlot) return;
    setSaving(true);
    const existing = busyHourSlots.find((s) => s.hour === h);
    if (existing) {
      const { error } = await supabase.from("availability").delete().eq("id", existing.id);
      if (error) toast.error(error.message);
    } else {
      const { error } = await supabase.from("availability").insert({
        date: selectedDate, hour: h, is_full_day: false,
      });
      if (error) toast.error(error.message);
    }
    await load(selectedDate);
    setSaving(false);
  };

  const clearAll = async () => {
    if (slots.length === 0) return;
    setSaving(true);
    const { error } = await supabase
      .from("availability")
      .delete()
      .in("id", slots.map((s) => s.id));
    if (error) toast.error(error.message);
    else toast.success("Cleared");
    await load(selectedDate);
    setSaving(false);
  };

  const lbl = "block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5";

  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-[oklch(0.92_0.02_75)] text-2xl font-semibold mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Schedule
        </h1>
        <p
          className="text-[oklch(0.45_0.02_75)] text-xs tracking-wider"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Mark which hours you're busy. Visitors see your availability on the public site.
        </p>
      </div>

      {/* Date picker */}
      <div className="mb-6">
        <label className={lbl} style={{ fontFamily: "var(--font-body)" }}>Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-[oklch(0.20_0.018_55)] border border-white/8 text-[oklch(0.88_0.02_75)] px-3 py-2 text-sm outline-none focus:border-[oklch(0.72_0.12_65/0.6)] transition-colors"
          style={{ fontFamily: "var(--font-body)", colorScheme: "dark" }}
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[oklch(0.45_0.02_75)]">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs" style={{ fontFamily: "var(--font-body)" }}>Loading…</span>
        </div>
      ) : (
        <>
          {/* Full day toggle */}
          <div className="mb-6 p-4 border border-white/5 bg-[oklch(0.17_0.018_55)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[oklch(0.88_0.02_75)] text-sm mb-0.5" style={{ fontFamily: "var(--font-body)" }}>
                  Mark full day as busy
                </p>
                <p className="text-[oklch(0.38_0.02_75)] text-[10px]" style={{ fontFamily: "var(--font-body)" }}>
                  Clears individual hours and marks the whole day
                </p>
              </div>
              <button
                onClick={toggleFullDay}
                disabled={saving}
                aria-label="Toggle full day busy"
                className={`relative flex-shrink-0 w-11 h-6 transition-colors duration-200 ${
                  fullDaySlot ? "bg-[oklch(0.72_0.12_65)]" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white transition-all duration-200 ${
                    fullDaySlot ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Hour grid */}
          <div className={`mb-6 transition-opacity ${fullDaySlot ? "opacity-40 pointer-events-none" : ""}`}>
            <label className={lbl} style={{ fontFamily: "var(--font-body)" }}>
              Busy Hours — tap to toggle
            </label>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5 lg:grid-cols-6">
              {HOURS.map((h) => {
                const isBusy = busyHourSet.has(h);
                return (
                  <button
                    key={h}
                    onClick={() => toggleHour(h)}
                    disabled={saving}
                    className={`px-2 py-2.5 text-[9px] tracking-wider border transition-colors ${
                      isBusy
                        ? "bg-[oklch(0.72_0.12_65/0.15)] border-[oklch(0.72_0.12_65/0.5)] text-[oklch(0.72_0.12_65)]"
                        : "bg-[oklch(0.17_0.018_55)] border-white/5 text-[oklch(0.45_0.02_75)] hover:border-white/15 hover:text-[oklch(0.65_0.02_75)]"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {hourLabel(h)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center gap-4">
            {slots.length > 0 && (
              <button
                onClick={clearAll}
                disabled={saving}
                className="flex items-center gap-2 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.70_0.02_75)] text-[9px] tracking-[0.2em] uppercase transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Trash2 size={11} />
                Clear all
              </button>
            )}
            {saving && (
              <div className="flex items-center gap-2 text-[oklch(0.40_0.02_75)]">
                <Loader2 size={11} className="animate-spin" />
                <span className="text-[9px]" style={{ fontFamily: "var(--font-body)" }}>Saving…</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
