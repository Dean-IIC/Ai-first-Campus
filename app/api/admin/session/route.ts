import { isAdminSession } from "@/lib/admin/session";

/** Tells the browser whether the visitor is the signed-in admin. Visitors get { admin: false }. */
export async function GET() {
  const admin = await isAdminSession();
  return Response.json({ admin }, { headers: { "Cache-Control": "no-store" } });
}
