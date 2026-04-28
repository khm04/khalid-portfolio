import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { moveItem } from "@/lib/adminUtils";
import EditModal from "@/components/admin/EditModal";
import { Loader2, Plus, Trash2, Upload, X, Pencil, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

type Frame = {
  id: string;
  title: string;
  film: string;
  image_url: string;
  span: "default" | "tall" | "wide";
  sort_order: number;
};

const spanOptions = [
  { value: "default", label: "Default (4:3)" },
  { value: "tall",    label: "Tall (spans 2 rows)" },
  { value: "wide",    label: "Wide (spans 2 cols)" },
];

const blank = { title: "", film: "", span: "default" as Frame["span"] };

export default function FramesPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blank);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [editItem, setEditItem] = useState<Frame | null>(null);
  const [editForm, setEditForm] = useState(blank);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const editFileRef = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full bg-[oklch(0.20_0.018_55)] border border-white/8 text-[oklch(0.88_0.02_75)] placeholder-[oklch(0.40_0.02_75)] px-3 py-2 text-sm outline-none focus:border-[oklch(0.72_0.12_65/0.6)] transition-colors";

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("frames").select("*").order("sort_order");
    setFrames(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>, forEdit = false) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (forEdit) { setEditFile(f); setEditPreview(URL.createObjectURL(f)); }
    else { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const clearFile = () => {
    setFile(null); setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error("Please choose an image."); return; }
    if (!form.title || !form.film) { toast.error("Title and film name are required."); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `frames/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("media").upload(path, file, { upsert: false });
    if (upErr) { toast.error("Upload failed: " + upErr.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
    const { error: dbErr } = await supabase.from("frames").insert({
      title: form.title, film: form.film, image_url: urlData.publicUrl,
      span: form.span, sort_order: frames.length,
    });
    if (dbErr) { toast.error("Couldn't save frame: " + dbErr.message); setUploading(false); return; }
    toast.success("Frame added!");
    setForm(blank); clearFile(); setUploading(false); load();
  };

  const openEdit = (frame: Frame) => {
    setEditItem(frame);
    setEditForm({ title: frame.title, film: frame.film, span: frame.span });
    setEditFile(null); setEditPreview(null);
    if (editFileRef.current) editFileRef.current.value = "";
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    setEditSaving(true);
    let image_url = editItem.image_url;
    if (editFile) {
      const ext = editFile.name.split(".").pop();
      const path = `frames/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, editFile, { upsert: false });
      if (upErr) { toast.error("Upload failed: " + upErr.message); setEditSaving(false); return; }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      image_url = urlData.publicUrl;
      // Remove old image
      const oldPath = new URL(editItem.image_url).pathname.split("/object/public/media/")[1];
      if (oldPath) await supabase.storage.from("media").remove([oldPath]);
    }
    const { error } = await supabase.from("frames").update({
      title: editForm.title, film: editForm.film, span: editForm.span, image_url,
    }).eq("id", editItem.id);
    if (error) { toast.error("Couldn't update: " + error.message); setEditSaving(false); return; }
    toast.success("Frame updated!");
    setEditItem(null); setEditSaving(false); load();
  };

  const remove = async (frame: Frame) => {
    if (!confirm(`Delete "${frame.title}"?`)) return;
    const url = new URL(frame.image_url);
    const storagePath = url.pathname.split("/object/public/media/")[1];
    if (storagePath) await supabase.storage.from("media").remove([storagePath]);
    await supabase.from("frames").delete().eq("id", frame.id);
    setFrames((p) => p.filter((f) => f.id !== frame.id));
    toast.success("Frame deleted.");
  };

  const handleMove = async (index: number, dir: "up" | "down") => {
    const updated = await moveItem("frames", frames, index, dir);
    setFrames(updated);
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-2" style={{ fontFamily: "var(--font-body)" }}>— Portfolio</p>
        <h1 className="text-[oklch(0.92_0.02_75)]" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 500 }}>Frames</h1>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-[oklch(0.17_0.018_55)] border border-white/8 p-6 mb-8">
        <h2 className="text-[oklch(0.92_0.02_75)] text-lg mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          <Plus size={16} className="text-[oklch(0.72_0.12_65)]" /> Add Frame
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Frame Title *</label>
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="First Light" className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
          </div>
          <div>
            <label className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>From Film *</label>
            <input value={form.film} onChange={(e) => setForm((p) => ({ ...p, film: e.target.value }))} placeholder="Wedding Film · Amman 2024" className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Display Size</label>
          <select value={form.span} onChange={(e) => setForm((p) => ({ ...p, span: e.target.value as Frame["span"] }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }}>
            {spanOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="mb-5">
          <label className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Image *</label>
          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="preview" className="h-32 object-cover border border-white/10" />
              <button type="button" onClick={clearFile} className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:text-red-400 transition-colors"><X size={12} /></button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-white/20 text-[oklch(0.55_0.02_75)] hover:border-[oklch(0.72_0.12_65/0.5)] hover:text-[oklch(0.72_0.12_65)] transition-colors text-sm" style={{ fontFamily: "var(--font-body)" }}>
              <Upload size={14} /> Choose image
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={(e) => pickFile(e)} className="hidden" />
        </div>
        <button type="submit" disabled={uploading} className="flex items-center gap-2 px-6 py-2.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[oklch(0.78_0.13_65)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed" style={{ fontFamily: "var(--font-body)" }}>
          {uploading ? <><Loader2 size={13} className="animate-spin" /> Uploading...</> : <><Plus size={13} /> Add Frame</>}
        </button>
      </form>

      {/* Existing frames */}
      {loading ? (
        <div className="flex items-center gap-2 text-[oklch(0.55_0.02_75)]"><Loader2 size={16} className="animate-spin" /><span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>Loading...</span></div>
      ) : frames.length === 0 ? (
        <p className="text-[oklch(0.45_0.02_75)] text-sm" style={{ fontFamily: "var(--font-body)" }}>No frames yet — add your first one above.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {frames.map((frame, i) => (
            <div key={frame.id} className="flex items-center gap-3 p-3 bg-[oklch(0.17_0.018_55)] border border-white/8">
              <img src={frame.image_url} alt={frame.title} className="w-20 h-14 object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[oklch(0.92_0.02_75)] text-sm font-medium" style={{ fontFamily: "var(--font-display)" }}>{frame.title}</p>
                <p className="text-[oklch(0.55_0.02_75)] text-xs mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{frame.film}</p>
                <p className="text-[oklch(0.40_0.02_75)] text-[9px] tracking-widest uppercase mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{frame.span}</p>
              </div>
              <div className="flex flex-col gap-0.5">
                <button onClick={() => handleMove(i, "up")} disabled={i === 0} className="p-1 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] disabled:opacity-30 transition-colors"><ChevronUp size={13} /></button>
                <button onClick={() => handleMove(i, "down")} disabled={i === frames.length - 1} className="p-1 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] disabled:opacity-30 transition-colors"><ChevronDown size={13} /></button>
              </div>
              <button onClick={() => openEdit(frame)} className="p-1.5 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] transition-colors"><Pencil size={14} /></button>
              <button onClick={() => remove(frame)} className="p-1.5 text-[oklch(0.45_0.02_75)] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editItem && (
        <EditModal title="Edit Frame" onClose={() => setEditItem(null)}>
          <form onSubmit={handleEdit}>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Title *</label>
                <input value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
              </div>
              <div>
                <label className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>From Film *</label>
                <input value={editForm.film} onChange={(e) => setEditForm((p) => ({ ...p, film: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Display Size</label>
              <select value={editForm.span} onChange={(e) => setEditForm((p) => ({ ...p, span: e.target.value as Frame["span"] }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }}>
                {spanOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="mb-5">
              <label className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Replace Image (optional)</label>
              <div className="flex items-center gap-3">
                <img src={editPreview || editItem.image_url} alt="current" className="h-16 object-cover border border-white/10" />
                <button type="button" onClick={() => editFileRef.current?.click()} className="flex items-center gap-2 px-3 py-2 border border-dashed border-white/20 text-[oklch(0.55_0.02_75)] hover:border-[oklch(0.72_0.12_65/0.5)] hover:text-[oklch(0.72_0.12_65)] transition-colors text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  <Upload size={13} /> Change
                </button>
              </div>
              <input ref={editFileRef} type="file" accept="image/*" onChange={(e) => pickFile(e, true)} className="hidden" />
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
