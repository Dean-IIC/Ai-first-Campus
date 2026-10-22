-- Academic years an MoU covers, for example "AY 2023-24" or "AY 2023-26".
alter table public.mous add column if not exists academic_year text;
