import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

const DEFAULTS: SiteSettings = {
  id: 1,
  hero_image_url: null,
  hero_name: "Khalid",
  hero_tagline: "Capturing Light & Emotion",
  hero_kicker: "Videographer & Filmmaker",
  hero_blurb: null,
  stat_1_value: "120+",
  stat_1_label: "Films",
  stat_2_value: "8",
  stat_2_label: "Years",
  about_portrait_url: null,
  about_story_p1: null,
  about_story_p2: null,
  about_skills: [],
  about_years: "8+",
  footer_email: null,
  footer_instagram: null,
  footer_youtube: null,
  updated_at: "",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) setSettings(data as SiteSettings);
        setLoading(false);
      });
  }, []);

  return { settings, loading };
}
