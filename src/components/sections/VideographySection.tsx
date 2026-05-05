import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useSupabaseList } from "@/lib/useSupabaseList";
import VideoModal from "@/components/VideoModal";
import { Play, Film, Loader2 } from "lucide-react";

type Video = {
  id: string;
  title: string;
  category: string;
  embed_url: string;
  thumb_url: string;
  duration: string | null;
  year: string | null;
  is_showreel: boolean;
  sort_order: number;
};

const FALLBACK_SHOWREEL_THUMB =
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=80";

const FALLBACK_PROJECTS: Video[] = [
  { id: "1", thumb_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80", title: "A Love Story in Amman",    category: "Wedding Film", duration: "4:32",  year: "2024", embed_url: "", is_showreel: false, sort_order: 1 },
  { id: "2", thumb_url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80", title: "Into the Wild — Travel Doc", category: "Documentary",  duration: "12:15", year: "2024", embed_url: "", is_showreel: false, sort_order: 2 },
  { id: "3", thumb_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80", title: "Soleil — Fashion Campaign",  category: "Commercial",   duration: "2:48",  year: "2023", embed_url: "", is_showreel: false, sort_order: 3 },
];

export default function VideographySection() {
  const { ref, inView } = useInView<HTMLElement>(0.05);
  const { data, loading } = useSupabaseList<Video>("videos");
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>();

  const showreel = data.find((v) => v.is_showreel) ?? null;
  const projects = data.filter((v) => !v.is_showreel);
  const displayProjects = projects.length > 0 ? projects : FALLBACK_PROJECTS;

  const openModal = (video: Video) => {
    if (!video.embed_url) return;
    setModalTitle(video.title);
    setModalUrl(video.embed_url);
  };

  return (
    <section
      id="videography"
      ref={ref}
      className="relative py-24 lg:py-36 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[oklch(0.12_0.015_55/0.6)]" />
      <div className="absolute -left-4 top-8 section-number">03</div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p
            className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            — Videography
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
            Motion Pictures,
            <br />
            <em className="text-[oklch(0.72_0.12_65)]">Living Memories</em>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[oklch(0.72_0.12_65)]" />
          </div>
        ) : (
          <>
            {/* Showreel */}
            <div
              className={`relative w-full overflow-hidden mb-16 transition-all duration-900 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "150ms", aspectRatio: "16/9", maxHeight: 520 }}
            >
              <img
                src={showreel?.thumb_url || FALLBACK_SHOWREEL_THUMB}
                alt="Showreel thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.015_55/0.70)] to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <button
                  onClick={() => showreel && openModal(showreel)}
                  className="w-20 h-20 rounded-full border-2 border-[oklch(0.72_0.12_65)] flex items-center justify-center text-[oklch(0.72_0.12_65)] hover:bg-[oklch(0.72_0.12_65)] hover:text-[oklch(0.14_0.018_55)] transition-all duration-300 group"
                  aria-label="Play showreel"
                >
                  <Play size={28} className="ml-1 group-hover:scale-110 transition-transform" fill="currentColor" />
                </button>
                <p
                  className="text-[oklch(0.92_0.02_75)] text-[10px] tracking-[0.35em] uppercase"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Watch Showreel 2024
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1 px-6 py-4">
                <Film size={14} className="text-[oklch(0.72_0.12_65)]" />
                <span
                  className="text-[oklch(0.60_0.02_75)] text-[9px] tracking-[0.2em] uppercase ml-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Khalid Films — 2024 Reel
                </span>
              </div>
            </div>

            {/* Project cards */}
            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              {displayProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => openModal(project)}
                  className="group relative overflow-hidden text-left border border-white/5 hover:border-[oklch(0.72_0.12_65/0.3)] transition-all duration-400"
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <img
                      src={project.thumb_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[oklch(0.10_0.015_55/0.50)] group-hover:bg-[oklch(0.10_0.015_55/0.30)] transition-colors duration-400" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full border border-[oklch(0.72_0.12_65)] flex items-center justify-center">
                        <Play size={16} className="text-[oklch(0.72_0.12_65)] ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    {project.duration && (
                      <span
                        className="absolute bottom-2 right-2 bg-black/70 text-[oklch(0.92_0.02_75)] text-[9px] px-2 py-0.5 tracking-wider"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {project.duration}
                      </span>
                    )}
                  </div>
                  <div className="p-4 bg-[oklch(0.17_0.018_55)]">
                    <p
                      className="text-[oklch(0.72_0.12_65)] text-[9px] tracking-[0.25em] uppercase mb-1"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {project.category}{project.year ? ` · ${project.year}` : ""}
                    </p>
                    <h3
                      className="text-[oklch(0.88_0.02_75)] text-lg font-medium leading-tight"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {project.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {modalUrl && (
        <VideoModal
          embedUrl={modalUrl}
          title={modalTitle}
          onClose={() => { setModalUrl(null); setModalTitle(undefined); }}
        />
      )}
    </section>
  );
}
