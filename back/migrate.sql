CREATE TABLE IF NOT EXISTS posts (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  image_url    TEXT NOT NULL,
  excerpt      TEXT NOT NULL,
  body         TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts (published_at DESC);
