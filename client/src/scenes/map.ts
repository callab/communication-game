import {
  Scene,
  Tilemaps,
  GameObjects,
  Input
} from 'phaser';

import { Socket } from '../socket';
import { Avatar } from '../avatar/avatar';
import { GameModel } from '../models/game-model';
import * as Util from '../util';

const KeyCodes = Input.Keyboard.KeyCodes;

const TINTS = [0xff9999, 0x99ff99, 0xffff99];

// Scene for map exploration part of the game
export class MapScene extends Scene {
  private map: Tilemaps.Tilemap;
  private avatar: Avatar;
  private avatars: Map<number, Avatar> = new Map<number, Avatar>();
  private keys: { [code: number]: Input.Keyboard.Key } = {};
  private socket: Socket;

  constructor() {
    super({
      key: 'map',
      active: false,
      visible: false,
      mapAdd: {
        game: 'game'
      }
    });
  }

  // Returns a dictionary mapping key codes to a boolean value indicating
  // whether the key is down this frame.
  get keysDown() {
    let dict = {};
    for (let keyCode in this.keys) {
      dict[keyCode] = this.keys[keyCode].isDown;
    }

    return dict;
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

    this.socket = new Socket('/game/socket');
    this.socket.onUpdate = this.updateAuthoritative;
  }

  update(time: number, deltaTime: number) {
    let keysDown = this.keysDown;
    this.socket.sendInput(keysDown);
    //this.avatar.handleInput(keysDown);
    //this.avatar.update(deltaTime);
  }

  updateAuthoritative = (state: GameModel) => {
    if (!this.avatars.get(state.clientId)) {
      this.avatars.set(state.clientId, this.avatar);
    }

    state.avatars.forEach((model) => {
      let avatar = this.avatars.get(model.clientId);
      if (!avatar) {
        let pos = model.position;
        let sprite = this.add.sprite(pos.x, pos.y, 'astronaut', 0);
        let tint = TINTS[(model.clientId - 1) % TINTS.length];
        avatar = new Avatar(sprite, this.map, 5, tint);
        this.avatars.set(model.clientId, avatar);
      }

      avatar.updateAuthoritative(model);
    });
  }

  registerKeyListeners() {
    let keyCodes = [KeyCodes.UP, KeyCodes.DOWN, KeyCodes.LEFT, KeyCodes.RIGHT];
    keyCodes.forEach((code) => {
       this.keys[code] = this.input.keyboard.addKey(code);
    });
  }
}
