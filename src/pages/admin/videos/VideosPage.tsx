import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { moveItem } from "@/lib/adminUtils";
import EditModal from "@/components/admin/EditModal";
import { Loader2, Plus, Trash2, Star, Pencil, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

type Genre = { id: string; name: string; sort_order: number };

type Video = {
  id: string;
  title: string;
  category: string;
  embed_url: string;
  thumb_url: string;
  duration: string | null;
  year: string | null;
  is_showreel: boolean;
  sort_order: number;
  video_genres?: { genre_id: string }[];
};

const blankForm = {
  title: "", category: "", embed_url: "", thumb_url: "",
  duration: "", year: new Date().getFullYear().toString(), is_showreel: false,
};

function getYtId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([^&?/\s]{11})/);
  return m?.[1] ?? null;
}
function getVimeoId(url: string) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m?.[1] ?? null;
}
function autoThumb(url: string) {
  const yt = getYtId(url);
  if (yt) return `https://img.youtube.com/vi/${yt}/maxresdefault.jpg`;
  const vi = getVimeoId(url);
  if (vi) return `https://vumbnail.com/${vi}.jpg`;
  return "";
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blankForm);
  const [formGenreIds, setFormGenreIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const [editItem, setEditItem] = useState<Video | null>(null);
  const [editForm, setEditForm] = useState(blankForm);
  const [editGenreIds, setEditGenreIds] = useState<string[]>([]);
  const [editSaving, setEditSaving] = useState(false);

  const inputClass =
    "w-full bg-[oklch(0.20_0.018_55)] border border-white/8 text-[oklch(0.88_0.02_75)] placeholder-[oklch(0.40_0.02_75)] px-3 py-2 text-sm outline-none focus:border-[oklch(0.72_0.12_65/0.6)] transition-colors";
  const lbl = (t: string) => (
    <label className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>{t}</label>
  );

  const load = async () => {
    setLoading(true);
    const [{ data: vids }, { data: gens }, { data: junctions }] = await Promise.all([
      supabase.from("videos").select("*").order("sort_order"),
      supabase.from("genres").select("*").order("sort_order"),
      supabase.from("video_genres").select("video_id, genre_id"),
    ]);
    const allJunctions = junctions ?? [];
    const videosWithGenres = (vids ?? []).map((v) => ({
      ...v,
      video_genres: allJunctions.filter((j) => j.video_id === v.id).map((j) => ({ genre_id: j.genre_id })),
    }));
    setVideos(videosWithGenres);
    setGenres(gens ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleUrlChange = (url: string, forEdit = false) => {
    const thumb = autoThumb(url);
    if (forEdit) setEditForm((p) => ({ ...p, embed_url: url, thumb_url: thumb || p.thumb_url }));
    else setForm((p) => ({ ...p, embed_url: url, thumb_url: thumb || p.thumb_url }));
  };

  const toggleGenre = (id: string, current: string[], set: (v: string[]) => void) => {
    set(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.embed_url) { toast.error("Title and URL are required."); return; }
    setSaving(true);
    const { data: inserted, error } = await supabase.from("videos").insert({
      title: form.title, category: form.category || "Videography",
      embed_url: form.embed_url, thumb_url: form.thumb_url,
      duration: form.duration || null, year: form.year || null,
      is_showreel: form.is_showreel, sort_order: videos.length,
    }).select("id").single();
    if (error || !inserted) { setSaving(false); toast.error("Couldn't save: " + error?.message); return; }
    if (formGenreIds.length > 0) {
      await supabase.from("video_genres").insert(
        formGenreIds.map((genre_id) => ({ video_id: inserted.id, genre_id }))
      );
    }
    setSaving(false);
    toast.success("Video added!");
    setForm(blankForm);
    setFormGenreIds([]);
    load();
  };

  const openEdit = (v: Video) => {
    setEditItem(v);
    setEditForm({
      title: v.title, category: v.category, embed_url: v.embed_url,
      thumb_url: v.thumb_url, duration: v.duration ?? "", year: v.year ?? "",
      is_showreel: v.is_showreel,
    });
    setEditGenreIds(v.video_genres?.map((vg) => vg.genre_id) ?? []);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    setEditSaving(true);
    const { error } = await supabase.from("videos").update({
      title: editForm.title, category: editForm.category || "Videography",
      embed_url: editForm.embed_url, thumb_url: editForm.thumb_url,
      duration: editForm.duration || null, year: editForm.year || null,
      is_showreel: editForm.is_showreel,
    }).eq("id", editItem.id);
    if (error) { setEditSaving(false); toast.error("Couldn't update: " + error.message); return; }
    await supabase.from("video_genres").delete().eq("video_id", editItem.id);
    if (editGenreIds.length > 0) {
      await supabase.from("video_genres").insert(
        editGenreIds.map((genre_id) => ({ video_id: editItem.id, genre_id }))
      );
    }
    setEditSaving(false);
    toast.success("Video updated!");
    setEditItem(null);
    load();
  };

  const toggleShowreel = async (id: string, current: boolean) => {
    await supabase.from("videos").update({ is_showreel: !current }).eq("id", id);
    setVideos((p) => p.map((v) => (v.id === id ? { ...v, is_showreel: !current } : v)));
  };

  const remove = async (v: Video) => {
    if (!confirm(`Delete "${v.title}"?`)) return;
    await supabase.from("videos").delete().eq("id", v.id);
    setVideos((p) => p.filter((x) => x.id !== v.id));
    toast.success("Video deleted.");
  };

  const handleMove = async (index: number, dir: "up" | "down") => {
    try {
      const updated = await moveItem("videos", videos, index, dir);
      setVideos(updated);
    } catch (e) {
      toast.error("Couldn't reorder: " + (e as Error).message);
      load();
    }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <div onClick={onChange} className={`w-9 h-5 rounded-full transition-colors flex items-center cursor-pointer ${checked ? "bg-[oklch(0.72_0.12_65)]" : "bg-white/15"}`}>
      <div className={`w-3.5 h-3.5 rounded-full bg-white mx-0.5 transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </div>
  );

  const GenrePicker = ({
    selected, onChange,
  }: { selected: string[]; onChange: (ids: string[]) => void }) => {
    if (genres.length === 0) return null;
    return (
      <div>
        {lbl("Genres")}
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => {
            const checked = selected.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(g.id, selected, onChange)}
                className={`px-3 py-1 text-[10px] tracking-[0.2em] uppercase border transition-colors ${
                  checked
                    ? "border-[oklch(0.72_0.12_65)] bg-[oklch(0.72_0.12_65/0.15)] text-[oklch(0.72_0.12_65)]"
                    : "border-white/10 text-[oklch(0.50_0.02_75)] hover:border-white/25 hover:text-[oklch(0.70_0.02_75)]"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const genreMap = Object.fromEntries(genres.map((g) => [g.id, g.name]));

  return (
    <div>
      <div className="mb-8">
        <p className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-2" style={{ fontFamily: "var(--font-body)" }}>— Portfolio</p>
        <h1 className="text-[oklch(0.92_0.02_75)]" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 500 }}>Videos</h1>
      </div>

      <form onSubmit={handleAdd} className="bg-[oklch(0.17_0.018_55)] border border-white/8 p-6 mb-8">
        <h2 className="text-[oklch(0.92_0.02_75)] text-lg mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          <Plus size={16} className="text-[oklch(0.72_0.12_65)]" /> Add Video
        </h2>
        <div className="mb-4">
          {lbl("YouTube / Vimeo URL *")}
          <input value={form.embed_url} onChange={(e) => handleUrlChange(e.target.value)} placeholder="https://youtu.be/..." className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
          <p className="text-[oklch(0.40_0.02_75)] text-[10px] mt-1" style={{ fontFamily: "var(--font-body)" }}>Thumbnail auto-detected. Paste a custom URL below to override.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>{lbl("Title *")}<input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="A Love Story in Amman" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Category")}<input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} placeholder="Wedding Film" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div>{lbl("Duration")}<input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="4:32" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Year")}<input value={form.year ?? ""} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} placeholder="2024" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Custom Thumbnail URL")}<input value={form.thumb_url} onChange={(e) => setForm((p) => ({ ...p, thumb_url: e.target.value }))} placeholder="auto-filled" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
        </div>
        <div className="mb-4">
          <GenrePicker selected={formGenreIds} onChange={setFormGenreIds} />
        </div>
        <label className="flex items-center gap-3 mb-5 cursor-pointer">
          <Toggle checked={form.is_showreel} onChange={() => setForm((p) => ({ ...p, is_showreel: !p.is_showreel }))} />
          <span className="text-[oklch(0.75_0.02_75)] text-sm" style={{ fontFamily: "var(--font-body)" }}>Use as main showreel</span>
        </label>
        {form.thumb_url && (
          <div className="mb-4">
            <p className="text-[oklch(0.45_0.02_75)] text-[9px] tracking-widest uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>Thumbnail preview</p>
            <img src={form.thumb_url} alt="thumb" className="h-28 object-cover border border-white/10" onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
        )}
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[oklch(0.78_0.13_65)] transition-colors disabled:opacity-60" style={{ fontFamily: "var(--font-body)" }}>
          {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <><Plus size={13} /> Add Video</>}
        </button>
      </form>

      {loading ? (
        <div className="flex items-center gap-2 text-[oklch(0.55_0.02_75)]"><Loader2 size={16} className="animate-spin" /></div>
      ) : videos.length === 0 ? (
        <p className="text-[oklch(0.45_0.02_75)] text-sm" style={{ fontFamily: "var(--font-body)" }}>No videos yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {videos.map((v, i) => {
            const videoGenreNames = v.video_genres?.map((vg) => genreMap[vg.genre_id]).filter(Boolean) ?? [];
            return (
              <div key={v.id} className="flex items-center gap-4 p-3 bg-[oklch(0.17_0.018_55)] border border-white/8">
                {v.thumb_url && <img src={v.thumb_url} alt={v.title} className="w-24 h-14 object-cover flex-shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[oklch(0.92_0.02_75)] text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>{v.title}</span>
                    {v.is_showreel && <span className="text-[9px] tracking-widest uppercase px-2 py-0.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)]" style={{ fontFamily: "var(--font-body)" }}>Showreel</span>}
                    {videoGenreNames.map((n) => (
                      <span key={n} className="text-[9px] tracking-widest uppercase px-2 py-0.5 border border-[oklch(0.72_0.12_65/0.4)] text-[oklch(0.72_0.12_65)]" style={{ fontFamily: "var(--font-body)" }}>{n}</span>
                    ))}
                  </div>
                  <p className="text-[oklch(0.55_0.02_75)] text-xs mt-0.5" style={{ fontFamily: "var(--font-body)" }}>{v.category}{v.year ? ` · ${v.year}` : ""}{v.duration ? ` · ${v.duration}` : ""}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => handleMove(i, "up")} disabled={i === 0} className="p-1 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] disabled:opacity-30 transition-colors"><ChevronUp size={13} /></button>
                  <button onClick={() => handleMove(i, "down")} disabled={i === videos.length - 1} className="p-1 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] disabled:opacity-30 transition-colors"><ChevronDown size={13} /></button>
                </div>
                <button onClick={() => toggleShowreel(v.id, v.is_showreel)} title={v.is_showreel ? "Remove as showreel" : "Set as showreel"} className={`p-1.5 transition-colors ${v.is_showreel ? "text-[oklch(0.72_0.12_65)]" : "text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)]"}`}><Star size={14} fill={v.is_showreel ? "currentColor" : "none"} /></button>
                <button onClick={() => openEdit(v)} className="p-1.5 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] transition-colors"><Pencil size={14} /></button>
                <button onClick={() => remove(v)} className="p-1.5 text-[oklch(0.45_0.02_75)] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            );
          })}
        </div>
      )}

      {editItem && (
        <EditModal title="Edit Video" onClose={() => setEditItem(null)}>
          <form onSubmit={handleEdit}>
            <div className="mb-4">
              {lbl("YouTube / Vimeo URL *")}
              <input value={editForm.embed_url} onChange={(e) => handleUrlChange(e.target.value, true)} className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>{lbl("Title *")}<input value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
              <div>{lbl("Category")}<input value={editForm.category} onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div>{lbl("Duration")}<input value={editForm.duration} onChange={(e) => setEditForm((p) => ({ ...p, duration: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
              <div>{lbl("Year")}<input value={editForm.year ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, year: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
              <div>{lbl("Custom Thumbnail")}<input value={editForm.thumb_url} onChange={(e) => setEditForm((p) => ({ ...p, thumb_url: e.target.value }))} className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
            </div>
            {editForm.thumb_url && <img src={editForm.thumb_url} alt="thumb" className="h-20 object-cover border border-white/10 mb-4" onError={(e) => (e.currentTarget.style.display = "none")} />}
            <div className="mb-4">
              <GenrePicker selected={editGenreIds} onChange={setEditGenreIds} />
            </div>
            <label className="flex items-center gap-3 mb-5 cursor-pointer">
              <Toggle checked={editForm.is_showreel} onChange={() => setEditForm((p) => ({ ...p, is_showreel: !p.is_showreel }))} />
              <span className="text-[oklch(0.75_0.02_75)] text-sm" style={{ fontFamily: "var(--font-body)" }}>Main showreel</span>
            </label>
            <button type="submit" disabled={editSaving} className="flex items-center gap-2 px-6 py-2.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[oklch(0.78_0.13_65)] transition-colors disabled:opacity-60" style={{ fontFamily: "var(--font-body)" }}>
              {editSaving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : "Save Changes"}
            </button>
          </form>
        </EditModal>
      )}
    </div>
  );
}
