import { GameObjects, Tilemaps, Input, Math as PhaserMath, Animations } from 'phaser';
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

// Stationary state, then horizontal/vertical state
// moving state moves object to given tile
export abstract class WalkState {
  protected sprite: Sprite;
  protected animation: Animations.Animation;
  protected map: Tilemap;
  protected direction: Direction;
  protected targetPos: Vector2;

  constructor(sprite: Sprite, animation, map: Tilemap, direction: Direction, targetPos?: Vector2) {
    this.sprite = sprite;
    this.animation = animation;
    this.map = map;

    this.setTarget(
      targetPos || new PhaserMath.Vector2(this.sprite.x, this.sprite.y),
      direction
    );
  }

  walk(directions: DirectionDict) {
    if (directions[Direction.Up]) {
      let targetPos = this.calcTargetPos(Direction.Up);
      return new VerticalState(this.sprite, this.animation, this.map, Direction.Up, targetPos);
    }
    else if (directions[Direction.Down]) {
      let targetPos = this.calcTargetPos(Direction.Down);
      return new VerticalState(this.sprite, this.animation, this.map, Direction.Down, targetPos);
    }

    return null;
  }

  abstract update(speed, deltaTime);

  protected calcTargetPos(direction: Direction) {
    let tileCoord = this.map.worldToTileXY(this.sprite.x, this.sprite.y);

    if (direction == Direction.Up) {
      tileCoord.y -= 1;
    }
    else if (direction == Direction.Down) {
      tileCoord.y += 1;
    }
    else if (direction == Direction.Left) {
      tileCoord.x -= 1;
    }
    else if (direction == Direction.Right) {
      tileCoord.x += 1;
    }

    let rawPos = this.map.tileToWorldXY(tileCoord.x, tileCoord.y);
    return Util.tileCenter(this.map, rawPos);
  }

  protected setTarget(targetPos: Vector2, direction: Direction) {
    this.targetPos = targetPos;
    this.direction = direction;
  }

  protected moveToTarget() {
    this.sprite.x = this.targetPos.x;
    this.sprite.y = this.targetPos.y;
  }
}

export class VerticalState extends WalkState {
  get done() {
    if (this.direction == Direction.Up) {
      return this.sprite.y <= this.targetPos.y;
    }
    else if (this.direction == Direction.Down) {
      return this.sprite.y >= this.targetPos.y;
    }
  }

  constructor(sprite: Sprite, animation, map: Tilemap, direction: Direction, targetPos?: Vector2) {
    super(sprite, animation, map, direction, targetPos);
  }

  walk(directions: DirectionDict) {
    if (directions[Direction.Up]) {
      this.sprite.anims.play('walk', true);
      this.setTarget(this.calcTargetPos(Direction.Up), Direction.Up);
    }

    if (directions[Direction.Down]) {
      this.sprite.anims.play('walk', true);
      this.setTarget(this.calcTargetPos(Direction.Down), Direction.Down);
    }

    if (this.done) {
      this.moveToTarget();
      this.sprite.anims.stop();
      this.sprite.setFrame(0);

      if (directions[Direction.Left]) {
        let targetPos = this.calcTargetPos(Direction.Left);
        return new HorizontalState(this.sprite, this.animation, this.map, Direction.Left, targetPos);
      }
      else if (directions[Direction.Right]) {
        let targetPos = this.calcTargetPos(Direction.Right);
        return new HorizontalState(this.sprite, this.animation, this.map, Direction.Right, targetPos);
      }
    }

    return null;
  }

  update(speed, deltaTime) {
    if (this.done) {
      this.moveToTarget();
      return;
    }

    if (this.direction == Direction.Up) {
      this.sprite.y -= speed * this.map.tileHeight * deltaTime / 1000;
    }
    else if (this.direction == Direction.Down) {
      this.sprite.y += speed * this.map.tileHeight * deltaTime / 1000;
    }
  }
}

export class HorizontalState extends WalkState {
  get done() {
    if (this.direction == Direction.Left) {
      return this.sprite.x <= this.targetPos.x;
    }
    else if (this.direction == Direction.Right) {
      return this.sprite.x >= this.targetPos.x;
    }
  }

  constructor(sprite: Sprite, animation, map: Tilemap, direction: Direction, targetPos?: Vector2) {
    super(sprite, animation, map, direction, targetPos);
  }

  walk(directions: DirectionDict) {
    if (directions[Direction.Left]) {
      this.sprite.setFlipX(true);
      this.sprite.anims.play('walk', true);
      this.setTarget(this.calcTargetPos(Direction.Left), Direction.Left);
    }

    if (directions[Direction.Right]) {
      this.sprite.setFlipX(false);
      this.sprite.anims.play('walk', true);
      this.setTarget(this.calcTargetPos(Direction.Right), Direction.Right);
    }

    if (this.done) {
      this.moveToTarget();
      this.sprite.anims.stop();
      this.sprite.setFrame(0);

      if (directions[Direction.Up]) {
        let targetPos = this.calcTargetPos(Direction.Up);
        return new VerticalState(this.sprite, this.animation, this.map, Direction.Up, targetPos);
      }
      else if (directions[Direction.Down]) {
        let targetPos = this.calcTargetPos(Direction.Down);
        return new VerticalState(this.sprite, this.animation, this.map, Direction.Down, targetPos);
      }
    }

    return null;
  }

  update(speed, deltaTime) {
    if (this.done) {
      this.moveToTarget();
      return;
    }

    if (this.direction == Direction.Left) {
      this.sprite.x -= speed * this.map.tileWidth * deltaTime / 1000;
    }
    else if (this.direction == Direction.Right) {
      this.sprite.x += speed * this.map.tileWidth * deltaTime / 1000;
    }
  }
}
