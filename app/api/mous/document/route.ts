import { isAdminSession } from "@/lib/admin/session";
import { serviceBase, serviceFetch } from "@/lib/admin/service";
import { getList } from "@/lib/content";
import { MOU_DOCUMENT_BUCKET, MOU_DOCUMENT_PATH } from "@/lib/mous";

/**
 * Opens an MoU's uploaded document through a two-minute signed link. Visitors get it only when the
 * admin ticked "Show download link to visitors"; the signed-in admin always does.
 */
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  const notFound = () => new Response("This document is not available.", { status: 404, headers: { "Cache-Control": "no-store" } });
  try {
    const mou = (await getList("mous")).find((m) => m.slug === slug);
    const path = mou?.document_path ?? "";
    if (!mou || !MOU_DOCUMENT_PATH.test(path)) return notFound();
    if (!mou.document_public && !(await isAdminSession())) return notFound();
    const res = await serviceFetch(`/storage/v1/object/sign/${MOU_DOCUMENT_BUCKET}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 120 }),
    });
    if (!res.ok) return notFound();
    const { signedURL } = (await res.json()) as { signedURL?: string };
    if (!signedURL) return notFound();
    return new Response(null, { status: 302, headers: { Location: `${serviceBase()}/storage/v1${signedURL}`, "Cache-Control": "no-store" } });
  } catch {
    return new Response("The document could not be opened. Try again later.", { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
