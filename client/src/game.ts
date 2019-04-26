import * as Phaser from 'phaser';

let socket = null;

function connect() {
  console.log("Setting up socket...");

  let socket = new WebSocket("ws://localhost:3000/game/socket");

  socket.onopen = function(ev) {
    console.log("Connection established.");
    setMessage('Connected. Finding another player...');
  };

  socket.onmessage = function(ev) {
    console.log('Data received:');
    console.log(ev.data);

    let message = ev.data.trim();

    if (message.length > 0) {
      let state = null;

      try {
        state = JSON.parse(message);
      }
      catch (e) {
        return;
      }

      updateGame(state);
    }
  };

  socket.onclose = function(ev) {
    console.log('Disconnected.');
    setMessage('Disconnected.');
  };

  return socket;
};

function setMessage(message) {
  let el = document.querySelector('.message');
  el.textContent = message;
}

function send(message) {
  console.log("Sending data:");
  console.log(message);
  socket.send(message);
};

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
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let game = new Phaser.Game(config);
let map = null;
let marker = null;

function preload() {
  this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');

  this.load.image('grass', 'maps/tilesets/grass-tiles-2-small.png');
  this.load.tilemapTiledJSON('map', '../maps/next.json');
}

function create() {
  this.add.image(400, 300, 'sky');

  map = this.make.tilemap({ key: 'map' });
  const groundTileset = map.addTilesetImage('grass-tiles-2-small', 'grass');

  let x = WIDTH / 2 - map.widthInPixels / 2;
  let y = HEIGHT / 2 - map.heightInPixels / 2;

  const groundLayer = map.createDynamicLayer('ground', groundTileset, x, y);

  marker = this.add.graphics();
  marker.lineStyle(3, 0xffffff, 1);
  marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);

  this.input.on('pointerdown', (pointer) => {
    let tileCoord = tileXY(this, pointer);
    let tile = map.getTileAt(tileCoord.x, tileCoord.y, false, 'ground');
    if (tile) {
      send(JSON.stringify({ row: tileCoord.x, col: tileCoord.y }));
    }
  });

  socket = connect();
}

function update(time, delta) {
  let tileCoord = tileXY(this, this.input.activePointer);
  marker.x = map.tileToWorldX(tileCoord.x);
  marker.y = map.tileToWorldY(tileCoord.y);
}

function updateGame(state) {
  let container = document.querySelector('#game-container');
  container.classList.remove('hidden');

  for (let row = 0; row < state.board.width; row++) {
    for (let col = 0; col < state.board.height; col++) {
      let playerId = state.board.tiles[row][col];

      let tile = map.getTileAt(row, col, false, 'ground');
      if (tile) {
        if (playerId == state.playerId) {
          tile.tint = 0x007700;
        }
        else if (playerId > 0) {
          tile.tint = 0x7777ff;
        }
        else {
          tile.tint = 0xffffff;
        }
      }
      else {
        console.log('Could not find tile!');
      }
    }
  }

  if (state.isCurrent) {
    setMessage('It is your turn. Pick a tile to scan.');
  }
  else {
    setMessage('Waiting for the other player to scan a tile...');
  }
}

function tileXY(scene, pointer) {
  let worldPoint = pointer.positionToCamera(scene.cameras.main);

  let pointerTileX = map.worldToTileX(worldPoint.x);
  let pointerTileY = map.worldToTileY(worldPoint.y);
  return { x: pointerTileX, y: pointerTileY };
}
