-- Live content editing for the site admin.
-- site_content holds the value of every editable piece of text, image and list.
-- site_history keeps the last 30 changes so they can be undone or restored.
-- admin_security holds the single admin's failed sign-in count and lock time.

create table if not exists public.site_content (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.site_content;
create trigger set_updated_at before update on public.site_content
  for each row execute function public.set_updated_at();

create table if not exists public.site_history (
  id          bigint generated always as identity primary key,
  key         text not null,
  label       text not null,
  old_value   jsonb,
  new_value   jsonb,
  created_at  timestamptz not null default now()
);

create table if not exists public.admin_security (
  id               int primary key check (id = 1),
  failed_attempts  int not null default 0,
  locked_until     timestamptz
);

alter table public.site_content enable row level security;
alter table public.site_history enable row level security;
alter table public.admin_security enable row level security;

-- Visitors may read the content. Nobody but the server (service role) may write it,
-- and history and security data are never readable through the public API.
drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content" on public.site_content for select to anon, authenticated using (true);
