import { GameObjects, Tilemaps } from 'phaser';

export class Avatar {
  private sprite: GameObjects.Sprite;
  private map: Tilemaps.Tilemap;

  constructor(sprite, map) {
    this.sprite = sprite;
    this.map = map;
  }

  moveToTile(x, y) {
    let worldPoint = this.map.tileToWorldXY(x, y);
    this.sprite.setPosition(worldPoint.x, worldPoint.y);
  }
}
