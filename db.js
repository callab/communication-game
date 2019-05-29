const sqlite3 = require('sqlite3');
const User = require('./models/user');

class DB {
  constructor(config) {
    this.db = new sqlite3.Database(config.filename);
  }

  findUser(id, callback) {
    this.db.get("SELECT id, email, hashpwd FROM users WHERE id = ?",
                id,
                (err, row) => {
                  if (err) {
                    console.error(err);
                    callback(err, null);
                  }
                  else if (row) {
                    let user = new User(row.id, row.email, row.hashpwd);
                    callback(null, user);
                  }
                  else {
                    callback(null, null);
                  }
                });
  }

  findUserByEmail(email, callback) {
    this.db.get("SELECT id, email, hashpwd FROM users WHERE email = ?",
                email,
                (err, row) => {
                  if (err) {
                    console.error(err);
                    callback(err, null);
                  }
                  else if (row) {
                    let user = new User(row.id, row.email, row.hashpwd);
                    callback(null, user);
                  }
                  else {
                    callback(null, null);
                  }
                });
  }

  createUser(email, hashpwd, callback) {
    this.db.run("INSERT INTO users (email, hashpwd) VALUES (?, ?)",
                [email, hashpwd],
                (err) => {
                  if (err) {
                    console.error(err);
                    callback(err, null);
                  }
                  else {
                    let id = this.lastID;
                    callback(null, new User(id, email, hashpwd));
                  }
                });
  }

  recordGame(teamScore, messages) {
    this.db.run(`INSERT INTO played_games (
                  team_score, time_finished, messages
                 ) VALUES (?, datetime('now'), ?)`,
                 [teamScore, messages.join(',')],
                 (err) => {
                   if (err) {
                     console.error(err);
                   }
                 });
  }

  close() {
    this.db.close();
  }
}

module.exports = DB;
