-- June 2026 becomes "June – July 2026" (Layer 2, Completed). Applies only while the entry is still empty.
update public.journey_milestones
set period = $pe$June – July 2026$pe$,
    title = $ti$Universal Human Values 2 (UHV-2) — Values-Led AI Adoption$ti$,
    summary = $su$As AI use grew across the campus, June and July focused on making sure it grows with the right values. Through Universal Human Values 2 (UHV-2), HKBK connected the course's ideas of harmony in the self, family, society and nature with responsible, ethical and human-centred use of AI in teaching, learning and administration.$su$,
    points = array[
    $p0$UHV-2 sessions for students linking human values with responsible AI use: honesty, fairness, privacy and respect$p0$,
    $p1$Faculty orientation on teaching UHV-2 and guiding students on ethical AI use in coursework$p1$,
    $p2$Responsible AI guidelines introduced for assignments, projects and assessments, covering academic integrity and proper disclosure of AI use$p2$,
    $p3$Discussions and case studies on AI bias, misinformation, data privacy and the human impact of technology$p3$,
    $p4$Student reflection activities on balancing technology with wellbeing, relationships and society$p4$,
    $p5$Value-based AI project ideas encouraged, focusing on problems that benefit the community and environment$p5$
    ]::text[],
    layer = 2,
    status = 'completed',
    icon = 'users'
where slug = 'm-2026-06' and title = '';
