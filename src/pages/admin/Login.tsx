/**
 * Admin login — magic-link flow.
 * Khalid types his email, gets a sign-in link by email, click → he's in.
 */
import { useState } from "react";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/lib/useAuth";
import { ADMIN_EMAIL } from "@/lib/supabase";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Soft client-side hint: only the admin email gets in. (RLS enforces it
    // server-side regardless.)
    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      toast.error("This email is not authorized.");
      return;
    }

    setSending(true);
    const { error } = await signIn(email.trim());
    setSending(false);

    if (error) {
      console.error("[login] signIn error", error);
      toast.error(error.message || "Couldn't send magic link.");
      return;
    }
    setSent(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[oklch(0.50_0.02_75)] hover:text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.3em] uppercase mb-12 transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft size={12} />
          Back to site
        </Link>

        <div className="mb-10">
          <p
            className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            — Admin
          </p>
          <h1
            className="text-[oklch(0.92_0.02_75)]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 500,
              lineHeight: 1.05,
            }}
          >
            Sign in to your
            <br />
            <em className="text-[oklch(0.72_0.12_65)]">dashboard</em>
          </h1>
          <div className="gold-rule mt-6" />
        </div>

        {sent ? (
          <div className="border border-[oklch(0.72_0.12_65/0.4)] p-6 bg-[oklch(0.17_0.018_55)]">
            <Mail className="text-[oklch(0.72_0.12_65)] mb-4" size={22} />
            <h2
              className="text-[oklch(0.92_0.02_75)] text-xl mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Check your inbox
            </h2>
            <p
              className="text-[oklch(0.65_0.02_75)] text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We just sent a magic link to{" "}
              <span className="text-[oklch(0.92_0.02_75)]">{email}</span>. Click
              it from this device and you'll be signed in. The link expires in
              an hour.
            </p>
            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="mt-5 text-[oklch(0.72_0.12_65)] hover:text-[oklch(0.78_0.13_65)] text-[10px] tracking-[0.25em] uppercase transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
                className="w-full bg-[oklch(0.20_0.018_55)] border border-white/8 text-[oklch(0.88_0.02_75)] placeholder-[oklch(0.40_0.02_75)] px-4 py-3 text-sm outline-none focus:border-[oklch(0.72_0.12_65/0.6)] transition-colors duration-300"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="flex items-center justify-center gap-3 px-8 py-3.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-[oklch(0.78_0.13_65)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {sending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending link...
                </>
              ) : (
                <>
                  Send magic link
                  <Mail size={14} />
                </>
              )}
            </button>

            <p
              className="text-[oklch(0.40_0.02_75)] text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We'll email you a link. No passwords. Only the configured admin
              email can sign in.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
