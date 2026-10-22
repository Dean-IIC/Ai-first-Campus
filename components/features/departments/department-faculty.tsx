"use client";

import { useState } from "react";
import { navyPill } from "@/lib/ui";
import FacultyMember from "./faculty-card";
import FacultyCardForm from "./faculty-card-form";
import { useFacultyEditor } from "./faculty-editor";
import { NoFacultyYet } from "./faculty-view";

/** Group headings for the usual designations; any other designation is used as written. */
const PLURAL: Record<string, string> = {
  Professor: "Professors",
  "Associate Professor": "Associate Professors",
  "Assistant Professor": "Assistant Professors",
  "Teaching Assistant": "Teaching Assistants",
};

/**
 * The department's faculty: the head of department first, then everyone else grouped by
 * designation in rank order (Edit content → Faculty designations; the order number sorts each
 * group). The signed-in admin also gets Add faculty, and Edit and Delete on each card.
 */
export default function DepartmentFaculty() {
  const { admin, department, ranks, rows } = useFacultyEditor();
  const [adding, setAdding] = useState(false);
  const faculty = rows.filter((f) => f.department === department).sort((a, b) => a.sort_order - b.sort_order);
  const hod = faculty.find((f) => f.is_hod);
  const others = faculty.filter((f) => f !== hod);
  const groups = [...ranks, null].map((rank) => ({
    title: rank ? PLURAL[rank] ?? rank : "Faculty",
    people: others.filter((f) => (rank ? f.designation === rank : !ranks.includes(f.designation ?? ""))),
  }));
  const nextOrder = faculty.reduce((n, f) => Math.max(n, f.sort_order), 0) + 1;

  return (
    <div className="space-y-10">
      {admin &&
        (adding ? (
          <FacultyCardForm nextOrder={nextOrder} onDone={() => setAdding(false)} />
        ) : (
          <button type="button" className={navyPill} onClick={() => setAdding(true)}>
            <span aria-hidden="true">➕</span> Add faculty
          </button>
        ))}
      {faculty.length === 0 && <NoFacultyYet />}
      {hod && <FacultyMember person={hod} hod />}
      {groups
        .filter((g) => g.people.length > 0)
        .map((g) => (
          <section key={g.title} aria-label={g.title}>
            <h2 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-heading">{g.title}</h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {g.people.map((f, i) => (
                <li key={f.slug || `new-${i}`}>
                  <FacultyMember person={f} />
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  );
}
