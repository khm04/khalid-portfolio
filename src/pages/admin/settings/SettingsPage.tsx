import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/lib/database.types";

type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

const DEFAULT: Settings = {
  id: 1,
  hero_image_url: null, hero_name: "Khalid",
  hero_tagline: "Capturing Light & Emotion",
  hero_kicker: "Videographer & Filmmaker",
  hero_blurb: null,
  stat_1_value: "120+", stat_1_label: "Films",
  stat_2_value: "8",    stat_2_label: "Years",
  about_portrait_url: null,
  about_story_p1: null, about_story_p2: null,
  about_skills: [], about_years: "8+",
  footer_email: null, footer_instagram: null, footer_youtube: null,
  updated_at: "",
};

export default function SettingsPage() {
  const [form, setForm] = useState<Settings>(DEFAULT);
  const [skillsText, setSkillsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const heroRef = useRef<HTMLInputElement>(null);

  const [portraitFile, setPortraitFile] = useState<File | null>(null);
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);
  const portraitRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full bg-[oklch(0.20_0.018_55)] border border-white/8 text-[oklch(0.88_0.02_75)] placeholder-[oklch(0.40_0.02_75)] px-3 py-2 text-sm outline-none focus:border-[oklch(0.72_0.12_65/0.6)] transition-colors";
  const lbl = (t: string) => <label className="block text-[oklch(0.50_0.02_75)] text-[9px] tracking-[0.25em] uppercase mb-1.5" style={{ fontFamily: "var(--font-body)" }}>{t}</label>;
  const sectionTitle = (t: string) => (
    <p className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.3em] uppercase mb-4 mt-6 border-b border-white/8 pb-2" style={{ fontFamily: "var(--font-body)" }}>{t}</p>
  );

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).single().then(({ data }) => {
      if (data) {
        setForm(data as Settings);
        setSkillsText((data.about_skills ?? []).join(", "));
      }
      setLoading(false);
    });
  }, []);

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let hero_image_url = form.hero_image_url;
      let about_portrait_url = form.about_portrait_url;

      if (heroFile) hero_image_url = await uploadImage(heroFile, "hero");
      if (portraitFile) about_portrait_url = await uploadImage(portraitFile, "portraits");

      const about_skills = skillsText.split(",").map((s) => s.trim()).filter(Boolean);

      const { error } = await supabase.from("site_settings").update({
        hero_image_url, hero_name: form.hero_name,
        hero_tagline: form.hero_tagline, hero_kicker: form.hero_kicker,
        hero_blurb: form.hero_blurb || null,
        stat_1_value: form.stat_1_value, stat_1_label: form.stat_1_label,
        stat_2_value: form.stat_2_value, stat_2_label: form.stat_2_label,
        about_portrait_url, about_story_p1: form.about_story_p1 || null,
        about_story_p2: form.about_story_p2 || null,
        about_skills, about_years: form.about_years || null,
        footer_email: form.footer_email || null,
        footer_instagram: form.footer_instagram || null,
        footer_youtube: form.footer_youtube || null,
        updated_at: new Date().toISOString(),
      }).eq("id", 1);

      if (error) throw error;
      toast.success("Settings saved!");
      setHeroFile(null); setHeroPreview(null);
      setPortraitFile(null); setPortraitPreview(null);
    } catch (err: unknown) {
      toast.error("Save failed: " + (err instanceof Error ? err.message : String(err)));
    }
    setSaving(false);
  };

  const ImagePicker = ({ label: labelText, current, preview, onFile, onClear, inputRef }: {
    label: string; current: string | null; preview: string | null;
    onFile: (f: File) => void; onClear: () => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
  }) => (
    <div>
      {lbl(labelText)}
      <div className="flex items-center gap-3">
        {(preview || current) && (
          <div className="relative">
            <img src={preview || current!} alt="preview" className="h-16 object-cover border border-white/10" />
            {preview && <button type="button" onClick={onClear} className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white hover:text-red-400 transition-colors"><X size={10} /></button>}
          </div>
        )}
        <button type="button" onClick={() => inputRef.current?.click()} className="flex items-center gap-2 px-3 py-2 border border-dashed border-white/20 text-[oklch(0.55_0.02_75)] hover:border-[oklch(0.72_0.12_65/0.5)] hover:text-[oklch(0.72_0.12_65)] transition-colors text-sm" style={{ fontFamily: "var(--font-body)" }}>
          <Upload size={13} /> {current || preview ? "Change" : "Upload"}
        </button>
      </div>
      <input ref={inputRef as React.RefObject<HTMLInputElement>} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} className="hidden" />
    </div>
  );

  if (loading) return (
    <div className="flex items-center gap-2 text-[oklch(0.55_0.02_75)] mt-8">
      <Loader2 size={16} className="animate-spin" />
      <span style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>Loading settings...</span>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <p className="text-[oklch(0.72_0.12_65)] text-[10px] tracking-[0.4em] uppercase mb-2" style={{ fontFamily: "var(--font-body)" }}>— Site</p>
        <h1 className="text-[oklch(0.92_0.02_75)]" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 500 }}>Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {sectionTitle("Hero Section")}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>{lbl("Name")}<input value={form.hero_name} onChange={(e) => setForm((p) => ({ ...p, hero_name: e.target.value }))} placeholder="Khalid" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Kicker (sub-headline)")}<input value={form.hero_kicker} onChange={(e) => setForm((p) => ({ ...p, hero_kicker: e.target.value }))} placeholder="Videographer & Filmmaker" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
        </div>
        <div className="mb-4">
          {lbl("Tagline")}
          <input value={form.hero_tagline} onChange={(e) => setForm((p) => ({ ...p, hero_tagline: e.target.value }))} placeholder="Capturing Light & Emotion" className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
        </div>
        <div className="mb-4">
          {lbl("Hero Blurb (short paragraph)")}
          <textarea value={form.hero_blurb ?? ""} onChange={(e) => setForm((p) => ({ ...p, hero_blurb: e.target.value }))} rows={2} className={`${inputClass} resize-none`} style={{ fontFamily: "var(--font-body)" }} />
        </div>
        <div className="mb-4">
          <ImagePicker
            label="Hero Background Image"
            current={form.hero_image_url}
            preview={heroPreview}
            onFile={(f) => { setHeroFile(f); setHeroPreview(URL.createObjectURL(f)); }}
            onClear={() => { setHeroFile(null); setHeroPreview(null); if (heroRef.current) heroRef.current.value = ""; }}
            inputRef={heroRef}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>{lbl("Stat 1 Value")}<input value={form.stat_1_value ?? ""} onChange={(e) => setForm((p) => ({ ...p, stat_1_value: e.target.value }))} placeholder="120+" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Stat 1 Label")}<input value={form.stat_1_label ?? ""} onChange={(e) => setForm((p) => ({ ...p, stat_1_label: e.target.value }))} placeholder="Films" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Stat 2 Value")}<input value={form.stat_2_value ?? ""} onChange={(e) => setForm((p) => ({ ...p, stat_2_value: e.target.value }))} placeholder="8" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Stat 2 Label")}<input value={form.stat_2_label ?? ""} onChange={(e) => setForm((p) => ({ ...p, stat_2_label: e.target.value }))} placeholder="Years" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
        </div>

        {sectionTitle("About Section")}
        <div className="mb-4">
          <ImagePicker
            label="Portrait Image"
            current={form.about_portrait_url}
            preview={portraitPreview}
            onFile={(f) => { setPortraitFile(f); setPortraitPreview(URL.createObjectURL(f)); }}
            onClear={() => { setPortraitFile(null); setPortraitPreview(null); if (portraitRef.current) portraitRef.current.value = ""; }}
            inputRef={portraitRef}
          />
        </div>
        <div className="mb-4">
          {lbl("Years of Experience badge")}
          <input value={form.about_years ?? ""} onChange={(e) => setForm((p) => ({ ...p, about_years: e.target.value }))} placeholder="8+" className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
        </div>
        <div className="mb-4">
          {lbl("Story paragraph 1")}
          <textarea value={form.about_story_p1 ?? ""} onChange={(e) => setForm((p) => ({ ...p, about_story_p1: e.target.value }))} rows={3} className={`${inputClass} resize-none`} style={{ fontFamily: "var(--font-body)" }} />
        </div>
        <div className="mb-4">
          {lbl("Story paragraph 2")}
          <textarea value={form.about_story_p2 ?? ""} onChange={(e) => setForm((p) => ({ ...p, about_story_p2: e.target.value }))} rows={3} className={`${inputClass} resize-none`} style={{ fontFamily: "var(--font-body)" }} />
        </div>
        <div className="mb-4">
          {lbl("Skills (comma-separated)")}
          <input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="Wedding Films, Commercials, Documentary" className={inputClass} style={{ fontFamily: "var(--font-body)" }} />
          <p className="text-[oklch(0.40_0.02_75)] text-[10px] mt-1" style={{ fontFamily: "var(--font-body)" }}>Separate skills with commas.</p>
        </div>

        {sectionTitle("Footer Links")}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div>{lbl("Email")}<input value={form.footer_email ?? ""} onChange={(e) => setForm((p) => ({ ...p, footer_email: e.target.value }))} placeholder="you@example.com" className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("Instagram URL")}<input value={form.footer_instagram ?? ""} onChange={(e) => setForm((p) => ({ ...p, footer_instagram: e.target.value }))} placeholder="https://instagram.com/..." className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
          <div>{lbl("YouTube URL")}<input value={form.footer_youtube ?? ""} onChange={(e) => setForm((p) => ({ ...p, footer_youtube: e.target.value }))} placeholder="https://youtube.com/..." className={inputClass} style={{ fontFamily: "var(--font-body)" }} /></div>
        </div>

        <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-[oklch(0.72_0.12_65)] text-[oklch(0.14_0.018_55)] text-[10px] tracking-[0.25em] uppercase font-semibold hover:bg-[oklch(0.78_0.13_65)] transition-colors disabled:opacity-60" style={{ fontFamily: "var(--font-body)" }}>
          {saving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
