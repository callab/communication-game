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
