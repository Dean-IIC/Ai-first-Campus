-- Memoranda of Understanding (MoUs) with industry, academic, research and government partners.
create table if not exists public.mous (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  partner       text not null,
  partner_type  text not null default 'Industry' check (partner_type in ('Industry', 'Academic', 'Research', 'Government')),
  purpose       text,
  signed_on     date,
  valid_until   date,
  document_url  text check (document_url is null or document_url ~* '^https?://'),
  logo_url      text,
  sort_order    int not null default 0,
  updated_at    timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.mous;
create trigger set_updated_at before update on public.mous
  for each row execute function public.set_updated_at();

alter table public.mous enable row level security;
drop policy if exists "Public can read" on public.mous;
create policy "Public can read" on public.mous for select to anon, authenticated using (true);
