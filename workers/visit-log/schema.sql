-- One row per page view sent by the site beacon.
CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  vid TEXT,
  ref TEXT,
  path TEXT,
  referrer TEXT,
  ua TEXT,
  ip TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  asn INTEGER,
  as_org TEXT,
  is_bot INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS visits_ts ON visits (ts);
CREATE INDEX IF NOT EXISTS visits_vid ON visits (vid);
CREATE INDEX IF NOT EXISTS visits_ref ON visits (ref);

-- Per-person tracked links: ?r=<token> on the homepage URL.
CREATE TABLE IF NOT EXISTS links (
  token TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);
