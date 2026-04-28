import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-gold text-[10px] tracking-[0.4em] uppercase" style={{ color: "var(--color-gold)" }}>
        — Lost in the edit room
      </p>
      <h1
        className="text-6xl lg:text-8xl font-medium"
        style={{ fontFamily: "var(--font-display)" }}
      >
        404
      </h1>
      <p className="text-fg-muted max-w-md" style={{ color: "var(--color-fg-muted)" }}>
        This frame doesn't exist. Let's head back to the reel.
      </p>
      <Link
        href="/"
        className="px-8 py-3 border text-[11px] tracking-[0.25em] uppercase transition-colors"
        style={{
          borderColor: "oklch(0.72 0.12 65 / 0.5)",
          color: "var(--color-gold)",
          fontFamily: "var(--font-body)",
        }}
      >
        Back home
      </Link>
    </main>
  );
}
