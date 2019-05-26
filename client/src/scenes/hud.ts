import {
  Scene
} from 'phaser';

import * as Util from '../util';

const TOP_BAR_HEIGHT = 36;
const TOP_BAR_BG_COLOR = 0xa6c4be;
const TOP_BAR_BORDER_COLOR = 0x00b792;

// This is a "UI scene" that renders above the map scene showing UI elements.
export class HUDScene extends Scene {
  constructor() {
    super({
      key: 'hud',
      active: false,
      mapAdd: {
        game: 'game'
      }
    });
  }

  preload() { }

  create() {
    let width = Util.intOrStrToInt(this.game.config.width);
    let height = Util.intOrStrToInt(this.game.config.height);
    this.add.rectangle(width / 2, TOP_BAR_HEIGHT / 2,
                       width, TOP_BAR_HEIGHT,
                       TOP_BAR_BG_COLOR, 1);
    this.add.rectangle(width / 2, TOP_BAR_HEIGHT, width, 2,
                       TOP_BAR_BORDER_COLOR, 1);
  }
}
