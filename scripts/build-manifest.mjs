// Generates docs/manifest.md and manifest.json: an inventory of the project
// built from the actual files. Usage: npm run docs:manifest
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const walk = (dir, exts) =>
  fs.existsSync(path.join(root, dir))
    ? fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((d) => {
        const p = path.join(dir, d.name).split(path.sep).join("/");
        if (d.isDirectory()) return walk(p, exts);
        return exts.some((e) => d.name.endsWith(e)) ? [p] : [];
      })
    : [];
const doc = (src) => {
  const m = src.match(/\/\*\*\s*\n?\s*\*?\s*([^\n*][^\n]*)/);
  return m ? m[1].replace(/\*\/\s*$/, "").trim() : "";
};
const lines = (src) => src.split("\n").length;
const pkg = JSON.parse(read("package.json"));

const routeFiles = walk("app", [".tsx", ".ts"]).filter((f) => /\/(page\.tsx|route\.ts)$/.test(f));
const routes = routeFiles
  .map((f) => {
    const src = read(f);
    const route = "/" + f.replace(/^app\//, "").replace(/\/?(page\.tsx|route\.ts)$/, "");
    const tables = [...new Set([...src.matchAll(/getList\("([a-z_]+)"\)/g)].map((m) => m[1]))];
    const pages = [...new Set([...src.matchAll(/(?:slug="|getPage\(")([a-z-]+)"/g)].map((m) => m[1]))];
    return {
      route: route === "/" ? "/" : route.replace(/\/$/, ""),
      file: f,
      kind: f.endsWith("route.ts") ? "API" : /\[[a-z]+\]/.test(f) ? "Dynamic (pre-rendered)" : "Static",
      revalidate: (src.match(/export const revalidate = (\d+)/) ?? [])[1] ?? null,
      data: [...tables.map((t) => `table:${t}`), ...pages.map((p) => `page:${p}`)],
    };
  })
  .sort((a, b) => a.route.localeCompare(b.route));

const components = walk("components", [".tsx", ".ts"]).map((f) => {
  const src = read(f);
  return { file: f, lines: lines(src), client: /^["']use client["']/.test(src), summary: doc(src) };
});
const libs = [...walk("lib", [".ts", ".tsx"]), ...walk("actions", [".ts"]), ...walk("scripts", [".mjs"])].map((f) => {
  const src = read(f);
  return { file: f, lines: lines(src), summary: doc(src) || (src.match(/^\/\/ ?(.+)$/m) ?? [])[1] || "" };
});
const migrationFiles = walk("supabase/migrations", [".sql"]).sort();
const migrations = migrationFiles.map(read).join("\n");
const tables = [...migrations.matchAll(/create table if not exists public\.([a-z_]+)/g)].map((m) => m[1]);
const typesSrc = read("lib/database.types.ts");
const tableColumns = Object.fromEntries(
  tables.map((t) => {
    const m = typesSrc.match(new RegExp(`\\n\\s+${t}: \\{\\n\\s+Row: \\{([\\s\\S]*?)\\n\\s+\\}`));
    const cols = m ? [...m[1].matchAll(/\n\s+([a-z_]+):/g)].map((x) => x[1]) : [];
    return [t, cols];
  }),
);
const content = {
  pages: walk("content/pages", [".md"]).length,
  messages: walk("content/messages", [".md"]).length,
  data: Object.fromEntries(walk("content/data", [".json"]).map((f) => [path.basename(f, ".json"), JSON.parse(read(f)).length])),
};
const envVars = [...read(".env.example").matchAll(/^#?\s*([A-Z_]+)=/gm)].map((m) => m[1]);
const docs = [...walk("docs", [".md"]), "README.md", "AGENTS.md"].filter((f) => fs.existsSync(path.join(root, f)));

const manifest = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  generated: new Date().toISOString().slice(0, 10),
  stack: {
    next: pkg.dependencies.next,
    react: pkg.dependencies.react,
    typescript: pkg.devDependencies.typescript,
    tailwindcss: pkg.devDependencies.tailwindcss,
    "@supabase/supabase-js": pkg.dependencies["@supabase/supabase-js"],
    "@supabase/ssr": pkg.dependencies["@supabase/ssr"],
    "next-themes": pkg.dependencies["next-themes"],
  },
  scripts: pkg.scripts,
  env: envVars,
  routes,
  components,
  modules: libs,
  database: { migrations: migrationFiles, tables: tableColumns },
  content,
  docs,
};
fs.writeFileSync(path.join(root, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

const t = (rows, head) => [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
const md = `# Manifest

Inventory of the HKBK College of Engineering website, generated from the source files by \`npm run docs:manifest\` on ${manifest.generated}. Do not edit by hand. A machine-readable copy is in \`manifest.json\`.

## Project

| Item | Value |
| --- | --- |
| Package | \`${manifest.name}\` version ${manifest.version} |
| Description | ${manifest.description} |
${Object.entries(manifest.stack).map(([k, v]) => `| ${k} | ${v} |`).join("\n")}

## Routes (${routes.length})

Components used by a route may load more data (for example the home page sections); see the components table.

${t(routes.map((r) => [`\`${r.route}\``, r.kind, r.revalidate ? `${r.revalidate}s` : "-", r.data.length ? r.data.map((d) => `\`${d}\``).join(", ") : "-", `\`${r.file}\``]), ["Route", "Type", "Revalidate", "Data read in the route file", "File"])}

Also: \`app/layout.tsx\` (root layout), \`app/error.tsx\`, \`app/global-error.tsx\`, \`app/loading.tsx\`, \`app/not-found.tsx\`, \`app/sitemap.ts\`, \`app/robots.ts\`.

## Components (${components.length} files)

${t(components.map((c) => [`\`${c.file}\``, String(c.lines), c.client ? "Client" : "Server", c.summary || "-"]), ["File", "Lines", "Runs on", "Purpose"])}

## Modules, actions and scripts (${libs.length})

${t(libs.map((l) => [`\`${l.file}\``, String(l.lines), l.summary || "-"]), ["File", "Lines", "Purpose"])}

## Database

Migrations, applied in order:

${migrationFiles.map((m) => `- \`${m}\``).join("\n")}

${t(Object.entries(tableColumns).map(([k, v]) => [`\`${k}\``, String(v.length), v.map((c) => `\`${c}\``).join(", ")]), ["Table", "Columns", "Column names"])}

## Content

- Pages (\`content/pages\`): ${content.pages}
- Messages (\`content/messages\`): ${content.messages}
${Object.entries(content.data).map(([k, v]) => `- \`content/data/${k}.json\`: ${v} row(s)`).join("\n")}

## Environment variables

${envVars.map((e) => `- \`${e}\``).join("\n")}

## npm scripts

${t(Object.entries(pkg.scripts).map(([k, v]) => [`\`npm run ${k}\``, `\`${v.replace(/\|/g, "\\|")}\``]), ["Command", "Runs"])}

## Documentation

${docs.map((d) => `- \`${d}\``).join("\n")}
`;
fs.writeFileSync(path.join(root, "docs", "manifest.md"), md);
console.log(`Wrote docs/manifest.md and manifest.json (${routes.length} routes, ${components.length} components, ${tables.length} tables).`);
