const express = require('express');
const Player = require('../lib/player');
const Game = require('../lib/game');

const WS_OPEN = 1;

let router = express.Router();

let clients = [];

function handleClient(ws) {
  console.log('Websocket now open.');
  ws.send('Waiting for another player...');

  clients.push(ws);

  if (clients.length >= 2) {
    launchGame();
  }
};

function launchGame() {
  console.log('Launching game.');

  let ws1 = clients.shift();
  let ws2 = clients.shift();
  let p1 = new Player(1, ws1);
  let p2 = new Player(2, ws2);
  let game = new Game(p1, p2);
  game.start();
};

router.get('/', (req, res) => {
  res.render('game/index');
});

router.ws('/socket', (ws, req) => {
  console.log('Websocket request received.');
  console.log(`Websocket state: ${ws.readyState}.`);

  if (ws.readyState === WS_OPEN) {
    handleClient(ws);
  }
  else {
    ws.on('open', () => {
      handleClient(ws);
    });
  }

  ws.on('close', () => {
    console.log('Websocket closed.');
  });
});

module.exports = router;
