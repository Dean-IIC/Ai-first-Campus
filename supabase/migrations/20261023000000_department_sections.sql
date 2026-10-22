-- Optional sections on a department page. Each shows only when it has content, so departments
-- without it look as before. Lines use the "Label: text" convention of mission ("M1: ...").
--   show_research_tile  false hides the "Research centre" tile and overview row
--   history             "2021–22: Department established with an intake of 60"
--   approvals           "Approved by AICTE"
--   peos / psos / pos   "PEO1: ...", "PSO1: ...", "PO1: Engineering knowledge: ..."
--   curriculum          "Semester 1 (2025 scheme): Subject one; Subject two"
--   employment_scope    "Corporate jobs: Industry-oriented pathways ..."
--   career_roles        "AI / ML engineer"
alter table public.departments
  add column if not exists show_research_tile boolean not null default true,
  add column if not exists history text[] not null default '{}',
  add column if not exists approvals text[] not null default '{}',
  add column if not exists peos text[] not null default '{}',
  add column if not exists psos text[] not null default '{}',
  add column if not exists pos text[] not null default '{}',
  add column if not exists curriculum text[] not null default '{}',
  add column if not exists employment_scope text[] not null default '{}',
  add column if not exists career_roles text[] not null default '{}',
  add column if not exists achievements text,
  add column if not exists achievements_image text;
