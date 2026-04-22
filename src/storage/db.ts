import Database from 'better-sqlite3';

let db: Database.Database | null = null;

export function initDb(dbPath: string): void {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  migrate();
}

export function getDb(): Database.Database {
  if (!db) throw new Error('Database not initialized. Run vibe-check init first.');
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

function migrate(): void {
  const d = getDb();
  d.exec(`
    CREATE TABLE IF NOT EXISTS pet (
      id              TEXT PRIMARY KEY DEFAULT 'main',
      species         TEXT NOT NULL,
      name            TEXT NOT NULL,
      stage           INTEGER DEFAULT 1,
      evo_variant     TEXT,
      hp              INTEGER DEFAULT 100,
      xp              INTEGER DEFAULT 0,
      level           INTEGER DEFAULT 1,
      coins           INTEGER DEFAULT 0,
      streak          INTEGER DEFAULT 0,
      longest_streak  INTEGER DEFAULT 0,
      last_commit_date TEXT,
      mood            TEXT DEFAULT 'happy',
      created_at      TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS commits (
      hash            TEXT PRIMARY KEY,
      timestamp       INTEGER NOT NULL,
      message         TEXT,
      ai_detected     BOOLEAN DEFAULT 0,
      files           TEXT,
      lines_added     INTEGER,
      lines_deleted   INTEGER,
      has_tests       BOOLEAN DEFAULT 0,
      has_plans       BOOLEAN DEFAULT 0,
      think_score     INTEGER,
      test_score      INTEGER,
      verify_score    INTEGER,
      overall_score   INTEGER,
      xp_earned       INTEGER,
      hp_change       INTEGER
    );
    CREATE TABLE IF NOT EXISTS daily_summary (
      date            TEXT PRIMARY KEY,
      avg_score       REAL,
      commit_count    INTEGER,
      quests_completed INTEGER,
      xp_earned       INTEGER
    );
    CREATE TABLE IF NOT EXISTS achievements (
      id              TEXT PRIMARY KEY,
      unlocked_at     TEXT,
      progress        INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS quests (
      date            TEXT,
      quest_id        TEXT,
      completed       BOOLEAN DEFAULT 0,
      progress        INTEGER DEFAULT 0,
      PRIMARY KEY (date, quest_id)
    );
  `);
}
