-- Editorial help content shown in the Help tab (e.g. "Best time to test", "Know
-- your ketone levels", "Glucose readings"). Global shared content, not user-owned:
-- everyone reads it, only service_role writes it (seeded/managed via migration).
create table public.help_articles (
  id uuid not null default gen_random_uuid(),

  -- Stable, URL-friendly identifier for deep-linking to an article.
  slug text not null,

  title text not null,
  body text not null,

  -- Grouping bucket for the Help tab sections.
  category text,

  -- Which audience the article applies to. The design splits ketone-level content
  -- by user type; 'all' shows to everyone.
  audience text not null default 'all'
    check (audience in ('diabetic', 'non_diabetic', 'all')),

  -- Ordering within a category/section.
  sort_order smallint not null default 0,

  -- Draft articles stay hidden from clients until published.
  is_published boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  primary key (id),

  -- One article per slug.
  unique (slug)
);

-- Listed by section, in order.
create index help_articles_category_sort_idx
  on public.help_articles (category, sort_order);

alter table public.help_articles enable row level security;

-- Read-only to clients; writes go through migrations (service_role bypasses RLS).
grant select on public.help_articles to authenticated;
grant select, insert, update, delete on public.help_articles to service_role;

-- Only published articles are visible to clients.
create policy "Published help articles are viewable by all authenticated users"
  on public.help_articles for select
  to authenticated
  using (is_published);

-- Keep updated_at fresh on every update (function defined in the profiles schema).
create trigger help_articles_set_updated_at
  before update on public.help_articles
  for each row execute procedure public.set_updated_at();
