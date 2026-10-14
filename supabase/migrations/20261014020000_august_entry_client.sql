-- August – September 2026: the client is described as "a Bengaluru food business" instead of by name.
update public.journey_milestones
set summary = $su$The AI First initiative moved from the classroom to real-world delivery with an industry consultancy project: an AI-powered customer-support chatbot and Instagram operations system for a Bengaluru food business. The system answers customer questions using approved business knowledge and hands over to a human whenever a question needs one.$su$
where slug = 'm-2026-08' and summary like '%consultancy project%';
