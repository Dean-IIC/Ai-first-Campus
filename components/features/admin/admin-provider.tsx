"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { historyAction, restoreAction, saveValueAction, undoAction, type ChangeResult, type HistoryRow } from "@/actions/admin";

export type Status = { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; message: string };
export type Overrides = Record<string, unknown>;

export type AdminValue = {
  admin: boolean;
  editMode: boolean;
  setEditMode: (on: boolean) => void;
  overrides: Overrides;
  status: Status;
  historyOpen: boolean;
  setHistoryOpen: (open: boolean) => void;
  save: (key: string, value: unknown, label: string) => Promise<boolean>;
  undo: () => Promise<void>;
  restore: (id: number) => Promise<void>;
  loadHistory: () => Promise<{ ok: true; entries: HistoryRow[] } | { ok: false; error: string }>;
  uploadImage: (file: Blob, name: string) => Promise<string>;
};

const NOOP = () => undefined;
const DEFAULT: AdminValue = {
  admin: false,
  editMode: false,
  setEditMode: NOOP,
  overrides: {},
  status: { kind: "idle" },
  historyOpen: false,
  setHistoryOpen: NOOP,
  save: async () => false,
  undo: async () => undefined,
  restore: async () => undefined,
  loadHistory: async () => ({ ok: false, error: "Not signed in." }),
  uploadImage: async () => {
    throw new Error("Not signed in.");
  },
};

const AdminContext = createContext<AdminValue>(DEFAULT);
export function useAdmin(): AdminValue {
  return useContext(AdminContext);
}

function withoutKey(o: Overrides, key: string): Overrides {
  const next = { ...o };
  delete next[key];
  return next;
}

/** Holds the admin's session, edit mode, the saved overrides and the save status for the whole site. */
export function AdminProvider({ initialOverrides, children }: { initialOverrides: Overrides; children: ReactNode }) {
  const [admin, setAdmin] = useState(false);
  const [editMode, setEditModeState] = useState(false);
  const [overrides, setOverrides] = useState<Overrides>(initialOverrides);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [historyOpen, setHistoryOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Checked again on every page change, so signing in or out takes effect at once.
  useEffect(() => {
    fetch("/api/admin/session", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { admin?: boolean }) => {
        const signedIn = Boolean(d.admin);
        setAdmin(signedIn);
        setEditModeState(signedIn && window.sessionStorage.getItem("hkbk-edit") === "1");
      })
      .catch(() => setAdmin(false));
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("cms-admin", admin);
    document.body.classList.toggle("cms-edit", admin && editMode);
  }, [admin, editMode]);

  useEffect(() => {
    if (status.kind !== "saved") return;
    const t = window.setTimeout(() => setStatus({ kind: "idle" }), 2000);
    return () => window.clearTimeout(t);
  }, [status]);

  const setEditMode = useCallback((on: boolean) => {
    setEditModeState(on);
    window.sessionStorage.setItem("hkbk-edit", on ? "1" : "0");
  }, []);

  const applyResult = useCallback((r: ChangeResult) => {
    if (!r.ok) {
      setStatus({ kind: "error", message: r.error });
      return false;
    }
    setOverrides((o) => (r.value === null ? withoutKey(o, r.key) : { ...o, [r.key]: r.value }));
    setStatus({ kind: "saved" });
    // Pages, messages, lists and contact details are drawn on the server, so fetch the page again.
    if (!/^(text|image):/.test(r.key)) router.refresh();
    return true;
  }, [router]);

  const save = useCallback(
    async (key: string, value: unknown, label: string) => {
      setStatus({ kind: "saving" });
      try {
        return applyResult(await saveValueAction(key, value, label));
      } catch {
        setStatus({ kind: "error", message: "The change could not be saved. Check your connection and try again." });
        return false;
      }
    },
    [applyResult],
  );

  const undo = useCallback(async () => {
    setStatus({ kind: "saving" });
    applyResult(await undoAction());
  }, [applyResult]);

  const restore = useCallback(
    async (id: number) => {
      setStatus({ kind: "saving" });
      applyResult(await restoreAction(id));
    },
    [applyResult],
  );

  const loadHistory = useCallback(() => historyAction(), []);

  const uploadImage = useCallback(async (file: Blob, name: string) => {
    const form = new FormData();
    form.append("file", file, name);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok || !data.url) throw new Error(data.error ?? "The picture could not be uploaded.");
    return data.url;
  }, []);

  const value = useMemo<AdminValue>(
    () => ({ admin, editMode, setEditMode, overrides, status, historyOpen, setHistoryOpen, save, undo, restore, loadHistory, uploadImage }),
    [admin, editMode, setEditMode, overrides, status, historyOpen, save, undo, restore, loadHistory, uploadImage],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
