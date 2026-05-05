/**
 * ServicesSection — videography packages.
 * Edit copy/prices freely; admin will be able to manage these in a later phase.
 */
import { useInView } from "@/hooks/useInView";
import { Check, Heart, Film, Palette, Megaphone } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Wedding Films",
    tagline: "Your story, beautifully told",
    price: "From $2,800",
    features: [
      "Full-day coverage (10 hrs)",
      "Cinematic 5–8 min film",
      "Highlight reel for socials",
      "Drone footage if permitted",
      "Licensed soundtrack",
      "Delivery in 4 weeks",
    ],
    featured: true,
  },
  {
    icon: Film,
    title: "Cinematic Short",
    tagline: "Motion that moves people",
    price: "From $1,200",
    features: [
      "Half-day production",
      "Professional color grading",
      "Licensed music",
      "3–5 minute final cut",
      "2 rounds of revisions",
    ],
  },
  {
    icon: Megaphone,
    title: "Brand & Commercial",
    tagline: "Visual identity, elevated",
    price: "From $1,500",
    features: [
      "Concept + storyboard",
      "Half-day shoot",
      "Social-optimized cuts (16:9, 9:16, 1:1)",
      "Unlimited usage license",
      "Delivery within 7 days",
    ],
  },
  {
    icon: Palette,
    title: "Music Video / Custom",
    tagline: "Pure creative play",
    price: "From $900",
    features: [
      "Creative direction included",
      "Half-day to full-day shoot",
      "Cinematic color grade",
      "Custom edit to track",
      "1 round of revisions",
    ],
  },
];

export default function ServicesSection() {
  const { ref, inView } = useInView<HTMLElement>(0.05);

  return (
    <section id="services" ref={ref} className="relative py-24 lg:py-36 overflow-hidden">
      <div className="absolute left-2 top-8 section-number">5</div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p
            className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            — Services &amp; Pricing
          </p>
          <h2
            className="text-[oklch(0.92_0.02_75)]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
              fontWeight: 500,
              lineHeight: 1.05,
            }}
          >
            Crafted Experiences,
            <br />
            <em className="text-[oklch(0.72_0.12_65)]">Transparent Pricing</em>
          </h2>
          <div className="gold-rule mt-6 max-w-xs mx-auto" />
        </div>

        {/* Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className={`relative flex flex-col p-7 transition-all duration-400 hover:-translate-y-1 ${
                  s.featured
                    ? "bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)]"
                    : "bg-[oklch(0.17_0.018_55)] border border-white/8 hover:border-[oklch(0.72_0.12_65/0.3)]"
                }`}
              >
                {s.featured && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[oklch(0.14_0.018_55)] text-[oklch(0.72_0.12_65)] text-[8px] tracking-[0.3em] uppercase px-3 py-1 whitespace-nowrap"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Most Popular
                  </div>
                )}

                <Icon
                  size={22}
                  className={s.featured ? "text-[oklch(0.14_0.018_55)]" : "text-[oklch(0.72_0.12_65)]"}
                />

                <h3
                  className={`mt-4 mb-1 text-xl font-medium ${
                    s.featured ? "text-[oklch(0.14_0.018_55)]" : "text-[oklch(0.92_0.02_75)]"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.title}
                </h3>
                <p
                  className={`text-xs mb-5 ${
                    s.featured ? "text-[oklch(0.25_0.018_55)]" : "text-[oklch(0.55_0.02_75)]"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {s.tagline}
                </p>

                <div
                  className="gold-rule mb-5"
                  style={{ background: s.featured ? "oklch(0.14 0.018 55 / 0.3)" : undefined }}
                />

                <div
                  className={`text-2xl font-semibold mb-5 ${
                    s.featured ? "text-[oklch(0.14_0.018_55)]" : "text-[oklch(0.72_0.12_65)]"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.price}
                </div>

                <ul className="flex flex-col gap-2.5 flex-1">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        size={13}
                        className={`mt-0.5 flex-shrink-0 ${
                          s.featured ? "text-[oklch(0.14_0.018_55)]" : "text-[oklch(0.72_0.12_65)]"
                        }`}
                      />
                      <span
                        className={`text-sm leading-snug ${
                          s.featured ? "text-[oklch(0.20_0.018_55)]" : "text-[oklch(0.65_0.02_75)]"
                        }`}
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className={`mt-7 w-full py-2.5 text-[10px] tracking-[0.25em] uppercase font-medium transition-all duration-300 ${
                    s.featured
                      ? "bg-[oklch(0.14_0.018_55)] text-[oklch(0.72_0.12_65)] hover:bg-[oklch(0.20_0.018_55)]"
                      : "border border-[oklch(0.72_0.12_65/0.5)] text-[oklch(0.72_0.12_65)] hover:bg-[oklch(0.72_0.12_65/0.1)]"
                  }`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Book This
                </button>
              </div>
            );
          })}
        </div>

        <p
          className="text-center text-[oklch(0.50_0.02_75)] text-sm mt-8"
          style={{ fontFamily: "var(--font-body)" }}
        >
          All packages are customizable. Contact for bespoke quotes.
        </p>
      </div>
    </section>
  );
}
