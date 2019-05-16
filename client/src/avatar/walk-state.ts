import {
  GameObjects,
  Tilemaps,
  Input,
  Math as PhaserMath,
  Animations
} from 'phaser';

import * as Util from '../util';

type Sprite = GameObjects.Sprite;
type Tilemap = Tilemaps.Tilemap;
type Vector2 = PhaserMath.Vector2;

type KeyDict = { [code: number]: Input.Keyboard.Key };

export enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

type DirectionDict = { [dir: number]: boolean };

/*
 * State machine that handles input for the avatar.
 *
 * Input handling changes depending on whether the avatar is traveling
 * horizontally or vertically. A state in the state machine, when given inputs
 * for a frame, must determine how the inputs affect the direction vector and
 * whether a new state should be entered.
 */
export abstract class WalkState {
  public targetPos: Vector2;
  protected sprite: Sprite;
  protected map: Tilemap;

  constructor(sprite: Sprite, map: Tilemap)
  {
    this.sprite = sprite;
    this.map = map;
    this.targetPos = this.calcTargetPos();
  }

  abstract get done();

  abstract targetTileCoord(current: Vector2);

  enter() {
    console.log(`Entering ${this.constructor.name}.`);
  }

  handleInput(directions: DirectionDict) {
    if (directions[Direction.Left]) {
      return new LeftState(this.sprite, this.map);
    }
    else if (directions[Direction.Right]) {
      return new RightState(this.sprite, this.map);
    }
    else if (directions[Direction.Down]) {
      return new DownState(this.sprite, this.map);
    }
    else if (directions[Direction.Up]) {
      return new UpState(this.sprite, this.map);
    }

    return new StationaryState(this.sprite, this.map);
  }

  protected calcTargetPos() {
    let tileCoord = this.map.worldToTileXY(this.sprite.x, this.sprite.y);
    tileCoord = this.targetTileCoord(tileCoord);
    let rawPos = this.map.tileToWorldXY(tileCoord.x, tileCoord.y);
    return Util.tileCenter(this.map, rawPos);
  }
}

export class StationaryState extends WalkState {
  constructor(sprite: Sprite, map: Tilemap)
  {
    super(sprite, map);
  }

  get done() {
    return true;
  }

  targetTileCoord(current: Vector2) {
    return current;
  }

  enter() {
    this.sprite.anims.stop();
    this.sprite.setFrame(0);
    super.enter();
  }

  handleInput(directions: DirectionDict) {
    if (directions[Direction.Left]) {
      return new LeftState(this.sprite, this.map);
    }
    else if (directions[Direction.Right]) {
      return new RightState(this.sprite, this.map);
    }
    else if (directions[Direction.Down]) {
      return new DownState(this.sprite, this.map);
    }
    else if (directions[Direction.Up]) {
      return new UpState(this.sprite, this.map);
    }

    return null;
  }
}

export class UpState extends WalkState {
  constructor(sprite: Sprite, map: Tilemap)
  {
    super(sprite, map);
  }

  get done() {
    return this.sprite.y < this.targetPos.y;
  }

  targetTileCoord(current: Vector2) {
    current.y -= 1;
    return current;
  }

  enter() {
    this.sprite.anims.play('walk', true);
    super.enter();
  }

  handleInput(directions: DirectionDict) {
    if (directions[Direction.Up]) {
      this.targetPos = this.calcTargetPos();
    }
    else if (directions[Direction.Down]) {
      return new DownState(this.sprite, this.map);
    }

    if (this.done) {
      return super.handleInput(directions);
    }

    return null;
  }
}

export class DownState extends WalkState {
  constructor(sprite: Sprite, map: Tilemap)
  {
    super(sprite, map);
  }

  get done() {
    return this.sprite.y > this.targetPos.y;
  }

  targetTileCoord(current: Vector2) {
    current.y += 1;
    return current;
  }

  enter() {
    this.sprite.anims.play('walk', true);
    super.enter();
  }

  handleInput(directions: DirectionDict) {
    if (directions[Direction.Down]) {
      this.targetPos = this.calcTargetPos();
    }
    else if (directions[Direction.Up]) {
      return new UpState(this.sprite, this.map);
    }

    if (this.done) {
      return super.handleInput(directions);
    }

    return null;
  }
}

export class LeftState extends WalkState {
  constructor(sprite: Sprite, map: Tilemap)
  {
    super(sprite, map);
  }

  get done() {
    return this.sprite.x < this.targetPos.x;
  }

  targetTileCoord(current: Vector2) {
    current.x -= 1;
    return current;
  }

  enter() {
    this.sprite.anims.play('walk', true);
    this.sprite.setFlipX(true);
    super.enter();
  }

  handleInput(directions: DirectionDict) {
    if (directions[Direction.Left]) {
      this.targetPos = this.calcTargetPos();
    }
    else if (directions[Direction.Right]) {
      return new RightState(this.sprite, this.map);
    }

    if (this.done) {
      return super.handleInput(directions);
    }

    return null;
  }
}

export class RightState extends WalkState {
  constructor(sprite: Sprite, map: Tilemap)
  {
    super(sprite, map);
  }

  get done() {
    return this.sprite.x > this.targetPos.x;
  }

  targetTileCoord(current: Vector2) {
    current.x += 1;
    return current;
  }

  enter() {
    console.log(this.sprite.anims.getRepeat());
    this.sprite.anims.play('walk', true);
    this.sprite.setFlipX(false);
    super.enter();
  }

  handleInput(directions: DirectionDict) {
    if (directions[Direction.Right]) {
      this.targetPos = this.calcTargetPos();
    }
    else if (directions[Direction.Left]) {
      return new LeftState(this.sprite, this.map);
    }

    if (this.done) {
      return super.handleInput(directions);
    }

    return null;
  }
}
