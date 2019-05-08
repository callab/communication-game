import * as Phaser from 'phaser';
import { GameState } from './game-state';
import { Socket } from './socket';
import { MapScene } from './scenes/scenes';

//let socket = null;
//
//function connect() {
//  console.log("Setting up socket...");
//
//  let socket = new Socket('/game/socket');
//  (window as any).socket = socket;
//
//  socket.onOpen = () => {
//    setMessage('Connected. Finding another player...');
//  };
//
//  socket.onUpdate = (state) => {
//    updateGame(state);
//  };
//
//  socket.onClose = () => {
//    setMessage('Disconnected.');
//  };
//
//  return socket;
//};

function setMessage(message) {
  let el = document.querySelector('.message');
  el.textContent = message;
}

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
  scene: [ MapScene ]
};

let game = new Phaser.Game(config);
