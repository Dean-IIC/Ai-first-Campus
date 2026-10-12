import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { adminConfig, SESSION_COOKIE, SESSION_MAX_AGE } from "./config";

/*
 * The admin session is a signed value: a small payload (who, and when it ends) plus an
 * HMAC signature made with SESSION_SECRET and the password hash. Nothing is stored on the
 * server, so a session ends when the cookie expires (seven days), when the admin signs out,
 * or when the password (or SESSION_SECRET) is changed.
 */
const sign = (payload: string, secret: string) => createHmac("sha256", secret).update(payload).digest("base64url");

export function createSessionValue(secret: string, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ sub: "admin", exp: now + SESSION_MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function isValidSessionValue(value: string | undefined, secret: string, now = Date.now()): boolean {
  if (!value || !secret) return false;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return false;
  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: unknown; exp?: unknown };
    return data.sub === "admin" && typeof data.exp === "number" && data.exp > now;
  } catch {
    return false;
  }
}

/** The signing key: the session secret plus the password hash, so a new password ends all sessions. */
function signingKey(): string {
  const cfg = adminConfig();
  return cfg.ready ? `${cfg.secret}.${cfg.hash}` : "";
}

export async function isAdminSession(): Promise<boolean> {
  const jar = await cookies();
  return isValidSessionValue(jar.get(SESSION_COOKIE)?.value, signingKey());
}

export async function startAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionValue(signingKey()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
