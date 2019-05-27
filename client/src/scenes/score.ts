import {
  Scene,
  GameObjects
} from 'phaser';

import * as Util from '../util';

const RECT_BG_COLOR = 0xa6c4be;
const RECT_BORDER_COLOR = 0x00b792;

export class ScoreScene extends Scene {
  ores: number;
  teamOres: number;

  constructor() {
    super({
      key: 'score',
      active: false,
      visible: false,
      mapAdd: {
        game: 'game'
      }
    });
  }

  init(data) {
    this.ores = data.ores;
    this.teamOres = data.teamOres;
  }

  preload() {
    this.load.image('ore-icon', 'images/ore.png');
  }

  create() {
    let width = Util.intOrStrToInt(this.game.config.width);
    let height = Util.intOrStrToInt(this.game.config.height);

    this.add.image(width / 2, height / 2, 'sky');

    this.add.rectangle(width / 2, height / 2,
                       width - 120 + 2, height - 80 + 2,
                       RECT_BORDER_COLOR, 1);
    this.add.rectangle(width / 2, height / 2,
                       width - 120, height - 80,
                       RECT_BG_COLOR, 1);

    this.add.text(width / 2, 100, "Time's Up!")
            .setFontSize(52)
            .setColor('#000000')
            .setOrigin(0.5, 0.5);

    this.add.text(width / 2, 180, 'You Collected:')
            .setFontSize(36)
            .setColor('#000000')
            .setOrigin(0.5, 0.5);

    this.add.image(width / 2 - 20, 230, 'ore-icon');
    this.add.text(width / 2 + 20, 230, this.ores.toString())
            .setFontSize(28)
            .setColor('#000000')
            .setOrigin(0.5, 0.5);

    this.add.text(width / 2, 300, 'Your Whole Team Collected:')
            .setFontSize(36)
            .setColor('#000000')
            .setOrigin(0.5, 0.5);

    this.add.image(width / 2 - 20, 350, 'ore-icon');
    this.add.text(width / 2 + 20, 350, this.teamOres.toString())
            .setFontSize(28)
            .setColor('#000000')
            .setOrigin(0.5, 0.5);

    let button = this.add.rectangle(width / 2,
                                    460,
                                    200,
                                    120,
                                    RECT_BORDER_COLOR,
                                    1);
    this.add.text(width / 2, 460, 'Done')
            .setFontSize(64)
            .setColor('#000000')
            .setOrigin(0.5, 0.5);

    button.setInteractive();
    button.on('pointerdown', () => {
      this.scene.start('splash');
    });
  }
}
