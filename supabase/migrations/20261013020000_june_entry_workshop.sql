-- June – July 2026: the UHV-2 content is replaced by the AI Faculty Champions workshop (Layer 2, Completed).
update public.journey_milestones
set period = $pe$June – July 2026$pe$,
    title = $ti$AI Faculty Champions Recognised — AI Transformation Workshop$ti$,
    summary = $su$HKBK College of Engineering, Bangalore, organised an AI Transformation Workshop for its faculty. Faculty members who showed outstanding participation and active contribution were recognised as AI Faculty Champions, honouring their enthusiasm and commitment to adopting AI-driven practices.$su$,
    points = array[
    $p0$AI Transformation Workshop organised by HKBK College of Engineering, Bangalore$p0$,
    $p1$Faculty members recognised as "AI Faculty Champions" with a Certificate of Recognition$p1$,
    $p2$Recognition awarded for outstanding participation and active contribution throughout the workshop$p2$,
    $p3$Celebrates faculty enthusiasm and commitment to adopting AI-driven practices in teaching and academic work$p3$,
    $p4$Certificates jointly issued by the industry training partner and the leadership of HKBK Group of Institutions$p4$,
    $p5$AI Faculty Champions now lead AI adoption in their departments, mentoring colleagues and guiding responsible AI use$p5$
    ]::text[],
    layer = 2,
    status = 'completed',
    icon = 'trophy'
where slug = 'm-2026-06' and title in ('', $old$Universal Human Values 2 (UHV-2) — Values-Led AI Adoption$old$);
