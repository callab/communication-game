const sqlite3 = require('sqlite3');
const User = require('./models/user');

class DB {
  constructor(config) {
    this.db = new sqlite3.Database(config.filename);
  }

  findUser(id, callback = null) {
    this.db.get("SELECT id, email, hashpwd FROM users WHERE id = ?",
                id,
                (err, row) => {
                  if (err) {
                    console.error(err);
                  }
                  else if (callback != null) {
                    if (row) {
                      let user = new User(row.id, row.email, row.hashpwd);
                      callback(user);
                    }
                    else {
                      callback(null);
                    }
                  }
                });
  }

  createUser(email, hashpwd, callback = null) {
    this.db.run("INSERT INTO users (email, hashpwd) VALUES (?, ?)",
                [email, hashpwd],
                (err) => {
                  if (err) {
                    console.error(err);
                  }
                  else if (callback != null) {
                    let id = this.lastID;
                    callback(new User(id, email, hashpwd));
                  }
                });
  }

  close() {
    this.db.close();
  }
}

module.exports = DB;
