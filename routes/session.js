const express = require('express');

module.exports = function (app) {
  let router = express.Router();

  router.get('/', (req, res) => {
    res.locals.loginPath = '/login';
    res.render('login');
  });

  router.post('/',
    app.passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

  return router;
};
