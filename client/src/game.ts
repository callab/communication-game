import * as Phaser from 'phaser';
import {
  MapScene,
  SplashScene,
  HUDScene,
  ScoreScene
} from './scenes/scenes';

import { MessageLog } from './message-log';

const WIDTH = 800;
const HEIGHT = 600;

let config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [ SplashScene, MapScene, HUDScene, ScoreScene ]
};

fetchAllowedWords((err, words) => {
  if (err) {
    console.error(err);
  }

  (window as any).allowedWords = words;
  let game = new Phaser.Game(config);
});

function fetchAllowedWords(callback) {
  let req = new XMLHttpRequest();
  req.open('GET', '/game/words', true);

  req.onload = () => {
    if (req.status >= 200 && req.status < 400) {
      let data = JSON.parse(req.responseText);
      callback(null, data.words);
    }
    else {
      callback(`HTTP Status: ${req.status}.`, null);
    }
  }

  req.onerror = () => {
    callback(`HTTP Status: ${req.status}.`, null);
  }

  req.send();
}
