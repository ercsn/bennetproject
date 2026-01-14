-- Minecraft PvP Stats Database Schema

DROP TABLE IF EXISTS matches;

CREATE TABLE matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    opponent_name TEXT NOT NULL,
    result TEXT NOT NULL CHECK(result IN ('win', 'loss', 'inconclusive')),
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Create index for faster queries by timestamp
CREATE INDEX idx_matches_timestamp ON matches(timestamp DESC);
CREATE INDEX idx_matches_result ON matches(result);

-- Insert some sample data for testing
INSERT INTO matches (timestamp, opponent_name, result, notes) VALUES
    (datetime('now', '-5 days'), 'ShadowNinja', 'win', 'Great fight in the arena'),
    (datetime('now', '-4 days'), 'DragonSlayer99', 'loss', 'Got ambushed'),
    (datetime('now', '-3 days'), 'ShadowNinja', 'win', 'Revenge match'),
    (datetime('now', '-2 days'), 'CreeperKing', 'win', 'Quick victory'),
    (datetime('now', '-1 days'), 'EnderMaster', 'inconclusive', 'Server crashed'),
    (datetime('now', '-12 hours'), 'DragonSlayer99', 'win', 'Better strategy this time'),
    (datetime('now', '-6 hours'), 'PvPPro123', 'loss', 'Tough opponent'),
    (datetime('now', '-2 hours'), 'ShadowNinja', 'win', 'Third victory!');
