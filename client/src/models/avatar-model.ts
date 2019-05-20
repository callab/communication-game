import { Math } from 'phaser';

export class AvatarModel {
  clientId: number;
  speed: number;
  position: Math.Vector2;

  constructor(jsonObj) {
    this.clientId = jsonObj.clientId;
    this.speed = jsonObj.speed;
    this.position = new Math.Vector2(jsonObj.position.x, jsonObj.position.y);
  }
}
