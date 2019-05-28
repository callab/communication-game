import {
  Scene,
  GameObjects
} from 'phaser';

import { Timer } from '../timer';
import { Socket } from '../socket';
import { GameModel } from '../models/game-model';

import * as Util from '../util';

const TOP_BAR_HEIGHT = 36;
const TOP_BAR_BG_COLOR = 0xa6c4be;
const TOP_BAR_BORDER_COLOR = 0x00b792;

// This is a "UI scene" that renders above the map scene showing UI elements.
export class HUDScene extends Scene {
  private timer: Timer;
  private clock: GameObjects.Text;
  private socket: Socket;
  private oreText: GameObjects.Text;

  constructor() {
    super({
      key: 'hud',
      active: false,
      mapAdd: {
        game: 'game'
      }
    });
  }

  init(data) {
    this.timer = data.timer;
    this.socket = data.socket;
    this.socket.addListener((state) => {
      this.updateAuthoritative(state);
    });
  }

  preload() {
    this.load.image('ore-icon', 'images/ore.png');
  }

  create() {
    let width = Util.intOrStrToInt(this.game.config.width);
    let height = Util.intOrStrToInt(this.game.config.height);
    this.add.rectangle(width / 2, TOP_BAR_HEIGHT / 2,
                       width, TOP_BAR_HEIGHT,
                       TOP_BAR_BG_COLOR, 1);
    this.add.rectangle(width / 2, TOP_BAR_HEIGHT, width, 2,
                       TOP_BAR_BORDER_COLOR, 1);

    this.clock =
      this.add.text(width - 40, TOP_BAR_HEIGHT / 2, this.timer.clockDigits())
              .setFontSize(24)
              .setColor('#000000')
              .setOrigin(0.5, 0.5);

    let oreIcon = this.add.image(20, TOP_BAR_HEIGHT / 2, 'ore-icon');
    this.oreText = this.add.text(40, TOP_BAR_HEIGHT / 2, '0')
                           .setFontSize(24)
                           .setColor('#000000')
                           .setOrigin(0.5, 0.5);
  }

  update(time, deltaTime) {
    this.clock.text = this.timer.clockDigits();
  }

  updateAuthoritative(state: GameModel) {
    if (!this.oreText) {
      return;
    }

    let ores = state.client.inventory.ores;
    this.oreText.text = ores.toString();
  }
}
