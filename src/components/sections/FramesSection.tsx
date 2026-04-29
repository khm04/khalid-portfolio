import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useSupabaseList } from "@/lib/useSupabaseList";
import { X, ZoomIn, Loader2 } from "lucide-react";

type Frame = {
  id: string;
  title: string;
  film: string;
  image_url: string;
  span: "default" | "tall" | "wide";
  sort_order: number;
};

const FALLBACK_FRAMES: Frame[] = [
  { id: "1", image_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80", title: "First Light",     film: "From: Wedding Film · Amman 2024",  span: "tall",    sort_order: 0 },
  { id: "2", image_url: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?auto=format&fit=crop&w=1200&q=80", title: "The Empty Chair", film: "From: Short Film · 2024",           span: "default", sort_order: 1 },
  { id: "3", image_url: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=1200&q=80", title: "Ridge at Dusk",  film: "From: Travel Doc · 2023",           span: "default", sort_order: 2 },
  { id: "4", image_url: "https://images.unsplash.com/photo-1517666094011-99c5a73d2415?auto=format&fit=crop&w=1200&q=80", title: "Ceremony",       film: "From: Wedding Film · Aqaba 2024",   span: "wide",    sort_order: 3 },
  { id: "5", image_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80", title: "Held Breath",    film: "From: Music Video · 2024",          span: "default", sort_order: 4 },
  { id: "6", image_url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80", title: "Window",         film: "From: Brand Film · 2023",           span: "default", sort_order: 5 },
];

export default function FramesSection() {
  const { ref, inView } = useInView<HTMLElement>(0.05);
  const { data, loading } = useSupabaseList<Frame>("frames");
  const [lightbox, setLightbox] = useState<Frame | null>(null);

  const frames = data.length > 0 ? data : FALLBACK_FRAMES;

  return (
    <section
      id="frames"
      ref={ref}
      className="relative py-24 lg:py-36 overflow-hidden"
    >
      <div className="absolute right-2 top-8 section-number">4</div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div>
            <p
              className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              — Frames
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
              Stills from
              <br />
              <em className="text-[oklch(0.72_0.12_65)]">the Cutting Room</em>
            </h2>
          </div>

          <p
            className="text-[oklch(0.55_0.02_75)] text-sm max-w-md leading-relaxed"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            A single frame from a film tells its own story. These are some I keep
            coming back to — the ones I'd hang on a wall.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[oklch(0.72_0.12_65)]" />
          </div>
        ) : (
          <div
            className={`flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "150ms", scrollbarWidth: "none" }}
          >
            {frames.map((frame) => (
              <button
                key={frame.id}
                onClick={() => setLightbox(frame)}
                className={`snap-start flex-shrink-0 w-[78vw] sm:w-auto relative group overflow-hidden text-left ${
                  frame.span === "tall" ? "sm:row-span-2" : ""
                } ${frame.span === "wide" ? "sm:col-span-2" : ""}`}
                style={{
                  aspectRatio:
                    frame.span === "tall" ? "auto" : frame.span === "wide" ? "21/9" : "4/3",
                  minHeight: frame.span === "tall" ? 480 : undefined,
                }}
              >
                <img
                  src={frame.image_url}
                  alt={frame.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.015_55/0.85)] via-[oklch(0.72_0.12_65/0.10)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p
                        className="text-[oklch(0.72_0.12_65)] text-[9px] tracking-[0.3em] uppercase mb-1"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {frame.film}
                      </p>
                      <h3
                        className="text-[oklch(0.95_0.02_75)] text-lg font-medium"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {frame.title}
                      </h3>
                    </div>
                    <ZoomIn size={20} className="text-[oklch(0.72_0.12_65)] flex-shrink-0 mb-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <div
            className="max-w-5xl max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.image_url}
              alt={lightbox.title}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <p
              className="text-center text-[oklch(0.72_0.12_65)] mt-3 italic"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}
            >
              {lightbox.title}
            </p>
            <p
              className="text-center text-[oklch(0.50_0.02_75)] text-[10px] tracking-[0.3em] uppercase mt-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {lightbox.film}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
