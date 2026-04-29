import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { supabase } from "@/lib/supabase";
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

type Genre = { id: string; name: string; sort_order: number };
type Junction = { video_id: string; genre_id: string };
type Section = { id: string; name: string; videos: Video[] };

const FALLBACK_SHOWREEL_THUMB =
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=80";

const FALLBACK_PROJECTS: Video[] = [
  { id: "1", thumb_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80", title: "A Love Story in Amman",      category: "Wedding Film", duration: "4:32",  year: "2024", embed_url: "", is_showreel: false, sort_order: 1 },
  { id: "2", thumb_url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80", title: "Into the Wild — Travel Doc", category: "Documentary",  duration: "12:15", year: "2024", embed_url: "", is_showreel: false, sort_order: 2 },
  { id: "3", thumb_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80", title: "Soleil — Fashion Campaign",  category: "Commercial",   duration: "2:48",  year: "2023", embed_url: "", is_showreel: false, sort_order: 3 },
];

function VideoCard({ project, onOpen }: { project: Video; onOpen: (v: Video) => void }) {
  return (
    <button
      onClick={() => onOpen(project)}
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
  );
}

function GenreSection({ section, onOpen, inView, delay }: {
  section: Section;
  onOpen: (v: Video) => void;
  inView: boolean;
  delay: number;
}) {
  return (
    <div
      className={`mb-16 transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4 mb-6">
        <h3
          className="text-[oklch(0.92_0.02_75)]"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 500 }}
        >
          {section.name}
        </h3>
        <div className="w-8 h-px bg-[oklch(0.72_0.12_65/0.6)]" />
        <div className="flex-1 h-px bg-white/8" />
        <span
          className="text-[oklch(0.45_0.02_75)] text-[9px] tracking-[0.25em] uppercase"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {section.videos.length} {section.videos.length === 1 ? "film" : "films"}
        </span>
      </div>
      <div
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
        style={{ scrollbarWidth: "none" }}
      >
        {section.videos.map((v) => (
          <div key={v.id} className="snap-start flex-shrink-0 w-[78vw] md:w-auto">
            <VideoCard project={v} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VideographySection() {
  const { ref, inView } = useInView<HTMLElement>(0.05);
  const [showreel, setShowreel] = useState<Video | null>(null);
  const [genreSections, setGenreSections] = useState<Section[]>([]);
  const [otherVideos, setOtherVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: videos }, { data: genres }, { data: junctions }] = await Promise.all([
        supabase.from("videos").select("*").order("sort_order"),
        supabase.from("genres").select("*").order("sort_order"),
        supabase.from("video_genres").select("video_id, genre_id"),
      ]);

      const allVideos: Video[] = videos ?? [];
      const allGenres: Genre[] = genres ?? [];
      const allJunctions: Junction[] = junctions ?? [];

      const reel = allVideos.find((v) => v.is_showreel) ?? null;
      const nonShowreel = allVideos.filter((v) => !v.is_showreel);
      const assignedIds = new Set(allJunctions.map((j) => j.video_id));

      const sections = allGenres.map((g) => {
        const vids = allJunctions
          .filter((j) => j.genre_id === g.id)
          .map((j) => nonShowreel.find((v) => v.id === j.video_id))
          .filter((v): v is Video => v !== undefined);
        return { id: g.id, name: g.name, videos: vids };
      }).filter((s) => s.videos.length > 0);

      const other = nonShowreel.filter((v) => !assignedIds.has(v.id));

      setShowreel(reel);
      setGenreSections(sections);
      setOtherVideos(other);
      setLoading(false);
    };
    load();
  }, []);

  const openModal = (video: Video) => {
    if (!video.embed_url) return;
    setModalTitle(video.title);
    setModalUrl(video.embed_url);
  };

  const hasRealData = showreel !== null || genreSections.length > 0 || otherVideos.length > 0;
  const showFallback = !hasRealData && !loading;
  const allSections: Section[] = [
    ...genreSections,
    ...(otherVideos.length > 0 ? [{ id: "other", name: "Other", videos: otherVideos }] : []),
  ];

  return (
    <section
      id="videography"
      ref={ref}
      className="relative py-24 lg:py-36 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[oklch(0.12_0.015_55/0.6)]" />
      <div className="absolute left-2 top-8 section-number">3</div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className={`mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p
            className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            — Videography
          </p>
          <h2
            className="text-[oklch(0.92_0.02_75)]"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", fontWeight: 500, lineHeight: 1.05 }}
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
              className={`relative w-full overflow-hidden mb-16 transition-all duration-900 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
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

            {/* Genre filter tabs */}
            {!showFallback && allSections.length > 0 && (
              <div
                className={`mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "250ms" }}
              >
                <div
                  className="flex border-b border-white/8 overflow-x-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  {allSections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveId(activeId === s.id ? null : s.id)}
                      className="relative flex-shrink-0 px-5 py-3.5 text-[9px] tracking-[0.35em] uppercase transition-colors duration-300 group"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <span className={activeId === s.id ? "text-[oklch(0.72_0.12_65)]" : "text-[oklch(0.40_0.02_75)] group-hover:text-[oklch(0.65_0.02_75)]"}>
                        {s.name}
                      </span>
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-300 ${activeId === s.id ? "bg-[oklch(0.72_0.12_65)] opacity-100" : "bg-transparent opacity-0"}`}
                      />
                    </button>
                  ))}
                </div>

                {/* Prompt when nothing selected */}
                {!activeId && (
                  <p
                    className="text-[oklch(0.35_0.02_75)] text-[9px] tracking-[0.3em] uppercase mt-4"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Select a genre to explore
                  </p>
                )}
              </div>
            )}

            {/* Active genre section only */}
            {!showFallback && activeId && (() => {
              const section = allSections.find(s => s.id === activeId);
              if (!section) return null;
              return (
                <GenreSection
                  key={section.id}
                  section={section}
                  onOpen={openModal}
                  inView={inView}
                  delay={0}
                />
              );
            })()}

            {/* Fallback when no DB data */}
            {showFallback && (
              <div
                className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: "300ms" }}
              >
                {FALLBACK_PROJECTS.map((project) => (
                  <VideoCard key={project.id} project={project} onOpen={openModal} />
                ))}
              </div>
            )}
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
