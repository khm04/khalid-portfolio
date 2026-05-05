import { ChevronDown } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";
import { motion } from "framer-motion";

const FALLBACK_BG =
  "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=2400&q=80";
const FALLBACK_BLURB =
  "Cinematic storytelling through film. Every frame is a chapter, every edit a heartbeat.";

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 55, damping: 18 },
  },
};

const drawLine = {
  hidden: { scaleX: 0, opacity: 0 },
  show: {
    scaleX: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 55, damping: 20, delay: 0.55 },
  },
};

export default function HeroSection() {
  const { settings, loading } = useSiteSettings();

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
      className="relative w-full min-h-[100dvh] overflow-hidden flex items-center"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {!loading && (
          <motion.img
            src={bg}
            alt="Cinematic hero background"
            className="w-full h-full object-cover"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10_0.015_55/0.85)] via-[oklch(0.10_0.015_55/0.45)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.015_55/0.90)] via-transparent to-[oklch(0.10_0.015_55/0.30)]" />
        <div className="absolute inset-0 vignette" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
        <motion.div
          className="max-w-2xl"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Kicker */}
          <motion.p
            variants={fadeUp}
            className="text-[oklch(0.72_0.12_65)] text-[11px] tracking-[0.4em] uppercase mb-6"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {settings.hero_kicker}
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={fadeUp}
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
          </motion.h1>

          {/* Tagline */}
          <motion.h2
            variants={fadeUp}
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
          </motion.h2>

          {/* Animated gold rule */}
          <motion.div
            variants={drawLine}
            className="my-7 origin-left"
            style={{ width: 80, height: 1, background: "oklch(0.72 0.12 65 / 0.7)" }}
          />

          {/* Blurb */}
          <motion.p
            variants={fadeUp}
            className="text-[oklch(0.75_0.02_75)] text-base lg:text-lg leading-relaxed max-w-md"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            {settings.hero_blurb || FALLBACK_BLURB}
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-10">
            <motion.button
              onClick={() =>
                document.getElementById("videography")?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-magnetic btn-fill px-8 py-3.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] text-[11px] tracking-[0.25em] uppercase font-semibold"
              style={{ fontFamily: "var(--font-body)" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Watch the Reel
            </motion.button>
            <motion.button
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3.5 border border-[oklch(0.92_0.02_75/0.4)] text-[oklch(0.92_0.02_75)] text-[11px] tracking-[0.25em] uppercase font-medium hover:border-[oklch(0.72_0.12_65)] hover:text-[oklch(0.72_0.12_65)] transition-all duration-300"
              style={{ fontFamily: "var(--font-body)" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Get in Touch
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[oklch(0.72_0.12_65/0.7)] hover:text-[oklch(0.72_0.12_65)] transition-colors duration-300"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        whileHover={{ scale: 1.1 }}
      >
        <span
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      {/* Stats strip */}
      <motion.div
        className="absolute bottom-0 right-0 z-10 hidden lg:flex"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 55, damping: 18 }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="px-8 py-5 border-l border-white/10 bg-[oklch(0.12_0.018_55/0.7)] backdrop-blur-sm text-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 + i * 0.12, type: "spring", stiffness: 55, damping: 18 }}
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
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
