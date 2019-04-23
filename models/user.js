class User {
  constructor(id, email, hashpwd) {
    this.id = id;
    this.email = email;
    this.hashpwd = hashpwd;
  }

  doesMatchPassword(password) {
    return this.hashpwd === password;
  }
}

module.exports = User;
