-- August 2026 becomes "August – September 2026" (Layer 2, Completed). Applies only while the entry is still empty.
update public.journey_milestones
set period = $pe$August – September 2026$pe$,
    title = $ti$AI in Action — Industry Consultancy: AI Customer-Support Chatbot$ti$,
    summary = $su$The AI First initiative moved from the classroom to real-world delivery with an industry consultancy project: an AI-powered customer-support chatbot and Instagram operations system for Camellia Artisanal, a food business. The system answers customer questions using approved business knowledge and hands over to a human whenever a question needs one.$su$,
    points = array[
    $p0$AI chatbot built on structured intent understanding with a controlled RAG/LLM layer, designed never to invent prices, stock, shelf life or delivery promises$p0$,
    $p1$Canonical business-knowledge catalogue so every answer comes from one approved source$p1$,
    $p2$Instagram integration: replies that recognise which post, reel or Story the customer is responding to, with Story auto-sync$p2$,
    $p3$Safe human handoff with owner notifications (admin panel, email and web push)$p3$,
    $p4$Privacy safeguards: hashed customer identifiers in logs, with no raw IDs or customer messages stored$p4$,
    $p5$Over 2,400 automated tests passing, with staged releases and live acceptance testing before every production update$p5$
    ]::text[],
    layer = 2,
    status = 'completed',
    icon = 'rocket'
where slug = 'm-2026-08' and title = '';
