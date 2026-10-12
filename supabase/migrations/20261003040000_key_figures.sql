-- Big numbers on the home page: years of excellence, students, papers, patents.
-- "years-of-excellence" is calculated from the founding year; leave its value empty.
create table if not exists public.key_figures (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  label       text not null,
  value       int check (value is null or value >= 0),
  suffix      text not null default '+',
  sort_order  int not null default 0,
  updated_at  timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.key_figures;
create trigger set_updated_at before update on public.key_figures
  for each row execute function public.set_updated_at();

alter table public.key_figures enable row level security;
drop policy if exists "Public can read" on public.key_figures;
create policy "Public can read" on public.key_figures for select to anon, authenticated using (true);
