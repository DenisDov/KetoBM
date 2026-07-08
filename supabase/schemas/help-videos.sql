-- The vertical video content in the Help tab. Optionally tied to a help article.
-- Global shared content, not user-owned: everyone reads it, only service_role
-- writes it (seeded/managed via migration).
create table public.help_videos (
  id uuid not null default gen_random_uuid(),

  -- The article this video accompanies, if any. set null (not cascade) so removing
  -- an article keeps the video; a standalone video has a null article_id.
  article_id uuid references public.help_articles on delete set null,

  title text not null,
  video_url text not null,
  thumbnail_url text,

  -- Runtime in seconds, for the UI. Null if unknown.
  duration_seconds integer,

  -- Ordering within the video feed.
  sort_order smallint not null default 0,

  created_at timestamptz not null default now(),

  primary key (id)
);

-- Fetched per article, and listed in feed order.
create index help_videos_article_id_idx on public.help_videos (article_id);
create index help_videos_sort_idx on public.help_videos (sort_order);

alter table public.help_videos enable row level security;

-- Read-only to clients; writes go through migrations (service_role bypasses RLS).
grant select on public.help_videos to authenticated;
grant select, insert, update, delete on public.help_videos to service_role;

create policy "Help videos are viewable by all authenticated users"
  on public.help_videos for select
  to authenticated
  using (true);
