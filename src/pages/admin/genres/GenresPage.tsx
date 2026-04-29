import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { moveItem } from "@/lib/adminUtils";
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, Tag, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

type Genre = {
  id: string;
  name: string;
  sort_order: number;
};

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const inputClass =
    "w-full bg-[oklch(0.20_0.018_55)] border border-white/8 text-[oklch(0.88_0.02_75)] placeholder-[oklch(0.40_0.02_75)] px-3 py-2 text-sm outline-none focus:border-[oklch(0.72_0.12_65/0.6)] transition-colors";

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("genres").select("*").order("sort_order");
    setGenres(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) { toast.error("Genre name is required."); return; }
    setSaving(true);
    const { error } = await supabase.from("genres").insert({ name: n, sort_order: genres.length });
    setSaving(false);
    if (error) { toast.error("Couldn't save: " + error.message); return; }
    toast.success("Genre added!");
    setName("");
    load();
  };

  const startEdit = (g: Genre) => {
    setEditingId(g.id);
    setEditingName(g.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleRename = async (g: Genre) => {
    const n = editingName.trim();
    if (!n) { toast.error("Genre name is required."); return; }
    if (n === g.name) { cancelEdit(); return; }
    setEditSaving(true);
    const { error } = await supabase.from("genres").update({ name: n }).eq("id", g.id);
    setEditSaving(false);
    if (error) { toast.error("Couldn't rename: " + error.message); return; }
    setGenres((p) => p.map((x) => x.id === g.id ? { ...x, name: n } : x));
    toast.success("Genre renamed!");
    cancelEdit();
  };

  const remove = async (g: Genre) => {
    if (!confirm(`Delete genre "${g.name}"? Videos in this genre won't be deleted.`)) return;
    const { error } = await supabase.from("genres").delete().eq("id", g.id);
    if (error) { toast.error("Couldn't delete: " + error.message); return; }
    setGenres((p) => p.filter((x) => x.id !== g.id));
    toast.success("Genre deleted.");
  };

  const handleMove = async (index: number, dir: "up" | "down") => {
    const updated = await moveItem("genres", genres, index, dir);
    setGenres(updated);
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-2" style={{ fontFamily: "var(--font-body)" }}>— Portfolio</p>
        <h1 className="text-[oklch(0.92_0.02_75)]" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 500 }}>Video Genres</h1>
      </div>

      <form onSubmit={handleAdd} className="bg-[oklch(0.17_0.018_55)] border border-white/8 p-6 mb-8">
        <h2 className="text-[oklch(0.92_0.02_75)] text-lg mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
          <Plus size={16} className="text-[oklch(0.72_0.12_65)]" /> Add Genre
        </h2>
        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Wedding Films"
            className={inputClass}
            style={{ fontFamily: "var(--font-body)" }}
          />
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[oklch(0.78_0.13_65)] transition-colors disabled:opacity-60 whitespace-nowrap"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            Add
          </button>
        </div>
      </form>

      {loading ? (
        <div className="flex items-center gap-2 text-[oklch(0.55_0.02_75)]"><Loader2 size={16} className="animate-spin" /></div>
      ) : genres.length === 0 ? (
        <p className="text-[oklch(0.45_0.02_75)] text-sm" style={{ fontFamily: "var(--font-body)" }}>No genres yet. Add one above.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {genres.map((g, i) => (
            <div key={g.id} className="flex items-center gap-4 p-4 bg-[oklch(0.17_0.018_55)] border border-white/8">
              <Tag size={14} className="text-[oklch(0.72_0.12_65)] flex-shrink-0" />

              {editingId === g.id ? (
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleRename(g); if (e.key === "Escape") cancelEdit(); }}
                  autoFocus
                  className="flex-1 bg-[oklch(0.20_0.018_55)] border border-[oklch(0.72_0.12_65/0.6)] text-[oklch(0.88_0.02_75)] px-3 py-1 text-sm outline-none"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              ) : (
                <span className="flex-1 text-[oklch(0.88_0.02_75)] text-sm" style={{ fontFamily: "var(--font-body)" }}>{g.name}</span>
              )}

              {editingId === g.id ? (
                <div className="flex items-center gap-1">
                  <button onClick={() => handleRename(g)} disabled={editSaving} className="p-1.5 text-[oklch(0.72_0.12_65)] hover:text-[oklch(0.85_0.13_65)] transition-colors disabled:opacity-60">
                    {editSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  </button>
                  <button onClick={cancelEdit} className="p-1.5 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.70_0.02_75)] transition-colors"><X size={13} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => handleMove(i, "up")} disabled={i === 0} className="p-1 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] disabled:opacity-30 transition-colors"><ChevronUp size={13} /></button>
                    <button onClick={() => handleMove(i, "down")} disabled={i === genres.length - 1} className="p-1 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] disabled:opacity-30 transition-colors"><ChevronDown size={13} /></button>
                  </div>
                  <button onClick={() => startEdit(g)} className="p-1.5 text-[oklch(0.45_0.02_75)] hover:text-[oklch(0.72_0.12_65)] transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => remove(g)} className="p-1.5 text-[oklch(0.45_0.02_75)] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
