-- September – October 2026: the Alumni Portal is part of the HKBK college website, not Zoho (Layer 4, In progress).
update public.journey_milestones
set summary = $su$September and October took the AI First journey into campus operations. Using the Zoho Creator low-code platform, HKBK began building its own digital systems for Hostel Management and Attendance Management, replacing manual registers and spreadsheets with secure, role-based apps and live dashboards. Alongside this, a new Alumni Portal is being developed as part of the HKBK college website. The systems are being built in-house by HKBK students under faculty mentorship.$su$,
    points = array[
    $p0$Hostel Management System for the Boys and Girls hostels: one central app with role-based access for the Principal, Super Admin, Wardens, Operations and Students$p0$,
    $p1$Live hostel dashboards with student search, fee tracking, attendance calendar, memos and quick actions$p1$,
    $p2$Automated account approvals, maintenance and service tickets raised by students and handled by the Operations team, with urgent-ticket flagging by the Principal$p2$,
    $p3$Branded printable reports with one-click PDF and CSV download, carrying the HKBK logo, college name and timestamps$p3$,
    $p4$Attendance Management system to record and track attendance digitally, with summaries for faculty and administrators$p4$,
    $p5$Secure by design: each user sees only the data their role allows$p5$,
    $p6$Alumni Portal on the HKBK college website to build the alumni network: alumni registration, profiles and a channel to stay connected with the college$p6$
    ]::text[],
    layer = 4
where slug = 'm-2026-10';
