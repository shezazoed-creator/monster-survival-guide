-- Comments table — one row per comment.
--
-- post_slug: the entry's URL slug (e.g. "wendigo"). Indexed for fast list reads.
-- approved: 1 = visible, 0 = pending moderation. Default 1 for now (open posting);
--           set the COMMENTS_REQUIRE_APPROVAL env var to flip the default later.
-- ip_hash: SHA-256 of the submitter's IP, kept for rate limiting + abuse triage.
--          Never the raw IP — we don't want to store that.
CREATE TABLE IF NOT EXISTS comments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug   TEXT NOT NULL,
  author      TEXT NOT NULL,
  body        TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  approved    INTEGER NOT NULL DEFAULT 1,
  ip_hash     TEXT
);

CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments (post_slug, created_at);
CREATE INDEX IF NOT EXISTS idx_comments_ip_hash ON comments (ip_hash, created_at);
