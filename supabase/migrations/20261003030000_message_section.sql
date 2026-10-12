-- Messages can appear in different places: 'leadership' (Chairman, Director,
-- Principal) or 'ai-first' (Chief AI and Quantum Officer, under AI-First Campus).
alter table public.leadership_messages
  add column if not exists section text not null default 'leadership';
