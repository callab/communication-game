import * as Phaser from 'phaser';

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
}

function update(time, delta) {
  let worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

  let pointerTileX = map.worldToTileX(worldPoint.x);
  let pointerTileY = map.worldToTileY(worldPoint.y);

  marker.x = map.tileToWorldX(pointerTileX);
  marker.y = map.tileToWorldY(pointerTileY);

  if (this.input.manager.activePointer.isDown) {
    let tile = map.getTileAt(pointerTileX, pointerTileY, false, 'ground');
    if (tile) {
      console.log(`Found tile at (${pointerTileX}, ${pointerTileY}); changing tint!`);
      tile.tint = 0xff0000;
    }
    else {
      console.log(`Did not find tile at (${pointerTileX}, ${pointerTileY}).`);
    }
  }
}
