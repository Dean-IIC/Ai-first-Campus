"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { addJourneyMonthAction, listJourneyForEditor, reorderJourneyAction } from "@/actions/journey";
import { Button } from "@/components/ui/button";
import { checkEditor } from "@/lib/editor";
import { inlinePhotoOf, isFilled, presentSlug } from "@/lib/journey-model";
import type { JourneyMilestone } from "@/lib/types";
import JourneyEditButton from "./journey-edit-button";
import JourneyEntry from "./journey-entry";
import JourneyPhotoEditor from "./journey-photo-editor";
import { useJourneyDrag } from "./use-journey-drag";

/**
 * The timeline. Visitors see the months that have content, as the server sent them. A signed-in
 * editor also gets every month (empty ones included), with Edit/Add, add month, delete and drag
 * to reorder. Each change is saved straight away.
 */
export default function JourneyTimeline({ visible }: { visible: JourneyMilestone[] }) {
  const [all, setAll] = useState<JourneyMilestone[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    checkEditor().then(async (ok) => {
      if (!ok || !live) return;
      const res = await listJourneyForEditor();
      if (!live) return;
      if (res.ok) setAll(res.entries);
      else setMessage(res.message);
    });
    return () => {
      live = false;
    };
  }, []);

  const editing = all !== null;
  const list = all ?? visible;
  const present = presentSlug(list.filter(isFilled));

  function replaceEntry(entry: JourneyMilestone) {
    setAll((cur) => (cur ?? []).map((x) => (x.slug === entry.slug ? entry : x)));
  }

  function setPhoto(slug: string, photo: JourneyMilestone["inline_photo"]) {
    setAll((cur) => (cur ?? []).map((x) => (x.slug === slug ? { ...x, inline_photo: photo } : x)));
  }

  function removeEntry(slug: string) {
    setAll((cur) => (cur ?? []).filter((x) => x.slug !== slug));
  }

  async function saveOrder(next: JourneyMilestone[]) {
    const before = all;
    setAll(next);
    const res = await reorderJourneyAction(next.map((m) => m.slug));
    if (!res.ok) {
      setMessage(res.message);
      setAll(before);
    } else {
      setMessage(null);
    }
  }

  function move(index: number, delta: number) {
    if (!all) return;
    const j = index + delta;
    if (j < 0 || j >= all.length) return;
    const next = [...all];
    [next[index], next[j]] = [next[j], next[index]];
    void saveOrder(next);
  }

  const dragProps = useJourneyDrag(all, (next) => void saveOrder(next));

  async function addMonth() {
    setMessage(null);
    const res = await addJourneyMonthAction();
    if (!res.ok) return setMessage(res.message);
    if (res.entry) {
      const entry = res.entry;
      setAll((cur) => [...(cur ?? []), entry]);
    }
  }

  return (
    <>
      {message && (
        <p role="alert" className="mt-6 text-sm font-medium text-destructive">
          {message}
        </p>
      )}
      <ol className="mt-8">
        {list.map((m, i) => (
          <JourneyEntry
            key={m.slug}
            milestone={m}
            last={i === list.length - 1}
            present={m.slug === present}
            liProps={editing ? dragProps(m.slug) : undefined}
            photoSlot={
              editing && (m.summary || inlinePhotoOf(m)) ? (
                <JourneyPhotoEditor
                  slug={m.slug}
                  period={m.period}
                  photo={inlinePhotoOf(m)}
                  onSaved={(p) => setPhoto(m.slug, p)}
                />
              ) : undefined
            }
            controls={
              editing ? (
                <JourneyEditButton
                  m={m}
                  position={i}
                  total={list.length}
                  onSaved={replaceEntry}
                  onDeleted={removeEntry}
                  onMove={(delta) => move(i, delta)}
                />
              ) : undefined
            }
          />
        ))}
      </ol>
      {editing && (
        <div className="mt-2">
          <Button type="button" variant="outline" onClick={addMonth}>
            <Plus aria-hidden="true" />
            Add month
          </Button>
        </div>
      )}
    </>
  );
}
