// A small stand-in for the parts of Supabase the admin code uses: PostgREST tables
// (site_content, site_history, admin_security) and Storage (site-images). It follows
// PostgREST's reply codes, so the tests catch the same empty-body problems the real service would.
import http from "node:http";

const PORT = Number(process.env.MOCK_PORT || 54399);
const content = new Map();
const history = [];
const security = new Map();
const files = new Map();
let seq = 1;

const send = (res, status, body) => {
  if (body === undefined) {
    res.writeHead(status);
    return res.end();
  }
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};
const readBody = async (req) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
};
const eq = (v) => (v && v.startsWith("eq.") ? decodeURIComponent(v.slice(3)) : null);
const inList = (v) => {
  const m = /^in\.\((.*)\)$/.exec(v || "");
  return m ? m[1].split(",").map(Number) : null;
};
const pick = (row, select) => {
  if (!select || select === "*") return { ...row };
  const o = {};
  for (const c of select.split(",")) o[c] = row[c];
  return o;
};
const minimal = (req) => /return=minimal/.test(req.headers.prefer || "");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;
  const q = Object.fromEntries(url.searchParams);
  const pub = "/storage/v1/object/public/site-images/";
  const up = "/storage/v1/object/site-images/";

  if (p.startsWith(pub) && req.method === "GET") {
    const f = files.get(p.slice(pub.length));
    if (!f) return send(res, 404, { error: "not found" });
    res.writeHead(200, { "Content-Type": f.type });
    return res.end(f.bytes);
  }
  if (p.startsWith(up) && req.method === "POST") {
    const name = p.slice(up.length);
    if (files.has(name)) return send(res, 400, { error: "exists" });
    files.set(name, { bytes: await readBody(req), type: req.headers["content-type"] || "application/octet-stream" });
    return send(res, 200, { Key: `site-images/${name}` });
  }

  if (p === "/rest/v1/site_content") {
    if (req.method === "GET") {
      const k = eq(q.key);
      const rows = [...content.values()].filter((r) => (k ? r.key === k : true)).map((r) => pick(r, q.select));
      return send(res, 200, rows);
    }
    if (req.method === "POST") {
      const body = JSON.parse((await readBody(req)).toString() || "{}");
      for (const r of Array.isArray(body) ? body : [body]) {
        const prev = content.get(r.key);
        content.set(r.key, { key: r.key, value: r.value, updated_at: new Date().toISOString(), created: prev ? prev.created : new Date().toISOString() });
      }
      return minimal(req) ? send(res, 201) : send(res, 201, []);
    }
    if (req.method === "DELETE") {
      const k = eq(q.key);
      if (k) content.delete(k);
      return send(res, 204);
    }
  }

  if (p === "/rest/v1/site_history") {
    if (req.method === "GET") {
      let rows = [...history];
      const id = eq(q.id);
      const ids = inList(q.id);
      if (id) rows = rows.filter((r) => r.id === Number(id));
      if (ids) rows = rows.filter((r) => ids.includes(r.id));
      if (q.order && q.order.startsWith("id.desc")) rows.sort((a, b) => b.id - a.id);
      const off = Number(q.offset || 0);
      const lim = q.limit !== undefined ? Number(q.limit) : rows.length;
      return send(res, 200, rows.slice(off, off + lim).map((r) => pick(r, q.select)));
    }
    if (req.method === "POST") {
      const body = JSON.parse((await readBody(req)).toString() || "{}");
      history.push({ id: seq++, created_at: new Date().toISOString(), ...body });
      return minimal(req) ? send(res, 201) : send(res, 201, []);
    }
    if (req.method === "DELETE") {
      const id = eq(q.id);
      const ids = inList(q.id);
      for (let i = history.length - 1; i >= 0; i--) {
        if ((id && history[i].id === Number(id)) || (ids && ids.includes(history[i].id))) history.splice(i, 1);
      }
      return send(res, 204);
    }
  }

  if (p === "/rest/v1/admin_security") {
    if (req.method === "GET") {
      const id = Number(eq(q.id) ?? 1);
      const row = security.get(id);
      return send(res, 200, row ? [pick({ id, ...row }, q.select)] : []);
    }
    if (req.method === "POST") {
      const body = JSON.parse((await readBody(req)).toString() || "{}");
      security.set(Number(body.id), { failed_attempts: body.failed_attempts, locked_until: body.locked_until ?? null });
      return minimal(req) ? send(res, 201) : send(res, 201, []);
    }
    if (req.method === "DELETE") {
      security.delete(Number(eq(q.id) ?? 1));
      return send(res, 204);
    }
  }

  return send(res, 404, { message: `mock has no route for ${req.method} ${req.url}` });
});

server.listen(PORT, "127.0.0.1", () => console.log(`mock supabase on ${PORT}`));
