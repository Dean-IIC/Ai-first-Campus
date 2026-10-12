-- Which top-menu section each centre or initiative appears under:
-- 'Campus Life', 'Labs' or 'R & D'.
alter table public.portals
  add column if not exists menu_group text not null default 'Campus Life';
