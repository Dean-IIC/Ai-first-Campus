import { revalidatePath } from "next/cache";

/**
 * Refreshes every page after content changes in Supabase.
 * Call it from a Supabase Database Webhook (see docs/DEPLOYMENT.md):
 *   POST /api/revalidate  with header  x-revalidate-secret: <REVALIDATE_SECRET>
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ revalidated: false, message: "Missing or wrong secret." }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, at: new Date().toISOString() });
}
