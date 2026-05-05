/**
 * Navbar — Golden Hour Cinematic
 * Fixed top, transparent → solid on scroll.
 * DM Sans uppercase tracked labels, gold accent on active section.
 */
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Videography", href: "#videography" },
  { label: "Frames", href: "#frames" },
  { label: "Certificates", href: "#certificates" },
  { label: "Schedule", href: "#schedule" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 60);
    // Hide navbar on scroll down, show on scroll up
    if (y > lastY.current && y > 120) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    lastY.current = y;

    const sections = navLinks.map((l) => l.href.replace("#", ""));
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && y >= el.offsetTop - 120) {
        setActive(sections[i]);
        break;
      }
    }
  });

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "bg-[oklch(0.14_0.018_55/0.97)] backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/30"
            : "bg-transparent"
        }`}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ type: "spring", stiffness: 120, damping: 25 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNav("#home")}
            className="flex flex-col items-start leading-none"
          >
            <span
              className="text-2xl lg:text-3xl font-bold tracking-tight text-[oklch(0.92_0.02_75)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              KHALID
            </span>
            <span
              className="text-[9px] tracking-[0.3em] uppercase text-[oklch(0.72_0.12_65)] font-light mt-0.5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Videography &amp; Film
            </span>
          </button>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = active === id;
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                    className={`text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-300 relative group ${
                      isActive
                        ? "text-[oklch(0.72_0.12_65)]"
                        : "text-[oklch(0.70_0.02_75)] hover:text-[oklch(0.92_0.02_75)]"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-[oklch(0.72_0.12_65)] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <button
            onClick={() => handleNav("#contact")}
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2 border border-[oklch(0.72_0.12_65/0.6)] text-[oklch(0.72_0.12_65)] text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[oklch(0.72_0.12_65)] hover:text-[oklch(0.14_0.018_55)] transition-all duration-300"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Book Now
          </button>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-[oklch(0.92_0.02_75)] p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu — AnimatePresence for smooth slide */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[oklch(0.12_0.018_55/0.98)] backdrop-blur-xl flex flex-col justify-center items-center gap-8 lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className="text-3xl font-light text-[oklch(0.92_0.02_75)] hover:text-[oklch(0.72_0.12_65)] transition-colors duration-300"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 80, damping: 18 }}
                whileHover={{ x: 6 }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              onClick={() => handleNav("#contact")}
              className="mt-4 px-8 py-3 border border-[oklch(0.72_0.12_65)] text-[oklch(0.72_0.12_65)] text-sm tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-body)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: navLinks.length * 0.06 + 0.1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Book Now
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
