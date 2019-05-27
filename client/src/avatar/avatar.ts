import { GameObjects, Tilemaps, Input, Math, Animations } from 'phaser';
import { AvatarModel } from '../models/avatar-model';

type KeyDict = { [code: number]: boolean };
const Vector2 = Math.Vector2;
const KeyCodes = Input.Keyboard.KeyCodes;

export class Avatar {
  private sprite: GameObjects.Sprite;
  private map: Tilemaps.Tilemap;
  private direction: Math.Vector2 = new Math.Vector2(0, 0);
  private speed: number;                // In tiles per second
  private isDigging: boolean;


  /*
   * The server only thinks of position relative to the top left of the map,
   * while the client deals with position relative to the top left of the game
   * window.
   *
   * When mapping between them, for some reason calling getCenter() on the tile
   * layer is what returns the top left of the map.
   */
  get mapRelativePosition() {
    let center = this.map.getLayer().tilemapLayer.getCenter();
    return this.sprite.getCenter().subtract(center);
  }

  set mapRelativePosition(pos: Math.Vector2) {
    let vec = pos.clone();
    let center = this.map.getLayer().tilemapLayer.getCenter();
    vec.add(center);
    this.sprite.setPosition(vec.x, vec.y);
  }

  constructor(sprite, map, speed = 1, tint = 0xffffff) {
    this.sprite = sprite;
    this.map = map;
    this.speed = speed;

    this.sprite.tint = tint;
  }

  handleInput(keys: KeyDict) { }

  update(deltaTime: number) {
    let spritePos = this.sprite.getCenter();
    let dir = this.direction.clone();
    dir.scale(this.speed * this.map.tileHeight * deltaTime / 1000);
    spritePos.add(dir);
    this.sprite.setPosition(spritePos.x, spritePos.y);
  }

  updateAuthoritative(model: AvatarModel) {
    this.mapRelativePosition = model.position;

    if (model.direction.x === 0 && model.direction.y === 0) {
      this.sprite.anims.stop();
      this.sprite.setFrame(0);
    }
    else {
      this.sprite.anims.play('walk', true);
    }

    if (model.direction.x > 0) {
      this.sprite.setFlipX(false);
    }
    else if (model.direction.x < 0) {
      this.sprite.setFlipX(true);
    }

    this.isDigging = model.isDigging;
  }
}
