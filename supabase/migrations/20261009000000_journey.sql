-- "Our AI Transformation Journey 2026": month-by-month milestones shown on the home page.
-- photos is a JSON array of {"src": "...", "alt": "...", "fit": "cover" | "contain"}.
create table if not exists public.journey_milestones (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  period      text not null,
  title       text not null,
  summary     text,
  points      text[] not null default '{}',
  badge       text,
  icon        text not null default 'sparkles',
  photos      jsonb not null default '[]'::jsonb,
  sort_order  int not null default 0,
  updated_at  timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.journey_milestones;
create trigger set_updated_at before update on public.journey_milestones
  for each row execute function public.set_updated_at();

alter table public.journey_milestones enable row level security;
drop policy if exists "Public can read" on public.journey_milestones;
create policy "Public can read" on public.journey_milestones for select to anon, authenticated using (true);
