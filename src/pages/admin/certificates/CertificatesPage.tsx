import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { moveItem } from "@/lib/adminUtils";
import EditModal from "@/components/admin/EditModal";
import { Loader2, Plus, Trash2, Pencil, ChevronUp, ChevronDown, Upload, X } from "lucide-react";
import { toast } from "sonner";

type Cert = { id: string; title: string; issuer: string; year: string; url: string | null; logo_url: string | null; sort_order: number };
const blank = { title: "", issuer: "", year: new Date().getFullYear().toString(), url: "", logo_url: "" };

export default function CertificatesPage() {
  const [items, setItems] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const [editItem, setEditItem] = useState<Cert | null>(null);
  const [editForm, setEditForm] = useState(blank);
  const [editSaving, setEditSaving] = useState(false);

  const inputClass = "w-full bg-[oklch(0.20_0.018_55)] border border-white/8 text-[oklch(0.88_0.02_75)] placeholder-[oklch(0.40_0.02_75)] px-3 py-2 text-sm outline-none focus:border-[oklch(0.72_0.12_65/0.6)] transition-colors";
  const lbl = (t: string) => <label className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>{t}</label>;

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("certificates").select("*").order("sort_order");
    setItems(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const uploadLogo = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `logos/${Date.now()}.${ext}`;
    await supabase.storage.from("media").upload(path, file, { upsert: false });
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.issuer) { toast.error("Title and issuer are required."); return; }
    setSaving(true);
    let logo_url: string | null = form.logo_url || null;
    if (logoFile) logo_url = await uploadLogo(logoFile);
    const { error } = await supabase.from("certificates").insert({
      title: form.title, issuer: form.issuer, year: form.year,
      url: form.url || null, logo_url, sort_order: items.length,
    });
    setSaving(false);
    if (error) { toast.error("Couldn't save."); return; }
    toast.success("Certificate added!");
    setForm(blank); setLogoFile(null); setLogoPreview(null);
    if (logoRef.current) logoRef.current.value = "";
    load();
  };

  const openEdit = (c: Cert) => {
    setEditItem(c);
    setEditForm({ title: c.title, issuer: c.issuer, year: c.year, url: c.url ?? "", logo_url: c.logo_url ?? "" });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    setEditSaving(true);
    const { error } = await supabase.from("certificates").update({
      title: editForm.title, issuer: editForm.issuer, year: editForm.year,
      url: editForm.url || null, logo_url: editForm.logo_url || null,
    }).eq("id", editItem.id);
    setEditSaving(false);
    if (error) { toast.error("Couldn't update."); return; }
    toast.success("Updated!");
    setEditItem(null); load();
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await supabase.from("certificates").delete().eq("id", id);
    setItems((p) => p.filter((c) => c.id !== id));
    toast.success("Deleted.");
  };

  const handleMove = async (index: number, dir: "up" | "down") => {
    const updated = await moveItem("certificates", items, index, dir);
    setItems(updated);
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-2" style={{ fontFamily: "var(--font-body)" }}>— Credentials</p>
        <h1 className="text-[oklch(0.92_0.02_75)]" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 500 }}>Certificates</h1>
      </div>

      <form onSubmit={handleAdd} className="bg-[oklch(0.17_0.018_55)] border border-white/8 p-6 mb-8">
        <h2 className="text-[oklch(0.92_0.02_75)] text-lg mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}><Plus size={16} className="text-[oklch(0.72_0.12_65)]" /> Add Certificate</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>{lbl("Certificate Title *")}<input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="DaVinci Resolve — Color Grading" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Issuer *")}<input value={form.issuer} onChange={(e) => setForm((p) => ({ ...p, issuer: e.target.value }))} placeholder="Blackmagic Design" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Year")}<input value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} placeholder="2024" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Credential URL (optional)")}<input value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://credential.net/..." className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
        </div>
        <div className="mb-5">
          {lbl("Logo Image (optional)")}
          {logoPreview ? (
            <div className="relative inline-flex items-center gap-2">
              <img src={logoPreview} alt="logo" className="h-10 w-10 object-contain border border-white/10" />
              <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); if (logoRef.current) logoRef.current.value = ""; }} className="text-[oklch(0.45_0.02_75)] hover:text-red-400 transition-colors"><X size={14} /></button>
            </div>
          ) : (
            <button type="button" onClick={() => logoRef.current?.click()} className="flex items-center gap-2 px-4 py-2 border border-dashed border-white/20 text-[oklch(0.55_0.02_75)] hover:border-[oklch(0.72_0.12_65/0.5)] hover:text-[oklch(0.72_0.12_65)] transition-colors text-sm" style={{ fontFamily: "var(--font-body)" }}>
              <Upload size={13} /> Upload logo
            </button>
          )}
          <input ref={logoRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }}} className="hidden" />
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[oklch(0.78_0.13_65)] transition-colors disabled:opacity-60" style={{ fontFamily: "var(--font-body)" }}>
          {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <><Plus size={13} /> Add</>}
        </button>
      </form>

      {loading ? (
        <div className="flex items-center gap-2 text-[oklch(0.55_0.02_75)]"><Loader2 size={16} className="animate-spin" /></div>
      ) : items.length === 0 ? (
        <p className="text-[oklch(0.45_0.02_75)] text-sm" style={{ fontFamily: "var(--font-body)" }}>No certificates yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((c, i) => (
            <div key={c.id} className="flex items-center gap-4 p-4 bg-[oklch(0.17_0.018_55)] border border-white/8">
              {c.logo_url && <img src={c.logo_url} alt="logo" className="w-8 h-8 object-contain flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-[oklch(0.92_0.02_75)] text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>{c.title}</p>
                <p className="text-[oklch(0.55_0.02_75)] text-xs" style={{ fontFamily: "var(--font-body)" }}>{c.issuer} · {c.year}</p>
                {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[oklch(0.72_0.12_65)] text-[10px] hover:underline" style={{ fontFamily: "var(--font-body)" }}>View credential →</a>}
              </div>
              <div className="flex flex-col gap-0.5">
                <button onClick={() => handleMove(i, "up")} disabled={i === 0} className="p-1 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] disabled:opacity-30 transition-colors"><ChevronUp size={13} /></button>
                <button onClick={() => handleMove(i, "down")} disabled={i === items.length - 1} className="p-1 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] disabled:opacity-30 transition-colors"><ChevronDown size={13} /></button>
              </div>
              <button onClick={() => openEdit(c)} className="p-1.5 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] transition-colors"><Pencil size={14} /></button>
              <button onClick={() => remove(c.id, c.title)} className="p-1.5 text-[oklch(0.45_0.02_75)] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {editItem && (
        <EditModal title="Edit Certificate" onClose={() => setEditItem(null)}>
          <form onSubmit={handleEdit}>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>{lbl("Title *")}<input value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
              <div>{lbl("Issuer *")}<input value={editForm.issuer} onChange={(e) => setEditForm((p) => ({ ...p, issuer: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
              <div>{lbl("Year")}<input value={editForm.year} onChange={(e) => setEditForm((p) => ({ ...p, year: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
              <div>{lbl("Credential URL")}<input value={editForm.url} onChange={(e) => setEditForm((p) => ({ ...p, url: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
            </div>
            <div className="mb-5">
              {lbl("Logo URL (optional)")}
              <input value={editForm.logo_url} onChange={(e) => setEditForm((p) => ({ ...p, logo_url: e.target.value }))} placeholder="https://... or leave blank" className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
              {editForm.logo_url && <img src={editForm.logo_url} alt="logo" className="mt-2 h-8 w-8 object-contain border border-white/10" onError={(e) => (e.currentTarget.style.display = "none")} />}
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
