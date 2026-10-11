# Visit log

A first-party page-view log for the homepage, so you can tell *who* opened it, not just how many people did.

The existing footer visitor map (MapMyVisitors) and Cloudflare Web Analytics only show aggregates. This worker records every page view with the network it came from and lets you hand out per-person links.

## What it records

The site beacon (`example/gatsby-browser.js`) sends one request per page view. The worker stores:

| Field | Source |
| --- | --- |
| `ref` | the `?r=<token>` of a per-person link, if the visitor arrived through one |
| `vid` | a random id kept in the visitor's `localStorage`, so later visits from the same browser are tied to the first one |
| `as_org`, `asn` | Cloudflare's lookup of the visitor IP's network owner, e.g. `Stanford University` on a campus network |
| `city`, `region`, `country`, `ip` | Cloudflare geo lookup of the visitor IP |
| `path`, `referrer`, `ua` | page, where they came from, browser |

Crawlers and headless browsers are flagged with `is_bot` and hidden by default.

## One-time setup (free tier)

```sh
cd workers/visit-log
npm install
npx wrangler login
npx wrangler d1 create visit-log          # paste the printed database_id into wrangler.toml
npm run db:init
npx wrangler secret put ADMIN_KEY         # any long random string
npm run deploy                            # prints https://visit-log.<account>.workers.dev
```

Then set `VISIT_LOG_ENDPOINT` in `example/gatsby-browser.js` to the printed URL and push.

## Daily use

- Dashboard: open the worker URL, paste the admin key. It lists tracked links with click counts and every visit, with rows highlighted when they come from a tracked link or from an org on your watch list (default `Stanford`).
- Create a link for someone (dashboard, or CLI with `VISIT_LOG_URL` and `VISIT_LOG_ADMIN_KEY` in the repo-root `.env`):

  ```sh
  node scripts/visit_log/visit_log.mjs link "Jane Doe (Stanford)" --note "COLM follow-up"
  node scripts/visit_log/visit_log.mjs links
  node scripts/visit_log/visit_log.mjs visits --since 2026-10-01 --watch Stanford,Berkeley
  ```

- Exclude your own browsers: open `https://huskydoge.github.io/?notrack=1` once on each device (`?notrack=0` turns logging back on).

## Limits

- Org names only show up when the visitor is on an institutional network or VPN. From home or a phone you see the ISP (Comcast, AT&T) and the city.
- A per-person link proves that link was opened, not by whom; a forwarded link counts too. The `?r=` part is stripped from the address bar right away so it is not copied along when they share the page.
- Email security scanners that pre-open links usually do not run JavaScript, so they do not trigger the beacon; the ones that do show up as bots or datacenter networks (Microsoft, Proofpoint).
- Visitors with strict tracker blocking may not send the beacon at all.
