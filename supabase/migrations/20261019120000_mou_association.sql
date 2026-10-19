-- Who signed each MoU on HKBK's side, for example "HKBKCE" or "VTU and HKBKCE".
alter table public.mous add column if not exists association text;
