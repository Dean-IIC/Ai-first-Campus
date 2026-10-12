-- Department vision, mission and research centres; AI Faculty Champions and AI Student Ambassadors.

alter table public.departments
  add column if not exists kind text not null default 'Engineering',
  add column if not exists vision text,
  add column if not exists mission text[] not null default '{}',
  add column if not exists has_research_centre boolean not null default false,
  add column if not exists research_areas text[] not null default '{}';

-- People in the AI First programme. Add rows as names and photos become available.
create table if not exists public.ai_people (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  role        text not null check (role in ('Faculty champion', 'Student ambassador')),
  department  text,
  photo_url   text,
  sort_order  int not null default 0,
  updated_at  timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.ai_people;
create trigger set_updated_at before update on public.ai_people
  for each row execute function public.set_updated_at();

alter table public.ai_people enable row level security;
drop policy if exists "Public can read" on public.ai_people;
create policy "Public can read" on public.ai_people for select to anon, authenticated using (true);
