import {
  Scene,
  Tilemaps,
  GameObjects,
  Input
} from 'phaser';

import { Avatar } from '../avatar/avatar';
import * as Util from '../util';

const KeyCodes = Input.Keyboard.KeyCodes;

// Scene for map exploration part of the game
export class MapScene extends Scene {
  private map: Tilemaps.Tilemap;
  private avatar: Avatar;
  private keys: { [code: number]: Input.Keyboard.Key } = {};

  constructor() {
    super({
      key: 'map',
      active: true,
      mapAdd: {
        game: 'game'
      }
    });

    (window as any).mapScene = this;
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

    let width = Util.intOrStrToInt(this.game.config.width);
    let height = Util.intOrStrToInt(this.game.config.height);

    let x = width / 2 - this.map.widthInPixels / 2;
    let y = height / 2 - this.map.heightInPixels / 2;

    const groundLayer =
      this.map.createDynamicLayer('ground', groundTileset, x, y);

    let pos = Util.tileCenter(this.map, this.map.tileToWorldXY(0, 4));
    let sprite = this.add.sprite(pos.x, pos.y, 'astronaut', 0);

    let animConfig = {
      key: 'walk',
      frames: this.anims.generateFrameNumbers('astronaut', {
        start: 0,
        end: 7,
        first: 0
      }),
      frameRate: 24,
      repeat: -1
    };

    this.anims.create(animConfig);

    this.avatar = new Avatar(sprite, this.map, 5);
    this.registerKeyListeners();
  }

  update(time: number, deltaTime: number) {
    this.avatar.handleInput(this.keys);
    this.avatar.update(deltaTime);
  }

  registerKeyListeners() {
    let keyCodes = [KeyCodes.UP, KeyCodes.DOWN, KeyCodes.LEFT, KeyCodes.RIGHT];
    keyCodes.forEach((code) => {
       this.keys[code] = this.input.keyboard.addKey(code);
    });
  }
}
