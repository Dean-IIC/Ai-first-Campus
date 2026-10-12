-- Student houses. Rename the two placeholder houses when their names are confirmed.
create table if not exists public.houses (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  namesake      text,
  about         text,
  motto         text,
  is_placeholder boolean not null default false,
  sort_order    int not null default 0,
  updated_at    timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.houses;
create trigger set_updated_at before update on public.houses
  for each row execute function public.set_updated_at();

alter table public.houses enable row level security;
drop policy if exists "Public can read" on public.houses;
create policy "Public can read" on public.houses for select to anon, authenticated using (true);
