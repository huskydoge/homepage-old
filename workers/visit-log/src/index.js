/** Cloudflare Worker that logs homepage page views and serves a private dashboard. */
import DASHBOARD_HTML from './dashboard.html';

const BOT_UA = /bot|crawl|spider|slurp|headless|preview|scanner|lighthouse|python-requests|curl|wget|facebookexternalhit|embedly|quora link|outbrain|pinterest|vkshare|w3c_validator/i;
const MAX_FIELD = 512;

/** Trim a client-supplied value to a bounded string, or null. */
const clip = (value, max = MAX_FIELD) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return String(value).slice(0, max);
};

/** Build CORS headers for an allowed origin. */
const corsHeaders = (request, env) => {
  const origin = request.headers.get('Origin');
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((item) => item.trim());
  if (!origin || !allowed.includes(origin)) {
    return {};
  }
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
};

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

/** Constant-time-ish comparison of the bearer key against ADMIN_KEY. */
const isAdmin = (request, env) => {
  const expected = env.ADMIN_KEY;
  const header = request.headers.get('Authorization') || '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!expected || given.length !== expected.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  }
  return diff === 0;
};

/** Short URL-safe random token for a tracked link. */
const newToken = () => {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(7));
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
};

/** Record one beacon. Always answers 204 so the site never sees errors. */
async function handleBeacon(request, env) {
  const headers = corsHeaders(request, env);
  if (!headers['Access-Control-Allow-Origin']) {
    return new Response(null, { status: 204 });
  }

  let body = {};
  try {
    body = JSON.parse(await request.text());
  } catch (error) {
    return new Response(null, { status: 204, headers });
  }

  const cf = request.cf || {};
  const ua = request.headers.get('User-Agent') || '';
  await env.DB.prepare(
    `INSERT INTO visits (ts, vid, ref, path, referrer, ua, ip, country, region, city, asn, as_org, is_bot)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    new Date().toISOString(),
    clip(body.vid, 64),
    clip(body.ref, 64),
    clip(body.path),
    clip(body.referrer),
    clip(ua),
    request.headers.get('CF-Connecting-IP'),
    cf.country || null,
    cf.region || null,
    cf.city || null,
    cf.asn || null,
    cf.asOrganization || null,
    BOT_UA.test(ua) ? 1 : 0,
  ).run();

  return new Response(null, { status: 204, headers });
}

/** Return recent visits, each tagged with the person its visitor id was linked to. */
async function listVisits(url, env) {
  const limit = Math.min(Number(url.searchParams.get('limit')) || 500, 5000);
  const since = url.searchParams.get('since') || '1970-01-01';
  const { results } = await env.DB.prepare(
    `WITH attributed AS (
       SELECT v.vid, MIN(v.ref) AS ref
       FROM visits v JOIN links l ON l.token = v.ref
       WHERE v.vid IS NOT NULL
       GROUP BY v.vid
     )
     SELECT v.*, COALESCE(v.ref, a.ref) AS person_ref, l.label AS person, l.note AS person_note
     FROM visits v
     LEFT JOIN attributed a ON a.vid = v.vid
     LEFT JOIN links l ON l.token = COALESCE(v.ref, a.ref)
     WHERE v.ts >= ?
     ORDER BY v.ts DESC
     LIMIT ?`,
  ).bind(since, limit).all();
  return json({ visits: results });
}

async function listLinks(env) {
  const { results } = await env.DB.prepare(
    `SELECT l.*, COUNT(v.id) AS clicks, MIN(v.ts) AS first_click, MAX(v.ts) AS last_click
     FROM links l LEFT JOIN visits v ON v.ref = l.token AND v.is_bot = 0
     GROUP BY l.token ORDER BY l.created_at DESC`,
  ).all();
  return json({ links: results });
}

async function createLink(request, env) {
  const body = await request.json().catch(() => ({}));
  const label = clip(body.label, 200);
  if (!label) {
    return json({ error: 'label is required' }, 400);
  }
  const token = newToken();
  await env.DB.prepare('INSERT INTO links (token, label, note, created_at) VALUES (?, ?, ?, ?)')
    .bind(token, label, clip(body.note, 500), new Date().toISOString())
    .run();
  return json({ token, label });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/v') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders(request, env) });
      }
      if (request.method === 'POST') {
        return handleBeacon(request, env);
      }
    }

    if (url.pathname === '/' || url.pathname === '/admin') {
      return new Response(DASHBOARD_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }

    if (url.pathname.startsWith('/admin/')) {
      if (!isAdmin(request, env)) {
        return json({ error: 'unauthorized' }, 401);
      }
      if (url.pathname === '/admin/visits' && request.method === 'GET') {
        return listVisits(url, env);
      }
      if (url.pathname === '/admin/links' && request.method === 'GET') {
        return listLinks(env);
      }
      if (url.pathname === '/admin/links' && request.method === 'POST') {
        return createLink(request, env);
      }
    }

    return json({ error: 'not found' }, 404);
  },
};
