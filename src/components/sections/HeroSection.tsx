import { ChevronDown } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";

const FALLBACK_BG =
  "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=2400&q=80";
const FALLBACK_BLURB =
  "Cinematic storytelling through film. Every frame is a chapter, every edit a heartbeat.";

export default function HeroSection() {
  const { settings } = useSiteSettings();

  const bg = settings.hero_image_url || FALLBACK_BG;
  const stats = [
    { value: settings.stat_1_value ?? "120+", label: settings.stat_1_label ?? "Films" },
    { value: settings.stat_2_value ?? "8",    label: settings.stat_2_label ?? "Years" },
  ];

  const scrollDown = () =>
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={bg}
          alt="Cinematic hero background"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.015_55/0.85)] via-[oklch(0.10_0.015_55/0.45)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.015_55/0.90)] via-transparent to-[oklch(0.10_0.015_55/0.30)]" />
        <div className="absolute inset-0 vignette" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <div className="max-w-2xl">
          <p
            className="text-[oklch(0.72_0.12_65)] text-[11px] tracking-[0.4em] uppercase mb-6 animate-fade-up delay-200"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {settings.hero_kicker}
          </p>

          <h1
            className="animate-fade-up delay-300"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
              fontWeight: 600,
              lineHeight: 0.95,
              color: "oklch(0.95 0.02 75)",
              letterSpacing: "-0.02em",
            }}
          >
            {settings.hero_name}
          </h1>

          <h2
            className="animate-fade-up delay-400"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.2,
              color: "oklch(0.72 0.12 65)",
              marginTop: "0.25rem",
            }}
          >
            {settings.hero_tagline}
          </h2>

          <div
            className="my-7 animate-fade-up delay-500"
            style={{ width: 80, height: 1, background: "oklch(0.72 0.12 65 / 0.7)" }}
          />

          <p
            className="text-[oklch(0.75_0.02_75)] text-base lg:text-lg leading-relaxed max-w-md animate-fade-up delay-500"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            {settings.hero_blurb || FALLBACK_BLURB}
          </p>

          <div className="flex flex-wrap gap-4 mt-10 animate-fade-up delay-600">
            <button
              onClick={() =>
                document.getElementById("videography")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-[oklch(0.78_0.13_65)] transition-all duration-300 hover:shadow-lg hover:shadow-[oklch(0.72_0.12_65/0.3)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Watch the Reel
            </button>
            <button
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3.5 border border-[oklch(0.92_0.02_75/0.4)] text-[oklch(0.92_0.02_75)] text-[11px] tracking-[0.25em] uppercase font-medium hover:border-[oklch(0.72_0.12_65)] hover:text-[oklch(0.72_0.12_65)] transition-all duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[oklch(0.72_0.12_65/0.7)] hover:text-[oklch(0.72_0.12_65)] transition-colors duration-300 animate-fade-in delay-600"
        aria-label="Scroll down"
      >
        <span
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Scroll
        </span>
        <ChevronDown size={16} className="animate-bounce-arrow" />
      </button>

      {/* Stats strip */}
      <div className="absolute bottom-0 right-0 z-10 hidden lg:flex">
        {stats.map((s) => (
          <div
            key={s.label}
            className="px-8 py-5 border-l border-white/10 bg-[oklch(0.12_0.018_55/0.7)] backdrop-blur-sm text-center"
          >
            <div
              className="text-2xl font-semibold text-[oklch(0.72_0.12_65)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {s.value}
            </div>
            <div
              className="text-[9px] tracking-[0.25em] uppercase text-[oklch(0.60_0.02_75)] mt-0.5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
