import { Scene, Tilemaps, GameObjects } from 'phaser';
import { Avatar } from '../avatar';
import { intOrStrToInt } from '../util';

// Scene for map exploration part of the game
export class MapScene extends Scene {
  private map: Tilemaps.Tilemap;
  private avatar: Avatar;

  constructor() {
    super({
      key: 'map',
      active: true,
      mapAdd: {
        game: 'game'
      }
    });
  }

  preload() {
    this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');

    this.load.image('grass', 'maps/tilesets/grass-tiles-2-small.png');
    this.load.tilemapTiledJSON('map', '../maps/next.json');

    this.load.spritesheet('astronaut', 'images/astronaut_small.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.add.image(400, 300, 'sky');

    this.map = this.make.tilemap({ key: 'map' });
    const groundTileset =
      this.map.addTilesetImage('grass-tiles-2-small', 'grass');

    let width = intOrStrToInt(this.game.config.width);
    let height = intOrStrToInt(this.game.config.height);

    let x = width / 2 - this.map.widthInPixels / 2;
    let y = height / 2 - this.map.heightInPixels / 2;

    const groundLayer =
      this.map.createDynamicLayer('ground', groundTileset, x, y);

    let go = this.add.image(width / 2, height / 2, 'astronaut', 0);
    this.avatar = new Avatar(go);
  }

  //  updateState(state) {
  //    let container = document.querySelector('#game-container');
  //    container.classList.remove('hidden');
  //
  //    for (let row = 0; row < state.board.width; row++) {
  //      for (let col = 0; col < state.board.height; col++) {
  //        let playerId = state.board.tiles[row][col];
  //
  //        let tile = map.getTileAt(row, col, false, 'ground');
  //        if (tile) {
  //          if (playerId == state.playerId) {
  //            tile.tint = 0x007700;
  //          }
  //          else if (playerId > 0) {
  //            tile.tint = 0x7777ff;
  //          }
  //          else {
  //            tile.tint = 0xffffff;
  //          }
  //        }
  //        else {
  //          console.log('Could not find tile!');
  //        }
  //      }
  //    }
  //
  //    if (state.isCurrent) {
  //      setMessage('It is your turn. Pick a tile to scan.');
  //    }
  //    else {
  //      setMessage('Waiting for the other player to scan a tile...');
  //    }
  //  }

  private tileXY(scene, pointer) {
    let worldPoint = pointer.positionToCamera(scene.cameras.main);

    let pointerTileX = this.map.worldToTileX(worldPoint.x);
    let pointerTileY = this.map.worldToTileY(worldPoint.y);
    return { x: pointerTileX, y: pointerTileY };
  }
}
