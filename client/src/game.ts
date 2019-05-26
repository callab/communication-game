import * as Phaser from 'phaser';
import {
  MapScene,
  SplashScene,
  HUDScene
} from './scenes/scenes';

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
  scene: [ SplashScene, MapScene, HUDScene ]
};

let game = new Phaser.Game(config);
