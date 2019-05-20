import {
  Scene
} from 'phaser';

import * as Util from '../util';

export class SplashScene extends Scene {
  constructor() {
    super({
      key: 'splash',
      active: true,
      mapAdd: {
        game: 'game'
      }
    });
  }

  preload() {
    this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
  }

  create() {
    let width = Util.intOrStrToInt(this.game.config.width);
    let height = Util.intOrStrToInt(this.game.config.height);
    this.add.image(width / 2, height / 2, 'sky');

    let button = this.add.rectangle(width / 2,
                                    height / 2,
                                    200,
                                    120,
                                    0xffff00,
                                    1);

    this.add.text(width / 2, height / 2, 'Play')
            .setFontSize(64)
            .setColor('#000000')
            .setOrigin(0.5, 0.5);

    button.setInteractive();
    button.on('pointerdown', () => {
      this.scene.start('map');
    });
  }
}
