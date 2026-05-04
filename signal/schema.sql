CREATE TABLE IF NOT EXISTS feedback (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  source     TEXT    NOT NULL,
  author     TEXT    NOT NULL DEFAULT 'anonymous',
  text       TEXT    NOT NULL,
  created_at TEXT    NOT NULL,
  sentiment  TEXT,
  urgency    INTEGER,
  themes     TEXT,
  processed  INTEGER NOT NULL DEFAULT 0
);
