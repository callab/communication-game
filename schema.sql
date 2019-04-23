DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    hashpwd TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_users_email ON users (email);
