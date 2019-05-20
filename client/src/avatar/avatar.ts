import { GameObjects, Tilemaps, Input, Math, Animations } from 'phaser';
import {
  WalkState,
  StationaryState
} from './walk-state';
import { AvatarModel } from '../models/avatar-model';

type KeyDict = { [code: number]: boolean };
const Vector2 = Math.Vector2;
const KeyCodes = Input.Keyboard.KeyCodes;

export class Avatar {
  private sprite: GameObjects.Sprite;
  private map: Tilemaps.Tilemap;
  private direction: Math.Vector2 = new Math.Vector2(0, 0);
  private speed: number;                // In tiles per second
  private walkState: WalkState;

  constructor(sprite, map, speed = 1) {
    this.sprite = sprite;
    this.map = map;
    this.speed = speed;
    this.walkState = new StationaryState(this.sprite, this.map);
    this.walkState.enter();
  }

  handleInput(keys: KeyDict) {
    let newState = this.walkState.handleInput(keys);
    if (newState != null) {
      this.setWalkState(newState);
    }

    if (this.walkState.done) {
      this.direction.reset();
    }
    else {
      let vec = this.walkState.targetPos.clone();
      vec.subtract(this.sprite.getCenter());
      this.direction = vec.normalize();
    }
  }

  update(deltaTime: number) {
    let spritePos = this.sprite.getCenter();
    let dir = this.direction.clone();
    dir.scale(this.speed * this.map.tileHeight * deltaTime / 1000);
    spritePos.add(dir);
    this.moveToPosition(spritePos);
  }

  updateAuthoritative(model: AvatarModel) {
    this.moveToPosition(model.position);
  }

  setWalkState(state: WalkState) {
    if (this.walkState.done) {
      this.moveToPosition(this.walkState.targetPos);
    }

    this.walkState = state;
    this.walkState.enter();
  }

  moveToPosition(position: Math.Vector2) {
    this.sprite.setPosition(position.x, position.y);
  }

  moveToTile(x, y) {
    let worldPoint = this.map.tileToWorldXY(x, y);
    this.sprite.setPosition(worldPoint.x, worldPoint.y);
  }
}
