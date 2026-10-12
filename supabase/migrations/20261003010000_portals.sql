-- College portals hosted on their own subdomains (UHV, R&D, Alumni, ...).
-- The website lists them in the "Portals" menu, the footer, the home page and /portals.
-- Paste each portal's address into `url` and set `status` to 'Live' when it is ready.

create table if not exists public.portals (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text,
  url           text check (url is null or url ~* '^https?://'),
  category      text not null default 'Students and alumni',
  icon          text not null default 'link',
  status        text not null default 'Coming soon' check (status in ('Live', 'Coming soon')),
  related_page  text,
  sort_order    int not null default 0,
  updated_at    timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.portals;
create trigger set_updated_at before update on public.portals
  for each row execute function public.set_updated_at();

alter table public.portals enable row level security;
drop policy if exists "Public can read" on public.portals;
create policy "Public can read" on public.portals for select to anon, authenticated using (true);
