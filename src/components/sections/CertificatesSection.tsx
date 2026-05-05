import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
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

const spring = { type: "spring" as const, stiffness: 55, damping: 20 };

const staggerCerts = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const certItem = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring },
};

export default function CertificatesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const { data, loading } = useSupabaseList<Certificate>("certificates");
  const [lightbox, setLightbox] = useState<Certificate | null>(null);

  const certs = data.length > 0 ? data : FALLBACK;

  return (
    <section
      id="certificates"
      ref={ref}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      <div className="absolute right-2 top-8 section-number">5</div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={spring}
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
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={24} className="animate-spin text-[oklch(0.72_0.12_65)]" />
          </div>
        ) : (
          <motion.div
            className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0"
            style={{ scrollbarWidth: "none" }}
            variants={staggerCerts}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            {certs.map((cert) => (
              <motion.button
                key={cert.id}
                onClick={() => cert.logo_url && setLightbox(cert)}
                className={`snap-start flex-shrink-0 w-[78vw] sm:w-[42vw] lg:w-auto group relative flex flex-col bg-[oklch(0.17_0.018_55)] border border-white/8 text-left overflow-hidden ${cert.logo_url ? "cursor-pointer" : "cursor-default"}`}
                variants={certItem}
                whileHover={
                  cert.logo_url
                    ? {
                        rotateY: 4,
                        rotateX: -2,
                        scale: 1.02,
                        borderColor: "oklch(0.72 0.12 65 / 0.35)",
                        transition: { type: "spring", stiffness: 200, damping: 22 },
                      }
                    : {
                        y: -4,
                        borderColor: "oklch(0.72 0.12 65 / 0.25)",
                        transition: { type: "spring", stiffness: 300, damping: 22 },
                      }
                }
                style={{ transformStyle: "preserve-3d", perspective: 800 }}
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

                  <motion.div
                    className="mb-4 h-px origin-left"
                    style={{ background: "linear-gradient(to right, transparent, oklch(0.72 0.12 65 / 0.7), transparent)" }}
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />

                  <p
                    className="text-[oklch(0.45_0.02_75)] text-[10px] tracking-[0.25em] uppercase"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Issued {cert.year}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setLightbox(null)}
          >
            <motion.button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 20 }}
            >
              <X size={28} />
            </motion.button>
            <motion.div
              className="max-w-4xl max-h-[85vh] relative"
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
