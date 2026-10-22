-- Faculty shown on a department page: photo, then name, designation and qualification.
-- department holds the department's slug (for example 'aiml').
create table if not exists public.faculty (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  department     text not null,
  name           text not null,
  designation    text,
  qualification  text,
  photo_url      text,
  sort_order     int not null default 0,
  updated_at     timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.faculty;
create trigger set_updated_at before update on public.faculty
  for each row execute function public.set_updated_at();

alter table public.faculty enable row level security;
drop policy if exists "Public can read" on public.faculty;
create policy "Public can read" on public.faculty for select to anon, authenticated using (true);

grant select on public.faculty to anon, authenticated;
