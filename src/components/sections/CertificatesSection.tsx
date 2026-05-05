import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { useSupabaseList } from "@/lib/useSupabaseList";
import { Award, ExternalLink, Loader2, X, ZoomIn } from "lucide-react";

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  year: string;
  url: string | null;
  logo_url: string | null;
  sort_order: number;
};

const FALLBACK: Certificate[] = [
  { id: "1", title: "Cinematography Fundamentals",      issuer: "MasterClass",                    year: "2024", url: null, logo_url: null, sort_order: 0 },
  { id: "2", title: "DaVinci Resolve — Color Grading",  issuer: "Blackmagic Design",              year: "2023", url: null, logo_url: null, sort_order: 1 },
  { id: "3", title: "FAA Part 107 — Drone Pilot",       issuer: "Federal Aviation Administration", year: "2023", url: null, logo_url: null, sort_order: 2 },
  { id: "4", title: "Adobe Premiere Pro — Advanced",    issuer: "Adobe Certified Professional",   year: "2022", url: null, logo_url: null, sort_order: 3 },
];

export default function CertificatesSection() {
  const { ref, inView } = useInView<HTMLElement>(0.05);
  const { data, loading } = useSupabaseList<Certificate>("certificates");
  const [lightbox, setLightbox] = useState<Certificate | null>(null);

  const certs = data.length > 0 ? data : FALLBACK;

  return (
    <section
      id="certificates"
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="absolute -right-4 top-8 section-number">05</div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
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
            — Credentials
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
            Certifications
            <br />
            <em className="text-[oklch(0.72_0.12_65)]">&amp; Training</em>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[oklch(0.72_0.12_65)]" />
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            {certs.map((cert) => (
              <button
                key={cert.id}
                onClick={() => cert.logo_url && setLightbox(cert)}
                className={`group relative flex flex-col bg-[oklch(0.17_0.018_55)] border border-white/8 hover:border-[oklch(0.72_0.12_65/0.3)] transition-all duration-400 hover:-translate-y-1 text-left overflow-hidden ${cert.logo_url ? "cursor-pointer" : "cursor-default"}`}
              >
                {/* Certificate image preview */}
                {cert.logo_url && (
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <img
                      src={cert.logo_url}
                      alt={cert.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[oklch(0.10_0.015_55/0.40)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ZoomIn size={24} className="text-[oklch(0.72_0.12_65)]" />
                    </div>
                  </div>
                )}

                <div className="flex flex-col p-6 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    {!cert.logo_url && (
                      <div className="w-11 h-11 border border-[oklch(0.72_0.12_65/0.4)] flex items-center justify-center flex-shrink-0">
                        <Award size={18} className="text-[oklch(0.72_0.12_65)]" />
                      </div>
                    )}
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="ml-auto"
                      >
                        <ExternalLink
                          size={14}
                          className="text-[oklch(0.50_0.02_75)] hover:text-[oklch(0.72_0.12_65)] transition-colors"
                        />
                      </a>
                    )}
                  </div>

                  <h3
                    className="text-[oklch(0.92_0.02_75)] text-lg font-medium leading-snug mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {cert.title}
                  </h3>

                  <p
                    className="text-[oklch(0.55_0.02_75)] text-sm mb-4"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {cert.issuer}
                  </p>

                  <div className="gold-rule mb-4" />

                  <p
                    className="text-[oklch(0.45_0.02_75)] text-[10px] tracking-[0.25em] uppercase"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Issued {cert.year}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        <p
          className="text-center text-[oklch(0.40_0.02_75)] text-xs mt-10"
          style={{ fontFamily: "var(--font-body)" }}
        >
          More credentials added as new training is completed.
        </p>
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
            className="max-w-4xl max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.logo_url!}
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
              {lightbox.issuer} · {lightbox.year}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
