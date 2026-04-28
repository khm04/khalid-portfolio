/**
 * TypeScript types for the Supabase database.
 *
 * After you change the schema, regenerate this with:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts
 *
 * For now, hand-written to match supabase/schema.sql.
 */

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          service: string | null;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          service?: string | null;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      frames: {
        Row: {
          id: string;
          title: string;
          film: string;
          image_url: string;
          span: "default" | "tall" | "wide";
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          film: string;
          image_url: string;
          span?: "default" | "tall" | "wide";
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["frames"]["Insert"]>;
      };
      videos: {
        Row: {
          id: string;
          title: string;
          category: string;
          embed_url: string;
          thumb_url: string;
          duration: string | null;
          year: string | null;
          is_showreel: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          embed_url: string;
          thumb_url: string;
          duration?: string | null;
          year?: string | null;
          is_showreel?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["videos"]["Insert"]>;
      };
      certificates: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          year: string;
          url: string | null;
          logo_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          year: string;
          url?: string | null;
          logo_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["certificates"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: string;
          quote: string;
          name: string;
          role: string;
          initials: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quote: string;
          name: string;
          role: string;
          initials: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      site_settings: {
        Row: {
          id: number;
          hero_image_url: string | null;
          hero_name: string;
          hero_tagline: string;
          hero_kicker: string;
          hero_blurb: string | null;
          stat_1_value: string | null;
          stat_1_label: string | null;
          stat_2_value: string | null;
          stat_2_label: string | null;
          about_portrait_url: string | null;
          about_story_p1: string | null;
          about_story_p2: string | null;
          about_skills: string[];
          about_years: string | null;
          footer_email: string | null;
          footer_instagram: string | null;
          footer_youtube: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          hero_image_url?: string | null;
          hero_name?: string;
          hero_tagline?: string;
          hero_kicker?: string;
          hero_blurb?: string | null;
          stat_1_value?: string | null;
          stat_1_label?: string | null;
          stat_2_value?: string | null;
          stat_2_label?: string | null;
          about_portrait_url?: string | null;
          about_story_p1?: string | null;
          about_story_p2?: string | null;
          about_skills?: string[];
          about_years?: string | null;
          footer_email?: string | null;
          footer_instagram?: string | null;
          footer_youtube?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
      };
    };
  };
};
