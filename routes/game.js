const fs = require('fs');
const express = require('express');
const Client = require('../lib/client');
const Game = require('../lib/game');
const Map = require('../lib/map');

const WS_OPEN = 1;

module.exports = function (app) {
  let router = express.Router();
  let games = [];

  router.get('/', (req, res) => {
    let bundleName = app.config.clientBundleName;
    if (!bundleName || bundleName.length == 0) {
      console.error('ERROR: No clientBundleName provided in config.js');
    }

    fs.readdir('public', (err, files) => {
      if (err)
        throw err;

      let rx = new RegExp('^' + bundleName + '\.*\.js$');
      let bundleFilename = files.filter(filename => rx.test(filename))[0];
      if (!bundleFilename || bundleFilename.length == 0) {
        console.log('ERROR: No client bundle file found.');
      }

      res.render('game', { clientPath: bundleFilename });
    });
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

  function handleClient(ws) {
    games = games.filter((game) => !game.stopped);

    if (games.length == 0 || games[games.length - 1].isFull()) {
      // load server map
      let path = 'server-maps/next.json';
      let str = fs.readFileSync(path);
      let map = new Map(JSON.parse(str));
      games.push(new Game(map));
    }

    games[games.length - 1].addClient(ws);
  };

  return router;
};
