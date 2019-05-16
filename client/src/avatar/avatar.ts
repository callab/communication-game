import { GameObjects, Tilemaps, Input, Math, Animations } from 'phaser';
import {
  WalkState,
  StationaryState,
  Direction
} from './walk-state';

type KeyDict = { [code: number]: Input.Keyboard.Key };
const Vector2 = Math.Vector2;
const KeyCodes = Input.Keyboard.KeyCodes;

const inputMap: { [key: number]: Direction } = {
  [KeyCodes.UP]: Direction.Up,
  [KeyCodes.LEFT]: Direction.Left,
  [KeyCodes.RIGHT]: Direction.Right,
  [KeyCodes.DOWN]: Direction.Down
};

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
    let directions = this.mapToDirections(keys);

    let newState = this.walkState.handleInput(directions);
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

  private mapToDirections(keys: KeyDict) {
    let directions = {};

    for (let keyCode in keys) {
      let keyboardKey = keys[keyCode];

      if (keyboardKey.isDown) {
        let direction = inputMap[keyCode];
        directions[direction] = true;
      }
    }

    return directions;
  }
}
