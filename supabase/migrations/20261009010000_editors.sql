-- Staff editing from the website: who may edit, and what they may change.
-- Add an editor: create the user in Supabase > Authentication > Users, then run
--   insert into public.editors (user_id, email)
--   select id, email from auth.users where email = 'name@hkbk.edu.in';

create table if not exists public.editors (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  role       text not null default 'editor' check (role in ('editor', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.editors enable row level security;
drop policy if exists "Editors can see their own row" on public.editors;
create policy "Editors can see their own row" on public.editors
  for select to authenticated using (user_id = auth.uid());

-- true when the signed-in user is on the editors list
create or replace function public.is_editor() returns boolean
  language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.editors where user_id = auth.uid());
$$;
revoke all on function public.is_editor() from public;
grant execute on function public.is_editor() to anon, authenticated;

-- Short description on each AI Champion / Ambassador card
alter table public.ai_people add column if not exists bio text;
alter table public.ai_people drop constraint if exists ai_people_bio_length;
alter table public.ai_people add constraint ai_people_bio_length check (bio is null or char_length(bio) <= 400);

-- Editors may add, change and remove AI Champions and Ambassadors
drop policy if exists "Editors can add AI people" on public.ai_people;
create policy "Editors can add AI people" on public.ai_people
  for insert to authenticated with check (public.is_editor());
drop policy if exists "Editors can change AI people" on public.ai_people;
create policy "Editors can change AI people" on public.ai_people
  for update to authenticated using (public.is_editor()) with check (public.is_editor());
drop policy if exists "Editors can remove AI people" on public.ai_people;
create policy "Editors can remove AI people" on public.ai_people
  for delete to authenticated using (public.is_editor());

-- Editors may upload photos to site-images/ai-people/ (the bucket is public to read)
drop policy if exists "Editors can upload AI people photos" on storage.objects;
create policy "Editors can upload AI people photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-images' and name like 'ai-people/%' and public.is_editor());
drop policy if exists "Editors can replace AI people photos" on storage.objects;
create policy "Editors can replace AI people photos" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-images' and name like 'ai-people/%' and public.is_editor());
drop policy if exists "Editors can remove AI people photos" on storage.objects;
create policy "Editors can remove AI people photos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-images' and name like 'ai-people/%' and public.is_editor());
