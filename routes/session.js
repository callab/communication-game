const express = require('express');

let router = express.Router();

router.get('/', (req, res) => {
  res.locals.loginPath = '/login';
  res.render('login');
});

router.post('/', (req, res) => {
  res.redirect('/');
});

module.exports = router;
