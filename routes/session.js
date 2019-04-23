const express = require('express');

module.exports = function (app) {
  let router = express.Router();

  router.get('/', (req, res) => {
    res.locals.loginPath = '/login';
    res.render('login');
  });

  router.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    app.db.createUser(username, password, (user) => {
      req.flash('info', `Successfully logged in as ${user.email}`);
      res.redirect('/');
    });
  });

  return router;
};
