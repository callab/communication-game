import { GameObjects, Tilemaps, Input, Math, Animations } from 'phaser';
import {
  WalkState,
  VerticalState,
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
  private speed: number;                // In tiles per second
  private walkState: WalkState;

  constructor(sprite, map, speed = 1) {
    this.sprite = sprite;
    this.map = map;
    this.speed = speed;
    this.walkState = new VerticalState(this.sprite,
                                       this.map,
                                       Direction.Up);
  }

  handleInput(keys: KeyDict) {
    let directions = this.mapToDirections(keys);

    let newState = this.walkState.walk(directions);
    if (newState != null) {
      this.walkState = newState;
    }
  }

  update(deltaTime: number) {
    this.walkState.update(this.speed, deltaTime);
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
