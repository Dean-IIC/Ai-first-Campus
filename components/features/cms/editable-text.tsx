"use client";

import { createElement, useEffect, useRef, type CSSProperties, type KeyboardEvent } from "react";
import { useAdmin } from "@/components/features/admin/admin-provider";

type Tag = "span" | "p" | "h1" | "h2" | "h3" | "div";

/**
 * Text that the admin can change on the page. Visitors see the text exactly as before. In
 * edit mode the text becomes editable in place: Enter or leaving the text saves it, and Escape
 * puts back the saved text. Until something is saved, the text in the code is shown.
 */
export default function EditableText({
  id,
  children,
  as = "span",
  className,
  style,
}: {
  id: string;
  children: string;
  as?: Tag;
  className?: string;
  style?: CSSProperties;
}) {
  const { admin, editMode, overrides, save } = useAdmin();
  const key = `text:${id}`;
  const saved = typeof overrides[key] === "string" ? (overrides[key] as string) : children;
  const ref = useRef<HTMLElement>(null);
  const before = useRef(saved);

  // Keep the on-screen text in step with the saved value (after a save, undo or restore).
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.textContent !== saved) el.textContent = saved;
  }, [saved]);

  if (!admin) return createElement(as, { className, style, "data-cms-id": id }, saved);

  async function commit(el: HTMLElement) {
    const next = (el.textContent ?? "").replace(/\s+/g, " ").trim();
    if (next === before.current) return;
    if (!next) {
      el.textContent = before.current;
      return;
    }
    const ok = await save(key, next, `Text: ${next.slice(0, 60)}`);
    if (ok) before.current = next;
    else el.textContent = before.current;
  }

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (!editMode) return;
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      e.currentTarget.textContent = before.current;
      e.currentTarget.blur();
    }
  }

  return createElement(
    as,
    {
      ref,
      className,
      style,
      "data-cms": "text",
      "data-cms-id": id,
      contentEditable: editMode,
      suppressContentEditableWarning: true,
      spellCheck: false,
      onFocus: () => {
        before.current = (ref.current?.textContent ?? saved).trim();
      },
      onBlur: (e: { currentTarget: HTMLElement }) => {
        if (editMode) void commit(e.currentTarget);
      },
      onKeyDown,
    },
    saved,
  );
}
