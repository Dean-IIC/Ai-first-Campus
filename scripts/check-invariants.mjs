// Verifies the automatable invariants in docs/invariants.md.
// Usage: npm run check:invariants   (exits with code 1 if any check fails)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const walk = (dir, exts) =>
  fs.existsSync(path.join(root, dir))
    ? fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((d) => {
        const p = path.join(dir, d.name);
        if (d.isDirectory()) return d.name === "node_modules" || d.name === ".next" ? [] : walk(p, exts);
        return exts.some((e) => d.name.endsWith(e)) ? [p] : [];
      })
    : [];

const results = [];
const check = (id, title, fn) => {
  try {
    const problems = fn() ?? [];
    results.push({ id, title, ok: problems.length === 0, problems });
  } catch (err) {
    results.push({ id, title, ok: false, problems: [`check crashed: ${err.message}`] });
  }
};

const codeFiles = [...walk("app", [".tsx", ".ts"]), ...walk("components", [".tsx", ".ts"])];
const migrationFiles = walk("supabase/migrations", [".sql"]).sort();
const migrations = migrationFiles.map(read).join("\n");
const tables = [...migrations.matchAll(/create table if not exists public\.([a-z_]+)/g)].map((m) => m[1]);

check("INV-01", "Every public table has row-level security enabled", () => {
  const enabled = new Set([...migrations.matchAll(/alter table public\.([a-z_]+) enable row level security/g)].map((m) => m[1]));
  for (const block of migrations.match(/do \$\$[\s\S]*?end \$\$;/g) ?? []) {
    if (!block.includes("enable row level security")) continue;
    for (const arr of block.match(/array\[([\s\S]*?)\]/g) ?? []) for (const t of arr.match(/'([a-z_]+)'/g) ?? []) enabled.add(t.slice(1, -1));
  }
  return tables.filter((t) => !enabled.has(t)).map((t) => `table ${t} has no "enable row level security"`);
});

check("INV-02", "Enquiries can be inserted but never read through the public API", () => {
  const p = [];
  if (!/create policy "Anyone can submit an enquiry"\s+on public\.enquiries\s+for insert/i.test(migrations)) p.push("insert policy for enquiries is missing");
  if (/on public\.enquiries\s+for (select|update|delete|all)/i.test(migrations)) p.push("enquiries has a select/update/delete policy");
  return p;
});

check("INV-03", "The Supabase secret key is only read by scripts/ and lib/admin/service.ts (server-only)", () => {
  const allowed = ["lib/admin/service.ts"];
  const files = [...codeFiles, ...walk("lib", [".ts", ".tsx"]), ...walk("actions", [".ts"]), ...walk("app", [".ts", ".tsx"])];
  return files
    .map((f) => f.split(path.sep).join("/"))
    .filter((f) => !allowed.includes(f) && /SUPABASE_SECRET_KEY|SUPABASE_SERVICE_ROLE_KEY/.test(read(f)))
    .map((f) => `${f} references the secret key`);
});

check("INV-15", "Every saved-content write goes through the admin check", () => {
  const p = [];
  const actions = read("actions/admin.ts");
  for (const fn of ["saveValueAction", "undoAction", "restoreAction", "historyAction"]) {
    const body = actions.slice(actions.indexOf(`export async function ${fn}`), actions.indexOf(`export async function ${fn}`) + 400);
    if (!/isAdminSession\(\)/.test(body)) p.push(`${fn} does not check the admin session`);
  }
  const upload = read("app/api/admin/upload/route.ts");
  if (!/isAdminSession\(\)/.test(upload)) p.push("the upload route does not check the admin session");
  return p;
});

check("INV-04", "No component or page is longer than 150 lines", () =>
  codeFiles
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => [f, read(f).split("\n").length])
    .filter(([, n]) => n > 150)
    .map(([f, n]) => `${f} has ${n} lines`),
);

