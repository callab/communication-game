DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    hashpwd TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_users_email ON users (email);

DROP TABLE IF EXISTS played_games;

CREATE TABLE played_games (
    id INTEGER PRIMARY KEY,
    team_score INTEGER,
    time_finished TEXT,
    messages TEXT
);

DROP TABLE IF EXISTS allowed_words;

CREATE TABLE allowed_words (
    id integer PRIMARY KEY,
    word TEXT
);

CREATE UNIQUE INDEX idx_allowed_word ON allowed_words (word);
