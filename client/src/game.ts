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
    create: create
  }
};

let game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');

  this.load.image('grass', 'maps/tilesets/grass-tiles-2-small.png');
  this.load.image('bushes', 'maps/tilesets/qubodup-bush_0.png');
  this.load.tilemapTiledJSON('map', '../maps/map.json');
}

function create() {
  this.add.image(400, 300, 'sky');

  const map = this.make.tilemap({ key: 'map' });
  const groundTileset = map.addTilesetImage('grass', 'grass');
  const floraTileset = map.addTilesetImage('qubodup-bush_0', 'bushes');

  let x = WIDTH / 2 - map.widthInPixels / 2;
  let y = HEIGHT / 2 - map.heightInPixels / 2;

  const groundLayer = map.createStaticLayer('ground', groundTileset, x, y);
  const floraLayer = map.createStaticLayer('flora', floraTileset, x, y);
}
