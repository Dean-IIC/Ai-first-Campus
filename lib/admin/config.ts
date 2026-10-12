/*
 * Settings for the single admin account. All values come from environment variables:
 *   ADMIN_EMAIL          the admin's email address
 *   ADMIN_PASSWORD_HASH  a bcrypt hash (make one with: npm run admin:hash)
 *   SESSION_SECRET       a random string of at least 32 characters
 */
export const SESSION_COOKIE = "hkbk_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // seven days, in seconds
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCK_MINUTES = 15;

export function adminConfig() {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const hash = (process.env.ADMIN_PASSWORD_HASH ?? "").trim();
  const secret = process.env.SESSION_SECRET ?? "";
  return { email, hash, secret, ready: Boolean(email && hash.startsWith("$2") && secret.length >= 32) };
}
