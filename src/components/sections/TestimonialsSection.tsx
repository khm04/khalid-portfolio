import { useInView } from "@/hooks/useInView";
import { useEffect, useState } from "react";
import { useSupabaseList } from "@/lib/useSupabaseList";
import { Quote } from "lucide-react";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  sort_order: number;
};

const FALLBACK: Testimonial[] = [
  { id: "1", quote: "Khalid has an extraordinary ability to capture emotion in a single frame. Our wedding film is beyond anything we imagined — it feels like a scene from a movie.", name: "Sara & Ahmed",   role: "Wedding Clients · 2024",            initials: "SA", sort_order: 0 },
  { id: "2", quote: "Working with Khalid on our brand campaign was transformative. He doesn't just shoot video — he crafts a visual language for your brand that resonates deeply.",  name: "Layla Hassan",   role: "Creative Director, Maison Nour",    initials: "LH", sort_order: 1 },
  { id: "3", quote: "The travel documentary Khalid produced for us won three regional awards. His eye for light and storytelling is simply unmatched.",                               name: "Omar Al-Rashid", role: "Executive Producer, Horizon Films",  initials: "OA", sort_order: 2 },
  { id: "4", quote: "Every cut Khalid delivers is a work of art. His patience, professionalism, and creative vision made our campaign unforgettable.",                               name: "Nadia Malik",    role: "Editor, Vogue Arabia",              initials: "NM", sort_order: 3 },
];

export default function TestimonialsSection() {
  const { ref, inView } = useInView<HTMLElement>(0.1);
  const { data } = useSupabaseList<Testimonial>("testimonials");
  const [active, setActive] = useState(0);

  const items = data.length > 0 ? data : FALLBACK;

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setActive((p) => (p + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  // Keep active in bounds if list shrinks
  const safeActive = active % items.length;
  const t = items[safeActive];

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[oklch(0.12_0.015_55/0.8)]" />

      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(12rem, 25vw, 22rem)",
          fontWeight: 700,
          lineHeight: 1,
          color: "oklch(0.72 0.12 65 / 0.05)",
        }}
      >
        "
      </div>

      <div
        className={`relative max-w-4xl mx-auto px-6 lg:px-10 text-center transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p
          className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-12"
          style={{ fontFamily: "var(--font-body)" }}
        >
          — Client Stories
        </p>

        <Quote size={28} className="text-[oklch(0.72_0.12_65/0.5)] mx-auto mb-8" />

        <blockquote
          key={safeActive}
          className="text-[oklch(0.88_0.02_75)] leading-relaxed mb-10 animate-fade-in"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
            fontWeight: 300,
            fontStyle: "italic",
          }}
        >
          "{t.quote}"
        </blockquote>

        <div className="flex flex-col items-center gap-2">
          <div
            className="w-10 h-10 rounded-full bg-[oklch(0.72_0.12_65)] flex items-center justify-center text-[oklch(0.14_0.018_55)] text-sm font-semibold"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {t.initials}
          </div>
          <div
            className="text-[oklch(0.92_0.02_75)] font-medium"
            style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}
          >
            {t.name}
          </div>
          <div
            className="text-[oklch(0.50_0.02_75)] text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {t.role}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all duration-300 rounded-full ${
                i === safeActive
                  ? "w-6 h-1.5 bg-[oklch(0.72_0.12_65)]"
                  : "w-1.5 h-1.5 bg-[oklch(0.72_0.12_65/0.3)] hover:bg-[oklch(0.72_0.12_65/0.6)]"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
