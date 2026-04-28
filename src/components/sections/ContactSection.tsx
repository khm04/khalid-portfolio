/**
 * ContactSection
 * Contact info (email + Instagram) on left, form on right.
 * In Phase 2, the form will POST to /api/messages and persist to Supabase.
 * For now, it resolves locally with a success toast.
 */
import { useInView } from "@/hooks/useInView";
import { useState } from "react";
import { Mail, Instagram, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const EMAIL = "khalidmasoud4321@gmail.com";
const INSTAGRAM_HANDLE = "khalid._.masoud";
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

export default function ContactSection() {
  const { ref, inView } = useInView<HTMLElement>(0.05);
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      name: form.name,
      email: form.email,
      service: form.service || null,
      message: form.message,
    });
    setSending(false);

    if (error) {
      console.error("[contact] insert failed", error);
      toast.error("Couldn't send right now — please try again or email me directly.");
      return;
    }

    toast.success("Message sent! Khalid will get back to you within 24 hours.", {
      style: {
        background: "oklch(0.17 0.018 55)",
        color: "oklch(0.92 0.02 75)",
        border: "1px solid oklch(0.72 0.12 65 / 0.3)",
      },
    });
    setForm({ name: "", email: "", service: "", message: "" });
  };

  const inputClass =
    "w-full bg-[oklch(0.20_0.018_55)] border border-white/8 text-[oklch(0.88_0.02_75)] placeholder-[oklch(0.40_0.02_75)] px-4 py-3 text-sm outline-none focus:border-[oklch(0.72_0.12_65/0.6)] transition-colors duration-300";

  return (
    <section id="contact" ref={ref} className="relative py-24 lg:py-36 overflow-hidden">
      <div className="absolute -right-4 top-8 section-number">06</div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p
            className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ fontFamily: "var(--font-body)" }}
          >
            — Get in Touch
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
            Let's Create
            <br />
            <em className="text-[oklch(0.72_0.12_65)]">Something Beautiful</em>
          </h2>
        </div>

        <div
          className={`grid lg:grid-cols-5 gap-12 lg:gap-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          {/* Info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <p
              className="text-[oklch(0.65_0.02_75)] leading-relaxed"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Whether you're planning a wedding, a commercial campaign, or a personal
              project — I'd love to hear about it. Reach out and let's talk about
              bringing your vision to life.
            </p>

            <div className="flex flex-col gap-5">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-start gap-4 group"
              >
                <div className="w-9 h-9 border border-[oklch(0.72_0.12_65/0.4)] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[oklch(0.72_0.12_65/0.1)] transition-colors">
                  <Mail size={14} className="text-[oklch(0.72_0.12_65)]" />
                </div>
                <div>
                  <p
                    className="text-[oklch(0.45_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-0.5"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Email
                  </p>
                  <p
                    className="text-[oklch(0.80_0.02_75)] text-sm group-hover:text-[oklch(0.72_0.12_65)] transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {EMAIL}
                  </p>
                </div>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="w-9 h-9 border border-[oklch(0.72_0.12_65/0.4)] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[oklch(0.72_0.12_65/0.1)] transition-colors">
                  <Instagram size={14} className="text-[oklch(0.72_0.12_65)]" />
                </div>
                <div>
                  <p
                    className="text-[oklch(0.45_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-0.5"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Instagram
                  </p>
                  <p
                    className="text-[oklch(0.80_0.02_75)] text-sm group-hover:text-[oklch(0.72_0.12_65)] transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    @{INSTAGRAM_HANDLE}
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-9 h-9 border border-[oklch(0.72_0.12_65/0.4)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} className="text-[oklch(0.72_0.12_65)]" />
                </div>
                <div>
                  <p
                    className="text-[oklch(0.45_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-0.5"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Based in
                  </p>
                  <p
                    className="text-[oklch(0.80_0.02_75)] text-sm"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Jordan
                  </p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="border-l-2 border-[oklch(0.72_0.12_65)] pl-4">
              <p
                className="text-[oklch(0.72_0.12_65)] text-xs font-medium mb-0.5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Currently Accepting Bookings
              </p>
              <p
                className="text-[oklch(0.50_0.02_75)] text-xs"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Limited slots available. Book early to secure your date.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputClass}
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
              <div>
                <label
                  className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={inputClass}
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Service Interested In
              </label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className={inputClass}
                style={{ fontFamily: "var(--font-body)" }}
              >
                <option value="">Select a service...</option>
                <option value="wedding">Wedding Film</option>
                <option value="cinematic">Cinematic Short</option>
                <option value="brand">Brand &amp; Commercial</option>
                <option value="music">Music Video / Custom</option>
                <option value="other">Other / Custom</option>
              </select>
            </div>

            <div>
              <label
                className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Your Message *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project, vision, and ideal date..."
                rows={5}
                className={`${inputClass} resize-none`}
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="self-start flex items-center gap-3 px-8 py-3.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-[oklch(0.78_0.13_65)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[oklch(0.72_0.12_65/0.3)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {sending ? "Sending..." : "Send Message"}
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
