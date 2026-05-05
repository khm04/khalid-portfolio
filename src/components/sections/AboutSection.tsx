import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSiteSettings } from "@/lib/useSiteSettings";

const FALLBACK_PORTRAIT = "/portrait.jpg";
const FALLBACK_SKILLS = [
  "Wedding Films",
  "Commercials & Brand",
  "Documentary",
  "Music Videos",
  "Aerial / Drone",
  "Color Grading",
];
const FALLBACK_P1 =
  "I'm Khalid — a filmmaker with over eight years of experience crafting visual stories that resonate. My work lives at the intersection of motion, light, and authentic human moments.";
const FALLBACK_P2 =
  "Whether I'm on a remote mountain at dawn or in the middle of a wedding reception, I bring the same obsessive attention to pacing, color, and the quiet moments that define a story.";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 55, damping: 20, delay },
  }),
};

const slideIn = (direction: "left" | "right") => ({
  hidden: { opacity: 0, x: direction === "left" ? -60 : 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 50, damping: 20, delay: 0.1 },
  },
});

const staggerSkills = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } },
};

const skillItem = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 18 },
  },
};

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const { settings } = useSiteSettings();
  const portrait = settings.about_portrait_url || FALLBACK_PORTRAIT;
  const skills = settings.about_skills.length > 0 ? settings.about_skills : FALLBACK_SKILLS;
  const p1 = settings.about_story_p1 || FALLBACK_P1;
  const p2 = settings.about_story_p2 || FALLBACK_P2;
  const years = settings.about_years || "8+";

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 lg:py-36 overflow-hidden"
    >
      <div className="absolute left-2 top-8 section-number">2</div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.p
          className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-16"
          style={{ fontFamily: "var(--font-body)" }}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          variants={fadeUp}
          custom={0}
        >
          — About Me
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Portrait — slides in from left with hover tilt */}
          <motion.div
            className="relative"
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={slideIn("left")}
            whileHover={{ rotateY: 3, rotateX: -2, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            style={{ transformStyle: "preserve-3d", perspective: 800 }}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-[oklch(0.72_0.12_65/0.25)]" />
              <img
                src={portrait}
                alt="Khalid — Videographer"
                className="relative z-10 w-full object-cover"
                style={{ maxHeight: 600, objectPosition: "top" }}
              />
              {/* Animated gold bottom rule */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px z-20 origin-left"
                style={{ background: "linear-gradient(to right, oklch(0.72 0.12 65), transparent)" }}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {/* Years badge */}
            <motion.div
              className="absolute -bottom-6 -right-4 lg:-right-8 z-20 bg-[oklch(0.72_0.12_65)] px-6 py-4 text-[oklch(0.14_0.018_55)]"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 80, damping: 16 }}
            >
              <div
                className="text-3xl font-bold leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {years}
              </div>
              <div
                className="text-[9px] tracking-[0.2em] uppercase mt-1 font-medium"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Years of<br />Experience
              </div>
            </motion.div>
          </motion.div>

          {/* Text — slides in from right */}
          <motion.div
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            variants={slideIn("right")}
          >
            <h2
              className="text-[oklch(0.92_0.02_75)] mb-2"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 500,
                lineHeight: 1.05,
              }}
            >
              The Eye Behind
              <br />
              <em className="text-[oklch(0.72_0.12_65)]">the Lens</em>
            </h2>

            {/* Animated gold rule */}
            <motion.div
              className="my-6 origin-left"
              style={{
                height: 1,
                background: "linear-gradient(to right, transparent, oklch(0.72 0.12 65 / 0.7), transparent)",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.p
              className="text-[oklch(0.70_0.02_75)] leading-relaxed mb-5"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1.0625rem" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 55, damping: 20 }}
            >
              {p1}
            </motion.p>
            <motion.p
              className="text-[oklch(0.70_0.02_75)] leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1.0625rem" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.42, type: "spring", stiffness: 55, damping: 20 }}
            >
              {p2}
            </motion.p>

            {/* Staggered skill tags */}
            <motion.div
              className="grid grid-cols-2 gap-3 mb-10"
              variants={staggerSkills}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
            >
              {skills.map((skill) => (
                <motion.div
                  key={skill}
                  className="flex items-center gap-2.5"
                  variants={skillItem}
                >
                  <motion.span
                    className="w-1 h-1 rounded-full bg-[oklch(0.72_0.12_65)]"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
                  />
                  <span
                    className="text-[oklch(0.75_0.02_75)] text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {skill}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
            >
              <div
                className="text-[oklch(0.92_0.02_75)] text-2xl"
                style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}
              >
                {settings.hero_name}
              </div>
              <div
                className="text-[oklch(0.55_0.02_75)] text-[10px] tracking-[0.25em] uppercase mt-0.5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {settings.hero_kicker}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
