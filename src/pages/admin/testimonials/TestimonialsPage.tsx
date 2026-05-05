import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { moveItem } from "@/lib/adminUtils";
import EditModal from "@/components/admin/EditModal";
import { Loader2, Plus, Trash2, Pencil, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

type Testimonial = { id: string; quote: string; name: string; role: string; initials: string; sort_order: number };
const blank = { quote: "", name: "", role: "", initials: "" };

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [editForm, setEditForm] = useState(blank);
  const [editSaving, setEditSaving] = useState(false);

  const inputClass = "w-full bg-[oklch(0.20_0.018_55)] border border-white/8 text-[oklch(0.88_0.02_75)] placeholder-[oklch(0.40_0.02_75)] px-3 py-2 text-sm outline-none focus:border-[oklch(0.72_0.12_65/0.6)] transition-colors";
  const lbl = (t: string) => <label className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>{t}</label>;

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const autoInitials = (name: string) =>
    name.split(/[\s&]+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.quote || !form.name) { toast.error("Quote and name are required."); return; }
    setSaving(true);
    const initials = form.initials || autoInitials(form.name);
    const { error } = await supabase.from("testimonials").insert({ ...form, initials, sort_order: items.length });
    setSaving(false);
    if (error) { toast.error("Couldn't save."); return; }
    toast.success("Testimonial added!");
    setForm(blank); load();
  };

  const openEdit = (t: Testimonial) => {
    setEditItem(t);
    setEditForm({ quote: t.quote, name: t.name, role: t.role, initials: t.initials });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    setEditSaving(true);
    const initials = editForm.initials || autoInitials(editForm.name);
    const { error } = await supabase.from("testimonials").update({ ...editForm, initials }).eq("id", editItem.id);
    setEditSaving(false);
    if (error) { toast.error("Couldn't update."); return; }
    toast.success("Updated!");
    setEditItem(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    setItems((p) => p.filter((t) => t.id !== id));
    toast.success("Deleted.");
  };

  const handleMove = async (index: number, dir: "up" | "down") => {
    const updated = await moveItem("testimonials", items, index, dir);
    setItems(updated);
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-2" style={{ fontFamily: "var(--font-body)" }}>— Social proof</p>
        <h1 className="text-[oklch(0.92_0.02_75)]" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 500 }}>Testimonials</h1>
      </div>

      <form onSubmit={handleAdd} className="bg-[oklch(0.17_0.018_55)] border border-white/8 p-6 mb-8">
        <h2 className="text-[oklch(0.92_0.02_75)] text-lg mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}><Plus size={16} className="text-[oklch(0.72_0.12_65)]" /> Add Testimonial</h2>
        <div className="mb-4">
          {lbl("Quote *")}
          <textarea value={form.quote} onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))} placeholder="Khalid has an extraordinary eye..." rows={3} className={`${inputClass} resize-none`} style={{ fontFamily: "var(--font-body)" }} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div>{lbl("Client Name *")}<input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Sara & Ahmed" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Role / Context")}<input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} placeholder="Wedding Clients · Amman 2024" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Initials (auto)")}<input value={form.initials} onChange={(e) => setForm((p) => ({ ...p, initials: e.target.value }))} placeholder={autoInitials(form.name) || "SA"} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[oklch(0.78_0.13_65)] transition-colors disabled:opacity-60" style={{ fontFamily: "var(--font-body)" }}>
          {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <><Plus size={13} /> Add</>}
        </button>
      </form>

      {loading ? (
        <div className="flex items-center gap-2 text-[oklch(0.55_0.02_75)]"><Loader2 size={16} className="animate-spin" /></div>
      ) : items.length === 0 ? (
        <p className="text-[oklch(0.45_0.02_75)] text-sm" style={{ fontFamily: "var(--font-body)" }}>No testimonials yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((t, i) => (
            <div key={t.id} className="flex gap-4 p-4 bg-[oklch(0.17_0.018_55)] border border-white/8">
              <div className="w-9 h-9 rounded-full bg-[oklch(0.72_0.12_65)] flex items-center justify-center text-[oklch(0.14_0.018_55)] text-xs font-semibold flex-shrink-0" style={{ fontFamily: "var(--font-body)" }}>{t.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[oklch(0.80_0.02_75)] text-sm italic leading-relaxed" style={{ fontFamily: "var(--font-display)" }}>"{t.quote}"</p>
                <p className="text-[oklch(0.92_0.02_75)] text-sm font-medium mt-2" style={{ fontFamily: "var(--font-body)" }}>{t.name}</p>
                <p className="text-[oklch(0.55_0.02_75)] text-xs" style={{ fontFamily: "var(--font-body)" }}>{t.role}</p>
              </div>
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button onClick={() => handleMove(i, "up")} disabled={i === 0} className="p-1 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] disabled:opacity-30 transition-colors"><ChevronUp size={13} /></button>
                <button onClick={() => handleMove(i, "down")} disabled={i === items.length - 1} className="p-1 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] disabled:opacity-30 transition-colors"><ChevronDown size={13} /></button>
              </div>
              <button onClick={() => openEdit(t)} className="p-1.5 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] transition-colors flex-shrink-0"><Pencil size={14} /></button>
              <button onClick={() => remove(t.id)} className="p-1.5 text-[oklch(0.45_0.02_75)] hover:text-red-400 transition-colors flex-shrink-0"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {editItem && (
        <EditModal title="Edit Testimonial" onClose={() => setEditItem(null)}>
          <form onSubmit={handleEdit}>
            <div className="mb-4">
              {lbl("Quote *")}
              <textarea value={editForm.quote} onChange={(e) => setEditForm((p) => ({ ...p, quote: e.target.value }))} rows={3} className={`${inputClass} resize-none`} style={{ fontFamily: "var(--font-body)" }} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-5">
              <div>{lbl("Name *")}<input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
              <div>{lbl("Role")}<input value={editForm.role} onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
              <div>{lbl("Initials")}<input value={editForm.initials} onChange={(e) => setEditForm((p) => ({ ...p, initials: e.target.value }))} placeholder={autoInitials(editForm.name)} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
            </div>
            <button type="submit" disabled={editSaving} className="flex items-center gap-2 px-6 py-2.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[oklch(0.78_0.13_65)] transition-colors disabled:opacity-60" style={{ fontFamily: "var(--font-body)" }}>
              {editSaving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : "Save Changes"}
            </button>
          </form>
        </EditModal>
      )}
    </div>
  );
}
