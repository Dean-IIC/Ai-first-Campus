-- Table permissions for the Data API. New Supabase projects no longer grant these automatically.
-- Row-level security still decides which rows each role may see or change.

-- The server (secret key) manages everything.
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on function public.set_updated_at() to service_role;

-- Visitors may read the public content (each table's "Public can read" policy decides which rows).
grant select on public.pages, public.leadership_messages, public.departments, public.dashboards,
  public.uhv_activities, public.research_projects, public.consultancy_projects, public.training_programs,
  public.hostel_facilities, public.news_items, public.portals, public.ai_people, public.key_figures,
  public.houses, public.mous, public.journey_milestones, public.site_content
  to anon, authenticated;

-- Visitors may send an enquiry but never read one (only the insert policy exists).
grant insert on public.enquiries to anon, authenticated;

-- Old staff-editor rules (unused now): a signed-in user may see their own editors row.
grant select on public.editors to authenticated;
