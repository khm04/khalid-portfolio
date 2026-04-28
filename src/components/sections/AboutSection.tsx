import { useInView } from "@/hooks/useInView";
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

export default function AboutSection() {
  const { ref, inView } = useInView<HTMLElement>(0.1);
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
      <div className="absolute -left-4 top-8 section-number">02</div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p
          className={`text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          — About Khalid
        </p>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Portrait */}
          <div
            className={`relative transition-all duration-900 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-[oklch(0.72_0.12_65/0.25)]" />
              <img
                src={portrait}
                alt="Khalid — Videographer"
                className="relative z-10 w-full object-cover"
                style={{ maxHeight: 600, objectPosition: "top" }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[oklch(0.72_0.12_65)] to-transparent z-20" />
            </div>

            <div className="absolute -bottom-6 -right-4 lg:-right-8 z-20 bg-[oklch(0.72_0.12_65)] px-6 py-4 text-[oklch(0.14_0.018_55)]">
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
            </div>
          </div>

          {/* Text */}
          <div
            className={`transition-all duration-900 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
            style={{ transitionDelay: "250ms" }}
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

            <div className="gold-rule my-6" />

            <p
              className="text-[oklch(0.70_0.02_75)] leading-relaxed mb-5"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1.0625rem" }}
            >
              {p1}
            </p>
            <p
              className="text-[oklch(0.70_0.02_75)] leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1.0625rem" }}
            >
              {p2}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-10">
              {skills.map((skill) => (
                <div key={skill} className="flex items-center gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-[oklch(0.72_0.12_65)]" />
                  <span
                    className="text-[oklch(0.75_0.02_75)] text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {skill}
                  </span>
                </div>
              ))}
            </div>

            <div>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
