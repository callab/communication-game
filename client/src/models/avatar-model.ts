import { Math } from 'phaser';

export class AvatarModel {
  clientId: number;
  speed: number;
  position: Math.Vector2;
  direction: Math.Vector2;

  constructor(jsonObj) {
    this.clientId = jsonObj.clientId;
    this.speed = jsonObj.speed;
    this.position = new Math.Vector2(jsonObj.position.x, jsonObj.position.y);
    this.direction = new Math.Vector2(jsonObj.direction.x, jsonObj.direction.y);
  }
}
