import { useSiteSettings } from "@/lib/useSiteSettings";

export default function Footer() {
  const year = new Date().getFullYear();
  const { settings } = useSiteSettings();

  const handleNav = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center lg:items-start">
            <span
              className="text-2xl font-bold text-[oklch(0.92_0.02_75)] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {settings.hero_name.toUpperCase()}
            </span>
            <span
              className="text-[9px] tracking-[0.3em] uppercase text-[oklch(0.72_0.12_65)] mt-0.5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Videography &amp; Film
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-6">
            {["home", "about", "certificates", "frames", "videography", "services", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => handleNav(item)}
                className="text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Social links */}
          <div className="flex items-center gap-5">
            {settings.footer_email && (
              <a
                href={`mailto:${settings.footer_email}`}
                className="text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Email
              </a>
            )}
            {settings.footer_instagram && (
              <a
                href={settings.footer_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Instagram
              </a>
            )}
            {settings.footer_youtube && (
              <a
                href={settings.footer_youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.2em] uppercase transition-colors duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              >
                YouTube
              </a>
            )}
            {!settings.footer_email && !settings.footer_instagram && !settings.footer_youtube && (
              <p
                className="text-[oklch(0.35_0.02_75)] text-xs text-center lg:text-right"
                style={{ fontFamily: "var(--font-body)" }}
              >
                © {year} {settings.hero_name}. All rights reserved.
              </p>
            )}
          </div>

          {(settings.footer_email || settings.footer_instagram || settings.footer_youtube) && (
            <p
              className="text-[oklch(0.35_0.02_75)] text-xs text-center lg:text-right hidden lg:block"
              style={{ fontFamily: "var(--font-body)" }}
            >
              © {year} {settings.hero_name}. All rights reserved.
            </p>
          )}
        </div>

        {/* Mobile copyright */}
        {(settings.footer_email || settings.footer_instagram || settings.footer_youtube) && (
          <p
            className="text-[oklch(0.35_0.02_75)] text-xs text-center mt-4 lg:hidden"
            style={{ fontFamily: "var(--font-body)" }}
          >
            © {year} {settings.hero_name}. All rights reserved.
          </p>
        )}

        <div className="gold-rule mt-8" />

        <p
          className="text-center text-[oklch(0.30_0.02_75)] text-[10px] tracking-widest uppercase mt-4"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Crafted with light &amp; intention
        </p>
      </div>
    </footer>
  );
}
