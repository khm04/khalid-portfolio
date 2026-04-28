/**
 * Admin Dashboard — Phase 2 placeholder.
 * Phase 3 will replace this with a real sidebar layout containing:
 *   - Analytics (Umami embed)
 *   - Messages inbox
 *   - Frames manager
 *   - Videos manager
 *   - Certificates manager
 *   - Testimonials manager
 */
import { useAuth } from "@/lib/useAuth";
import { LogOut, MessageSquare, Image, Film, Award, Star, BarChart3 } from "lucide-react";
import { Link } from "wouter";

const sections = [
  { icon: BarChart3,     label: "Analytics",    href: "/admin/analytics",    note: "Page views, visits, referrers, regions" },
  { icon: MessageSquare, label: "Messages",     href: "/admin/messages",     note: "Inbox of contact-form submissions" },
  { icon: Image,         label: "Frames",       href: "/admin/frames",       note: "Manage stills shown on the homepage" },
  { icon: Film,          label: "Videos",       href: "/admin/videos",       note: "Showreel + project reel" },
  { icon: Award,         label: "Certificates", href: "/admin/certificates", note: "Credentials shown on homepage" },
  { icon: Star,          label: "Testimonials", href: "/admin/testimonials", note: "Client quotes" },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <main className="min-h-screen px-6 lg:px-10 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-12">
          <div>
            <p
              className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              — Admin
            </p>
            <h1
              className="text-[oklch(0.92_0.02_75)]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 500,
                lineHeight: 1.05,
              }}
            >
              Welcome back,
              <br />
              <em className="text-[oklch(0.72_0.12_65)]">Khalid</em>
            </h1>
            <p
              className="text-[oklch(0.50_0.02_75)] text-sm mt-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Signed in as {user?.email}
            </p>
          </div>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-5 py-2 border border-white/10 text-[oklch(0.65_0.02_75)] hover:border-[oklch(0.72_0.12_65/0.5)] hover:text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.25em] uppercase transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>

        <div className="gold-rule mb-12" />

        {/* Section grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.label}
                href={s.href}
                className="group block p-6 bg-[oklch(0.17_0.018_55)] border border-white/8 hover:border-[oklch(0.72_0.12_65/0.4)] hover:-translate-y-1 transition-all duration-400"
              >
                <div className="w-11 h-11 border border-[oklch(0.72_0.12_65/0.4)] flex items-center justify-center mb-5 group-hover:bg-[oklch(0.72_0.12_65/0.1)] transition-colors">
                  <Icon size={18} className="text-[oklch(0.72_0.12_65)]" />
                </div>
                <h3
                  className="text-[oklch(0.92_0.02_75)] text-xl mb-2"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                >
                  {s.label}
                </h3>
                <p
                  className="text-[oklch(0.55_0.02_75)] text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {s.note}
                </p>
                <p
                  className="text-[oklch(0.40_0.02_75)] text-[9px] tracking-[0.25em] uppercase mt-5"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Coming in Phase 3
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
