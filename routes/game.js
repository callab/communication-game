const express = require('express');

let router = express.Router();

router.get('/', (req, res) => {
  res.render('game/index');
});

router.ws('/socket', (ws, req) => {
  ws.on('message', msg => {
    ws.send(msg);
  });
});

module.exports = router;
