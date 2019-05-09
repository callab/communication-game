import { GameObjects, Tilemaps, Input, Math as PhaserMath } from 'phaser';

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
  protected map: Tilemap;
  protected direction: Direction;
  protected targetPos: Vector2;

  constructor(sprite: Sprite, map: Tilemap, direction: Direction, targetPos?: Vector2) {
    this.sprite = sprite;
    this.map = map;
    this.direction = direction;
    this.targetPos = targetPos || new PhaserMath.Vector2(this.sprite.x, this.sprite.y);
  }

  walk(directions: DirectionDict) {
    if (directions[Direction.Up]) {
      let targetPos = this.calcTargetPos(Direction.Up);
      return new VerticalState(this.sprite, this.map, Direction.Up, targetPos);
    }
    else if (directions[Direction.Down]) {
      let targetPos = this.calcTargetPos(Direction.Down);
      return new VerticalState(this.sprite, this.map, Direction.Down, targetPos);
    }

    return null;
  }

  abstract update(speed, deltaTime);

  public calcTargetPos(direction: Direction) {
    let tileCoord = this.map.worldToTileXY(this.sprite.x, this.sprite.y, false);

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

    return this.map.tileToWorldXY(tileCoord.x, tileCoord.y);
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

  constructor(sprite: Sprite, map: Tilemap, direction: Direction, targetPos?: Vector2) {
    super(sprite, map, direction, targetPos);
  }

  walk(directions: DirectionDict) {
    if (directions[Direction.Up]) {
      this.direction = Direction.Up;
      this.targetPos = this.calcTargetPos(Direction.Up);
    }

    if (directions[Direction.Down]) {
      this.direction = Direction.Down;
      this.targetPos = this.calcTargetPos(Direction.Down);
    }

    if (this.done) {
      if (directions[Direction.Left]) {
        let targetPos = this.calcTargetPos(Direction.Left);
        return new HorizontalState(this.sprite, this.map, Direction.Left, targetPos);
      }
      else if (directions[Direction.Right]) {
        let targetPos = this.calcTargetPos(Direction.Right);
        return new HorizontalState(this.sprite, this.map, Direction.Right, targetPos);
      }
    }

    return null;
  }

  update(speed, deltaTime) {
    if (this.done) {
      this.sprite.y = this.targetPos.y;
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

  constructor(sprite: Sprite, map: Tilemap, direction: Direction, targetPos?: Vector2) {
    super(sprite, map, direction, targetPos);
  }

  walk(directions: DirectionDict) {
    if (directions[Direction.Left]) {
      this.direction = Direction.Left;
      this.targetPos = this.calcTargetPos(Direction.Left);
    }

    if (directions[Direction.Right]) {
      this.direction = Direction.Right;
      this.targetPos = this.calcTargetPos(Direction.Right);
    }

    if (this.done) {
      if (directions[Direction.Up]) {
        let targetPos = this.calcTargetPos(Direction.Up);
        return new VerticalState(this.sprite, this.map, Direction.Up, targetPos);
      }
      else if (directions[Direction.Down]) {
        let targetPos = this.calcTargetPos(Direction.Down);
        return new VerticalState(this.sprite, this.map, Direction.Down, targetPos);
      }
    }

    return null;
  }

  update(speed, deltaTime) {
    if (this.done) {
      this.sprite.x = this.targetPos.x;
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
