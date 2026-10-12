-- Timeline editing: each entry has a status (Completed, In progress or Upcoming) and an optional layer (1 to 5).
alter table public.journey_milestones add column if not exists status text not null default 'completed';
alter table public.journey_milestones drop constraint if exists journey_milestones_status_check;
alter table public.journey_milestones add constraint journey_milestones_status_check
  check (status in ('completed', 'in_progress', 'upcoming'));

alter table public.journey_milestones add column if not exists layer int;
alter table public.journey_milestones drop constraint if exists journey_milestones_layer_check;
alter table public.journey_milestones add constraint journey_milestones_layer_check
  check (layer is null or layer between 1 and 5);

-- Signed-in staff editors may add, change and remove timeline entries (the same rule as the champions).
drop policy if exists "Editors can add journey entries" on public.journey_milestones;
create policy "Editors can add journey entries" on public.journey_milestones
  for insert to authenticated with check (public.is_editor());
drop policy if exists "Editors can change journey entries" on public.journey_milestones;
create policy "Editors can change journey entries" on public.journey_milestones
  for update to authenticated using (public.is_editor()) with check (public.is_editor());
drop policy if exists "Editors can remove journey entries" on public.journey_milestones;
create policy "Editors can remove journey entries" on public.journey_milestones
  for delete to authenticated using (public.is_editor());

-- One-time changes to the saved entries. Each is safe to run again and does nothing once applied.
-- May 2026 is the entry in progress: its "— Present" label now comes from its status.
update public.journey_milestones set period = 'May 2026', status = 'in_progress'
  where slug = 'may-2026' and period like '%Present%';
-- The Google Gemini point was removed from the site's content.
update public.journey_milestones
  set points = array_remove(points, 'Google Gemini Enterprise access rolled out to students and faculty')
  where 'Google Gemini Enterprise access rolled out to students and faculty' = any(points);
