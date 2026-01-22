-- Authentication Migration
-- Users table for email/password authentication

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX idx_users_email ON users(email);

-- Add user_id to matches table
ALTER TABLE matches ADD COLUMN user_id INTEGER REFERENCES users(id);
CREATE INDEX idx_matches_user_id ON matches(user_id);
