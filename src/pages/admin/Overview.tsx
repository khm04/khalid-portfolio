/**
 * Admin Overview — quick summary cards for at-a-glance stats.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Image, Film, Award, Star, Settings, Loader2 } from "lucide-react";
import { Link } from "wouter";

type Stats = {
  unread: number;
  messages: number;
  frames: number;
  videos: number;
  certificates: number;
  testimonials: number;
};

export default function Overview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [unread, messages, frames, videos, certificates, testimonials] = await Promise.all([
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("frames").select("id", { count: "exact", head: true }),
        supabase.from("videos").select("id", { count: "exact", head: true }),
        supabase.from("certificates").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        unread: unread.count ?? 0,
        messages: messages.count ?? 0,
        frames: frames.count ?? 0,
        videos: videos.count ?? 0,
        certificates: certificates.count ?? 0,
        testimonials: testimonials.count ?? 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  const cards = stats
    ? [
        { icon: MessageSquare, label: "Unread messages", value: stats.unread,      href: "/admin/messages",     accent: stats.unread > 0 },
        { icon: MessageSquare, label: "Total messages",  value: stats.messages,    href: "/admin/messages",     accent: false },
        { icon: Image,         label: "Frames",          value: stats.frames,      href: "/admin/frames",       accent: false },
        { icon: Film,          label: "Videos",          value: stats.videos,      href: "/admin/videos",       accent: false },
        { icon: Award,         label: "Certificates",    value: stats.certificates, href: "/admin/certificates", accent: false },
        { icon: Star,          label: "Testimonials",    value: stats.testimonials, href: "/admin/testimonials", accent: false },
        { icon: Settings,      label: "Settings",        value: null,               href: "/admin/settings",     accent: false },
      ]
    : [];

  return (
    <div>
      <div className="mb-8">
        <p
          className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-2"
          style={{ fontFamily: "var(--font-body)" }}
        >
          — Overview
        </p>
        <h1
          className="text-[oklch(0.92_0.02_75)]"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 500 }}
        >
          Dashboard
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[oklch(0.55_0.02_75)]">
          <Loader2 size={16} className="animate-spin" />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>Loading stats...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.label}
                href={c.href}
                className="block p-5 bg-[oklch(0.17_0.018_55)] border border-white/8 hover:border-[oklch(0.72_0.12_65/0.4)] transition-all hover:-translate-y-0.5"
              >
                <Icon
                  size={16}
                  className={c.accent ? "text-[oklch(0.72_0.12_65)]" : "text-[oklch(0.50_0.02_75)]"}
                />
                <div
                  className={`text-3xl font-semibold mt-3 mb-1 ${c.accent ? "text-[oklch(0.72_0.12_65)]" : "text-[oklch(0.92_0.02_75)]"}`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {c.value ?? "→"}
                </div>
                <div
                  className="text-[oklch(0.50_0.02_75)] text-[10px] tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {c.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
