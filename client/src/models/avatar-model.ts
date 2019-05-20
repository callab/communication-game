import { Math } from 'phaser';

export class AvatarModel {
  speed: number;
  position: Math.Vector2;

  constructor(jsonObj) {
    this.speed = jsonObj.speed;
    this.position = new Math.Vector2(jsonObj.position.x, jsonObj.position.y);
  }
}
