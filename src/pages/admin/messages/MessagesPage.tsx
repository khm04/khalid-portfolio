/**
 * Admin Messages — inbox for contact-form submissions.
 * Mark as read, expand, delete.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Mail, MailOpen, Trash2, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type Message = {
  id: string;
  name: string;
  email: string;
  service: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load messages.");
    else setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string, read: boolean) => {
    await supabase.from("messages").update({ read }).eq("id", id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read } : m)),
    );
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message? This can't be undone.")) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) { toast.error("Couldn't delete."); return; }
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast.success("Message deleted.");
  };

  const toggleExpand = async (id: string) => {
    const isOpening = expanded !== id;
    setExpanded(isOpening ? id : null);
    const msg = messages.find((m) => m.id === id);
    if (isOpening && msg && !msg.read) await markRead(id, true);
  };

  const unread = messages.filter((m) => !m.read).length;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <p
            className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            — Inbox
          </p>
          <h1
            className="text-[oklch(0.92_0.02_75)] flex items-center gap-3"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 500 }}
          >
            Messages
            {unread > 0 && (
              <span
                className="text-sm px-2 py-0.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] font-semibold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {unread} new
              </span>
            )}
          </h1>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 border border-white/10 text-[oklch(0.60_0.02_75)] hover:border-[oklch(0.72_0.12_65/0.4)] hover:text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.2em] uppercase transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[oklch(0.55_0.02_75)]">
          <Loader2 size={16} className="animate-spin" />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>Loading...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="py-16 text-center">
          <Mail size={32} className="text-[oklch(0.35_0.02_75)] mx-auto mb-4" />
          <p className="text-[oklch(0.50_0.02_75)]" style={{ fontFamily: "var(--font-body)" }}>
            No messages yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {messages.map((msg) => {
            const isOpen = expanded === msg.id;
            return (
              <div
                key={msg.id}
                className={`border transition-colors ${
                  msg.read
                    ? "border-white/8 bg-[oklch(0.17_0.018_55)]"
                    : "border-[oklch(0.72_0.12_65/0.35)] bg-[oklch(0.17_0.018_55)]"
                }`}
              >
                {/* Row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Unread indicator */}
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      msg.read ? "bg-transparent" : "bg-[oklch(0.72_0.12_65)]"
                    }`}
                  />

                  <button
                    onClick={() => toggleExpand(msg.id)}
                    className="flex-1 flex items-center gap-4 text-left min-w-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className="text-[oklch(0.92_0.02_75)] text-sm font-medium"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {msg.name}
                        </span>
                        <span
                          className="text-[oklch(0.55_0.02_75)] text-xs"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {msg.email}
                        </span>
                        {msg.service && (
                          <span
                            className="text-[oklch(0.72_0.12_65)] text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 border border-[oklch(0.72_0.12_65/0.3)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {msg.service}
                          </span>
                        )}
                      </div>
                      {!isOpen && (
                        <p
                          className="text-[oklch(0.55_0.02_75)] text-xs mt-0.5 truncate"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {msg.message}
                        </p>
                      )}
                    </div>

                    <span
                      className="text-[oklch(0.45_0.02_75)] text-[10px] flex-shrink-0"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {fmt(msg.created_at)}
                    </span>

                    {isOpen ? (
                      <ChevronUp size={14} className="text-[oklch(0.55_0.02_75)] flex-shrink-0" />
                    ) : (
                      <ChevronDown size={14} className="text-[oklch(0.55_0.02_75)] flex-shrink-0" />
                    )}
                  </button>

                  {/* Actions */}
                  <button
                    onClick={() => markRead(msg.id, !msg.read)}
                    title={msg.read ? "Mark unread" : "Mark read"}
                    className="p-1.5 text-[oklch(0.50_0.02_75)] hover:text-[oklch(0.72_0.12_65)] transition-colors flex-shrink-0"
                  >
                    {msg.read ? <Mail size={14} /> : <MailOpen size={14} />}
                  </button>
                  <button
                    onClick={() => remove(msg.id)}
                    title="Delete"
                    className="p-1.5 text-[oklch(0.50_0.02_75)] hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Expanded message */}
                {isOpen && (
                  <div className="px-8 pb-4 border-t border-white/5">
                    <p
                      className="text-[oklch(0.80_0.02_75)] text-sm leading-relaxed pt-4 whitespace-pre-wrap"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {msg.message}
                    </p>
                    <a
                      href={`mailto:${msg.email}?subject=Re: Your enquiry`}
                      className="inline-flex items-center gap-2 mt-4 text-[oklch(0.72_0.12_65)] hover:text-[oklch(0.78_0.13_65)] text-[10px] tracking-[0.2em] uppercase transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Reply via email →
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
