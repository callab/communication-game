import {
  Scene,
  Tilemaps,
  GameObjects,
  Input
} from 'phaser';

import { Socket } from '../socket';
import { Avatar } from '../avatar/avatar';
import { GameModel } from '../models/game-model';
import { MapModel } from '../models/map-model';
import { Timer } from '../timer';
import { MessageLog } from '../message-log';
import { MessageUI } from '../message-ui';
import * as Util from '../util';

const KeyCodes = Input.Keyboard.KeyCodes;

// Scene for map exploration part of the game
export class MapScene extends Scene {
  private map: Tilemaps.Tilemap;
  private avatar: Avatar;
  private avatars: Map<number, Avatar> = new Map<number, Avatar>();
  private keys: { [code: number]: Input.Keyboard.Key } = {};
  private socket: Socket;
  private timer: Timer;
  private messageLog: MessageLog;
  private messageUI: MessageUI;

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
    this.load.image('ore', 'maps/tilesets/ore.png');
    this.load.tilemapTiledJSON('map', '../maps/next.json');

    this.load.spritesheet('astronaut', 'images/astronaut_small.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.avatars = new Map<number, Avatar>();
    this.keys = {};
    this.messageLog = new MessageLog();
    this.messageUI = new MessageUI();
    this.messageUI.onInput = (inputVal) => {
      this.handleMessageBoxInput(inputVal);
    };

    (window as any).mapScene = this;

    this.add.image(400, 300, 'sky');

    this.map = this.make.tilemap({ key: 'map' });
    const groundTileset =
      this.map.addTilesetImage('grass-tiles-2-small', 'grass');
    const oreTileset =
      this.map.addTilesetImage('ore', 'ore');

    let width = Util.intOrStrToInt(this.game.config.width);
    let height = Util.intOrStrToInt(this.game.config.height);

    let x = width / 2 - this.map.widthInPixels / 2;
    let y = height / 2 - this.map.heightInPixels / 2 + 18;

    const groundLayer =
      this.map.createDynamicLayer('ground', groundTileset, x, y);
    const oreLayer =
      this.map.createDynamicLayer('ore', oreTileset, x, y);

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
    this.socket.addListener((state) => {
      this.updateAuthoritative(state);
    });

    this.timer = new Timer(60 * 1000);
    this.scene.launch('hud', {
      timer: this.timer,
      socket: this.socket
    });
  }

  update(time: number, deltaTime: number) {
    let keysDown = this.keysDown;
    this.socket.sendInput(keysDown, this.messageLog.asJSON());
    //this.avatar.handleInput(keysDown);
    this.avatar.update(time, deltaTime);

    //this.timer.update(deltaTime);
  }

  // Update based on response from server
  updateAuthoritative(state: GameModel) {
    if (!this.avatars.get(state.clientId)) {
      this.avatars.set(state.clientId, this.avatar);
      this.avatar.setTint(state.clientId - 1);
    }

    state.avatars.forEach((model) => {
      let avatar = this.avatars.get(model.clientId);
      if (!avatar) {
        let sprite = this.add.sprite(0, 0, 'astronaut', 0);
        avatar = new Avatar(sprite, this.map, 5);
        avatar.setTint(model.clientId - 1);
        avatar.mapRelativePosition = model.position;
        this.avatars.set(model.clientId, avatar);
      }

      avatar.updateAuthoritative(model);
    });

    this.timer.updateAuthoritative(state.timeRemaining);
    this.updateMap(state.map);

    this.messageLog.updateAuthoritative(state.messages);
    this.messageUI.update(this.messageLog);

    if (this.timer.stopped) {
      this.transitionToScoreScene(state);
    }
  }

  updateMap(map: MapModel) {
    for (let row = 0; row < this.map.height; row++) {
      for (let col = 0; col < this.map.width; col++) {
        if (this.map.hasTileAt(col, row, 'ore')) {
          let val = map.state[row][col];

          if (val == 0) {
            // need to remove this ore
            this.map.removeTileAt(col, row, true, true, 'ore');
          }
        }
      }
    }
  }

  handleMessageBoxInput(inputVal) {
    this.messageLog.sendMessage(inputVal);
  };

  registerKeyListeners() {
    let keyCodes = [
      KeyCodes.UP,
      KeyCodes.DOWN,
      KeyCodes.LEFT,
      KeyCodes.RIGHT,
      KeyCodes.FORWARD_SLASH
    ];

    keyCodes.forEach((code) => {
       this.keys[code] = this.input.keyboard.addKey(code);
    });
  }

  transitionToScoreScene(state) {
    this.shutdown();

    let myOres = state.client.inventory.ores;
    let teamOres = state.clients.reduce((sum, client) => {
      return sum + client.inventory.ores;
    }, 0);

    this.scene.start('score', {
      ores: myOres,
      teamOres: teamOres
    });
  }

  shutdown() {
    this.socket.close();
    this.socket = null;
    this.timer = null;
    this.map = null;
    this.avatar = null;
    this.avatars = null;
    this.messageUI.shutdown();
    this.messageUI = null;
    this.scene.stop('hud');
  }
}