check("INV-05", "No hard-coded hex colours in components and pages", () => {
  const allow = ["app/global-error.tsx", "app/layout.tsx", "components/features/infographics/donut-chart.tsx"];
  return codeFiles
    .filter((f) => !allow.includes(f.split(path.sep).join("/")))
    .flatMap((f) => (read(f).match(/["'`\s(]#[0-9a-fA-F]{6}\b/g) ?? []).map((m) => `${f}: ${m.trim()}`));
});

check("INV-06", "Surfaces use theme tokens (no bg-white except approved image backings)", () => {
  const allow = ["components/features/layout/footer-brand.tsx", "components/features/mous/mou-card.tsx", "components/features/initiatives/quantum-section.tsx", "app/admin/login/page.tsx", "components/features/navigation/mobile-menu-panel.tsx"];
  return codeFiles
    .filter((f) => !allow.includes(f.split(path.sep).join("/")))
    .filter((f) => /(?<=[\s"'`:])bg-white(?![\w/-])/.test(read(f)))
    .map((f) => `${f} uses bg-white`);
});

check("INV-07", "Client components export no plain values that server code could import", () =>
  [...codeFiles, ...walk("lib", [".ts", ".tsx"])]
    .filter((f) => /^["']use client["']/.test(read(f)))
    .flatMap((f) => (read(f).match(/^export const [a-z]\w*/gm) ?? []).map((m) => `${f}: ${m}`)),
);

check("INV-08", "Every content data file maps to a table, and slugs are unique", () => {
  const p = [];
  for (const f of walk("content/data", [".json"])) {
    const table = path.basename(f, ".json");
    if (!tables.includes(table)) p.push(`${f} has no matching table`);
    const rows = JSON.parse(read(f));
    const slugs = rows.map((r) => r.slug);
    const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    if (dup.length) p.push(`${f} has duplicate slugs: ${[...new Set(dup)].join(", ")}`);
    if (rows.some((r) => !r.slug)) p.push(`${f} has a row without a slug`);
  }
  return p;
});

check("INV-09", "Generated database types cover every table", () => {
  const types = read("lib/database.types.ts");
  return tables.filter((t) => !new RegExp(`\\n\\s+${t}: \\{\\n\\s+Row:`).test(types)).map((t) => `lib/database.types.ts is missing ${t}`);
});

check("INV-10", "Calculated key figures are left empty in the data", () => {
  const rows = JSON.parse(read("content/data/key_figures.json"));
  return rows
    .filter((r) => ["years-of-excellence", "ai-faculty-champions", "ai-student-ambassadors"].includes(r.slug) && r.value !== null)
    .map((r) => `${r.slug} must have value null (it is calculated)`);
});

check("INV-11", "A centre or initiative is Live only when it has a web address", () =>
  JSON.parse(read("content/data/portals.json"))
    .filter((r) => r.status === "Live" && !/^https?:\/\//.test(r.url ?? ""))
    .map((r) => `${r.slug} is Live without a valid url`),
);

check("INV-12", "supabase/setup_all.sql matches the migrations and content", () => {
  const fresh = execFileSync(process.execPath, ["scripts/build-setup-sql.mjs"], { cwd: root, encoding: "utf8" });
  return fresh === read("supabase/setup_all.sql") ? [] : ["setup_all.sql is out of date: run npm run db:sql"];
});

check("INV-13", "The menu is defined once, in lib/menu.ts", () =>
  [...codeFiles].filter((f) => /label: "Centre of Excellence"|label: "Quantum Ready Campus"/.test(read(f))).map((f) => `${f} defines menu items`),
);

check("INV-14", "AI Faculty Champions: one person per slot (1 to 15), shipped photo files exist", () => {
  const p = [];
  const size = Number((read("lib/site.ts").match(/facultyChampions:\s*(\d+)/) ?? [])[1]);
  if (!size) p.push("lib/site.ts must set facultyChampions to a number");
  const rows = JSON.parse(read("content/data/ai_people.json")).filter((r) => r.role === "Faculty champion");
  const seen = new Set();
  for (const r of rows) {
    if (!Number.isInteger(r.sort_order) || r.sort_order < 1 || r.sort_order > size) p.push(`${r.slug}: slot ${r.sort_order} is outside 1 to ${size}`);
    if (seen.has(r.sort_order)) p.push(`slot ${r.sort_order} has more than one faculty champion`);
    seen.add(r.sort_order);
    if (r.photo_url && !/^\/images\/champions\/[a-z0-9][a-z0-9._-]*\.(jpe?g|png|webp)$/i.test(r.photo_url)) p.push(`${r.slug}: photo must be /images/champions/<file>`);
    if (r.photo_url && !fs.existsSync(path.join(root, "public", r.photo_url))) p.push(`${r.slug}: ${r.photo_url} is missing`);
  }
  return p;
});

const failed = results.filter((r) => !r.ok);
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.id}  ${r.title}`);
  for (const p of r.problems) console.log(`        - ${p}`);
}
console.log(`\n${results.length - failed.length}/${results.length} invariants pass.`);
process.exit(failed.length ? 1 : 0);
