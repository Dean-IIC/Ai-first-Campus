// Creates (or updates) the private "mou-documents" storage bucket for MoU PDFs.
// Run once per Supabase project: node --env-file=.env.local scripts/setup-mou-documents.mjs
const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const key = process.env.SUPABASE_SECRET_KEY;
if (!base || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set.");
  process.exit(1);
}
const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
const config = { public: false, file_size_limit: 10 * 1024 * 1024, allowed_mime_types: ["application/pdf"] };

const existing = await fetch(`${base}/storage/v1/bucket/mou-documents`, { headers });
const res = existing.ok
  ? await fetch(`${base}/storage/v1/bucket/mou-documents`, { method: "PUT", headers, body: JSON.stringify(config) })
  : await fetch(`${base}/storage/v1/bucket`, { method: "POST", headers, body: JSON.stringify({ id: "mou-documents", name: "mou-documents", ...config }) });
if (!res.ok) {
  console.error(`Could not set up the bucket (${res.status}): ${await res.text()}`);
  process.exit(1);
}
const check = await (await fetch(`${base}/storage/v1/bucket/mou-documents`, { headers })).json();
console.log(`mou-documents: public=${check.public}, limit=${check.file_size_limit}, types=${check.allowed_mime_types}`);
