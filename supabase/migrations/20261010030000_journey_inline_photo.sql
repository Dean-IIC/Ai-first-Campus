-- An optional photo with a caption, shown between an entry's first paragraph and its bullet points.
alter table public.journey_milestones add column if not exists inline_photo jsonb;

-- Signed-in staff editors may upload journey photos (the bucket is public to read).
drop policy if exists "Editors can upload journey photos" on storage.objects;
create policy "Editors can upload journey photos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-images' and name like 'journey/%' and public.is_editor());

-- One-time: the April 2026 photo (shipped with the site). It is only set once.
update public.journey_milestones
  set inline_photo = '{"src":"/images/journey/apr-2026-expert-partner.jpg","alt":"Portrait of a man in a blue checked shirt","caption":""}'::jsonb
  where slug = 'apr-2026' and inline_photo is null;
