import { LOCK_MINUTES, MAX_FAILED_ATTEMPTS } from "./config";
import { restJson } from "./service";

type LockRow = { failed_attempts: number; locked_until: string | null };

async function readRow(): Promise<LockRow> {
  const rows = await restJson<LockRow[]>("/rest/v1/admin_security?id=eq.1&select=failed_attempts,locked_until");
  return rows[0] ?? { failed_attempts: 0, locked_until: null };
}

async function writeRow(row: LockRow): Promise<void> {
  await restJson("/rest/v1/admin_security?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ id: 1, ...row }),
  });
}

/** Minutes left on a lock, or 0 when sign-in is allowed. */
export async function minutesLocked(now = Date.now()): Promise<number> {
  const { locked_until } = await readRow();
  if (!locked_until) return 0;
  const left = Date.parse(locked_until) - now;
  return left > 0 ? Math.ceil(left / 60000) : 0;
}

/** Counts a failed attempt. The fifth failure locks sign-in for LOCK_MINUTES. */
export async function recordFailedAttempt(now = Date.now()): Promise<void> {
  const row = await readRow();
  const failures = row.failed_attempts + 1;
  if (failures >= MAX_FAILED_ATTEMPTS) {
    await writeRow({ failed_attempts: 0, locked_until: new Date(now + LOCK_MINUTES * 60000).toISOString() });
  } else {
    await writeRow({ failed_attempts: failures, locked_until: null });
  }
}

export async function clearFailedAttempts(): Promise<void> {
  await writeRow({ failed_attempts: 0, locked_until: null });
}
