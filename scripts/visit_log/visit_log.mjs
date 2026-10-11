#!/usr/bin/env node
/**
 * Command-line client for the visit log worker (workers/visit-log).
 *
 *   node scripts/visit_log/visit_log.mjs link "Jane Doe (Stanford)" --note "COLM chat"
 *   node scripts/visit_log/visit_log.mjs links
 *   node scripts/visit_log/visit_log.mjs visits --since 2026-10-01 --watch Stanford,Berkeley
 *
 * Reads VISIT_LOG_URL and VISIT_LOG_ADMIN_KEY from the environment or the repo-root .env.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://huskydoge.github.io/';

/** Load KEY=VALUE lines from the repo-root .env without overriding real env vars. */
const loadDotEnv = () => {
  const path = resolve(dirname(fileURLToPath(import.meta.url)), '../../.env');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
};

/** Split argv into positionals and --flag values. */
const parseArgs = (argv) => {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      flags[argv[i].slice(2)] = argv[i + 1];
      i++;
    } else {
      positional.push(argv[i]);
    }
  }
  return { flags, positional };
};

const api = async (path, options = {}) => {
  const base = process.env.VISIT_LOG_URL;
  const key = process.env.VISIT_LOG_ADMIN_KEY;
  if (!base || !key) {
    throw new Error('Set VISIT_LOG_URL and VISIT_LOG_ADMIN_KEY (env or .env).');
  }
  const res = await fetch(`${base.replace(/\/$/, '')}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
};

const place = (v) => [v.city, v.region, v.country].filter(Boolean).join(', ');

const commands = {
  async link({ positional, flags }) {
    const label = positional[0];
    if (!label) throw new Error('Usage: link "<name>" [--note "<note>"]');
    const { token } = await api('/admin/links', {
      method: 'POST',
      body: JSON.stringify({ label, note: flags.note }),
    });
    console.log(`${SITE}?r=${token}`);
  },

  async links() {
    const { links } = await api('/admin/links');
    console.table(links.map((l) => ({
      person: l.label, link: `${SITE}?r=${l.token}`, clicks: l.clicks, last: l.last_click || '',
    })));
  },

  async visits({ flags }) {
    const since = flags.since || new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
    const watch = (flags.watch || '').split(',').map((w) => w.trim().toLowerCase()).filter(Boolean);
    const { visits } = await api(`/admin/visits?since=${encodeURIComponent(since)}&limit=5000`);
    const rows = visits
      .filter((v) => !v.is_bot)
      .filter((v) => !watch.length || v.person || watch.some((w) => (v.as_org || '').toLowerCase().includes(w)))
      .map((v) => ({
        time: v.ts.slice(0, 16).replace('T', ' '),
        person: v.person || '',
        org: v.as_org || '',
        place: place(v),
        path: v.path || '',
        visitor: (v.vid || '').slice(0, 8),
      }));
    console.table(rows);
  },
};

loadDotEnv();
const [command, ...rest] = process.argv.slice(2);
if (!commands[command]) {
  console.error('Commands: link, links, visits');
  process.exit(1);
}
commands[command](parseArgs(rest)).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
