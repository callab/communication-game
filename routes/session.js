const express = require('express');

let router = express.Router();

router.get('/', (req, res) => {
  res.locals.loginPath = '/login';
  res.render('login');
});

module.exports = router;
