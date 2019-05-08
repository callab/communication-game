import { GameObjects } from 'phaser';

export class Avatar {
  private go: GameObjects.Image;

  constructor(go: GameObjects.Image) {
    this.go = go;
  }
}
