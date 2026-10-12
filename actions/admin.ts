"use server";

import { redirect } from "next/navigation";
import { updateTag, revalidatePath } from "next/cache";
import { adminConfig } from "@/lib/admin/config";
import { endAdminSession, isAdminSession, startAdminSession } from "@/lib/admin/session";
import { clearFailedAttempts, minutesLocked, recordFailedAttempt } from "@/lib/admin/lockout";
import { cleanValue } from "@/lib/cms/validate";
import { listHistory, restoreChange, undoLastChange, writeContent, type HistoryRow } from "@/lib/cms/write";

export type { HistoryRow };
import { timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

export type LoginState = { message: string; signedIn?: boolean };
export type ChangeResult = { ok: true; key: string; value: unknown | null; label: string } | { ok: false; error: string };
export type HistoryResult = { ok: true; entries: HistoryRow[] } | { ok: false; error: string };

const SIGNED_OUT = "You are signed out. Sign in again to make changes.";
const GENERIC = "Invalid email or password.";

/** Compares two strings in constant time, so the check does not reveal how much matched. */
function sameText(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const cfg = adminConfig();
  if (!cfg.ready) return { message: "Admin sign-in is not set up yet. Ask the site administrator." };
  const left = await minutesLocked().catch(() => 0);
  if (left > 0) return { message: `Too many failed attempts. Try again in ${left} minute${left === 1 ? "" : "s"}.` };

  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const password = String(formData.get("password") ?? "").slice(0, 200);
  const emailOk = sameText(email, cfg.email);
  const passwordOk = password.length > 0 && (await bcrypt.compare(password, cfg.hash));
  if (!(emailOk && passwordOk)) {
    await recordFailedAttempt().catch(() => undefined);
    return { message: GENERIC };
  }
  await clearFailedAttempts().catch(() => undefined);
  await startAdminSession();
  return { message: "", signedIn: true };
}

export async function logoutAction(): Promise<void> {
  await endAdminSession();
  redirect("/");
}

/** Saves one editable value. The value is checked and cleaned on the server first. */
export async function saveValueAction(key: string, value: unknown, label: string): Promise<ChangeResult> {
  if (!(await isAdminSession())) return { ok: false, error: SIGNED_OUT };
  try {
    const clean = cleanValue(key, value);
    const shortLabel = String(label).replace(/<[^>]*>/g, "").slice(0, 160) || key;
    await writeContent(key, clean, shortLabel);
    updateTag("cms");
    revalidatePath("/", "layout");
    return { ok: true, key, value: clean, label: shortLabel };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "The change could not be saved." };
  }
}

export async function undoAction(): Promise<ChangeResult> {
  if (!(await isAdminSession())) return { ok: false, error: SIGNED_OUT };
  try {
    const done = await undoLastChange();
    updateTag("cms");
    revalidatePath("/", "layout");
    return { ok: true, key: done.key, value: done.value, label: `Undone: ${done.label}` };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Nothing could be undone." };
  }
}

export async function restoreAction(id: number): Promise<ChangeResult> {
  if (!(await isAdminSession())) return { ok: false, error: SIGNED_OUT };
  try {
    const done = await restoreChange(Number(id));
    updateTag("cms");
    revalidatePath("/", "layout");
    return { ok: true, key: done.key, value: done.value, label: done.label };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "That version could not be restored." };
  }
}

export async function historyAction(): Promise<HistoryResult> {
  if (!(await isAdminSession())) return { ok: false, error: SIGNED_OUT };
  try {
    return { ok: true, entries: await listHistory() };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "The history could not be loaded." };
  }
}
