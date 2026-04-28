-- =====================================================================
-- Khalid Portfolio — Supabase schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query
-- Safe to re-run; uses IF NOT EXISTS / ON CONFLICT.
-- =====================================================================

-- Admin email — anyone signed in with this email gets write access.
-- Change here AND in src/lib/supabase.ts if you ever change emails.
create or replace function public.admin_email() returns text
  language sql immutable as $$ select 'khalidmasoud4321@gmail.com'::text $$;

create or replace function public.is_admin() returns boolean
  language sql stable as $$
    select coalesce(auth.jwt() ->> 'email', '') = public.admin_email()
  $$;

-- =====================================================================
-- TABLES
-- =====================================================================

-- Contact form submissions
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  service     text,
  message     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Curated still frames from films
create table if not exists public.frames (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  film        text not null,
  image_url   text not null,
  span        text not null default 'default' check (span in ('default', 'tall', 'wide')),
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- Videography projects (showreel + project cards)
create table if not exists public.videos (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  category     text not null,
  embed_url    text not null,
  thumb_url    text not null,
  duration     text,
  year         text,
  is_showreel  boolean not null default false,
  sort_order   int    not null default 0,
  created_at   timestamptz not null default now()
);

-- Certificates / credentials
create table if not exists public.certificates (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  issuer      text not null,
  year        text not null,
  url         text,
  logo_url    text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- Client testimonials
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  quote       text not null,
  name        text not null,
  role        text not null,
  initials    text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- Helpful indexes
create index if not exists frames_sort_idx       on public.frames       (sort_order);
create index if not exists videos_sort_idx       on public.videos       (sort_order);
create index if not exists certificates_sort_idx on public.certificates (sort_order);
create index if not exists testimonials_sort_idx on public.testimonials (sort_order);
create index if not exists messages_created_idx  on public.messages     (created_at desc);

-- =====================================================================
-- ROW LEVEL SECURITY
-- Public can READ portfolio content + INSERT messages.
-- Only the admin email can mutate portfolio content.
-- Only the admin can read messages.
-- =====================================================================

alter table public.messages     enable row level security;
alter table public.frames       enable row level security;
alter table public.videos       enable row level security;
alter table public.certificates enable row level security;
alter table public.testimonials enable row level security;

-- Drop existing policies so this script is re-runnable
drop policy if exists "anyone can submit a message"   on public.messages;
drop policy if exists "admin can read messages"       on public.messages;
drop policy if exists "admin can update messages"     on public.messages;
drop policy if exists "admin can delete messages"     on public.messages;

drop policy if exists "public read frames"            on public.frames;
drop policy if exists "admin write frames"            on public.frames;

drop policy if exists "public read videos"            on public.videos;
drop policy if exists "admin write videos"            on public.videos;

drop policy if exists "public read certificates"      on public.certificates;
drop policy if exists "admin write certificates"      on public.certificates;

drop policy if exists "public read testimonials"      on public.testimonials;
drop policy if exists "admin write testimonials"      on public.testimonials;

-- messages: anonymous insert, admin-only read/update/delete
create policy "anyone can submit a message"
  on public.messages for insert to anon, authenticated
  with check (true);

create policy "admin can read messages"
  on public.messages for select to authenticated
  using (public.is_admin());

create policy "admin can update messages"
  on public.messages for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "admin can delete messages"
  on public.messages for delete to authenticated
  using (public.is_admin());

-- frames / videos / certificates / testimonials: public read, admin write
create policy "public read frames"      on public.frames       for select to anon, authenticated using (true);
create policy "admin write frames"      on public.frames       for all    to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read videos"      on public.videos       for select to anon, authenticated using (true);
create policy "admin write videos"      on public.videos       for all    to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read certificates" on public.certificates for select to anon, authenticated using (true);
create policy "admin write certificates" on public.certificates for all    to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read testimonials" on public.testimonials for select to anon, authenticated using (true);
create policy "admin write testimonials" on public.testimonials for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- SITE SETTINGS (singleton row for hero/about/footer copy & assets)
-- =====================================================================

create table if not exists public.site_settings (
  id                 int  primary key default 1,
  hero_image_url     text,
  hero_name          text not null default 'Khalid',
  hero_tagline       text not null default 'Capturing Light & Emotion',
  hero_kicker        text not null default 'Videographer & Filmmaker',
  hero_blurb         text,
  stat_1_value       text default '120+',
  stat_1_label       text default 'Films',
  stat_2_value       text default '8',
  stat_2_label       text default 'Years',
  about_portrait_url text,
  about_story_p1     text,
  about_story_p2     text,
  about_skills       text[] not null default '{}',
  about_years        text default '8+',
  footer_email       text,
  footer_instagram   text,
  footer_youtube     text,
  updated_at         timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "public read site_settings" on public.site_settings;
drop policy if exists "admin write site_settings" on public.site_settings;

create policy "public read site_settings"
  on public.site_settings for select to anon, authenticated using (true);
create policy "admin write site_settings"
  on public.site_settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- STORAGE
-- Bucket for frame images and certificate logos uploaded from the dashboard.
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public read media"  on storage.objects;
drop policy if exists "admin write media"  on storage.objects;

create policy "public read media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');

create policy "admin write media"
  on storage.objects for all to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());
