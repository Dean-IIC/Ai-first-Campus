-- HKBK College of Engineering website: initial schema
-- Run in Supabase: Dashboard > SQL Editor > paste and run,
-- or with the CLI: supabase db push

-- ---------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------
-- Content tables (public read, edited by admins)
-- ---------------------------------------------------------------
create table if not exists public.pages (
  slug        text primary key,
  title       text not null,
  summary     text,
  body_md     text not null default '',
  updated_at  timestamptz not null default now()
);

create table if not exists public.leadership_messages (
  slug          text primary key,
  name          text,
  designation   text not null,
  organisation  text,
  excerpt       text,
  photo_url     text,
  body_md       text not null default '',
  sort_order    int not null default 0,
  updated_at    timestamptz not null default now()
);

create table if not exists public.departments (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  short_name   text,
  programmes   text,
  description  text,
  sort_order   int not null default 0,
  updated_at   timestamptz not null default now()
);

create table if not exists public.dashboards (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  category     text not null check (category in ('AI', 'Quantum', 'Academic', 'Research', 'Operations')),
  description  text,
  url          text,
  status       text not null default 'In development' check (status in ('Live', 'Beta', 'In development')),
  sort_order   int not null default 0,
  updated_at   timestamptz not null default now()
);

create table if not exists public.uhv_activities (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  activity_type  text not null,
  title          text not null,
  description    text,
  sort_order     int not null default 0,
  updated_at     timestamptz not null default now()
);

create table if not exists public.research_projects (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  investigator    text,
  funding_agency  text,
  status          text not null default 'Ongoing' check (status in ('Proposed', 'Ongoing', 'Completed')),
  year            int,
  summary         text,
  is_sample       boolean not null default false,
  sort_order      int not null default 0,
  updated_at      timestamptz not null default now()
);

create table if not exists public.consultancy_projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  client      text,
  department  text,
  status      text not null default 'Ongoing' check (status in ('Proposal', 'Ongoing', 'Completed')),
  year        int,
  summary     text,
  is_sample   boolean not null default false,
  sort_order  int not null default 0,
  updated_at  timestamptz not null default now()
);

create table if not exists public.training_programs (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  track       text not null,
  duration    text,
  mode        text,
  audience    text,
  summary     text,
  is_sample   boolean not null default false,
  sort_order  int not null default 0,
  updated_at  timestamptz not null default now()
);

create table if not exists public.hostel_facilities (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  description  text,
  is_sample    boolean not null default false,
  sort_order   int not null default 0,
  updated_at   timestamptz not null default now()
);

create table if not exists public.news_items (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  kind          text not null default 'news' check (kind in ('news', 'event')),
  title         text not null,
  summary       text,
  published_on  date not null default current_date,
  event_date    date,
  link_url      text,
  is_sample     boolean not null default false,
  updated_at    timestamptz not null default now()
);
create index if not exists news_items_published_on_idx on public.news_items (published_on desc);

-- ---------------------------------------------------------------
-- Enquiries (forms): anyone may submit, nobody may read via the API
-- ---------------------------------------------------------------
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in (
                'contact', 'admission', 'corporate_training',
                'consultancy', 'hostel_application', 'hostel_complaint')),
  name        text not null check (char_length(name) between 2 and 200),
  email       text check (email is null or char_length(email) <= 200),
  phone       text check (phone is null or char_length(phone) <= 30),
  message     text check (message is null or char_length(message) <= 4000),
  details     jsonb not null default '{}'::jsonb,
  status      text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at  timestamptz not null default now(),
  constraint enquiries_contact_present check (email is not null or phone is not null)
);
create index if not exists enquiries_type_status_idx on public.enquiries (type, status, created_at desc);

-- ---------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'pages', 'leadership_messages', 'departments', 'dashboards', 'uhv_activities',
    'research_projects', 'consultancy_projects', 'training_programs',
    'hostel_facilities', 'news_items'
  ]
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'pages', 'leadership_messages', 'departments', 'dashboards', 'uhv_activities',
    'research_projects', 'consultancy_projects', 'training_programs',
    'hostel_facilities', 'news_items'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Public can read" on public.%I', t);
    execute format(
      'create policy "Public can read" on public.%I for select to anon, authenticated using (true)', t);
  end loop;
end $$;

-- Writes to content tables happen only through the Supabase dashboard or the
-- secret key (seed script). There are deliberately no insert/update/delete
-- policies for anon or authenticated users.

alter table public.enquiries enable row level security;
drop policy if exists "Anyone can submit an enquiry" on public.enquiries;
create policy "Anyone can submit an enquiry"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (status = 'new');
-- No select/update/delete policies: staff read enquiries in the Supabase
-- dashboard (Table Editor), which uses elevated access.

-- ---------------------------------------------------------------
-- Storage bucket for leadership portraits and page images
-- ---------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;
