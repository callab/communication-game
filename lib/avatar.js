const Victor = require('victor');
const { KEY_CODES } = require('./client');

class Avatar {
  constructor(clientId, map) {
    this.clientId = clientId;
    this.map = map;
    this.speed = 5;
    this.position = Victor(48, 48);
    this.direction = Victor(0, 0);
    this.isDigging = false;
  }

  handleInput(keys) {
    if (this.isDigging) {
      return; // Cannot move while digging!
    }

    if (keys[KEY_CODES.SPACE] && this.canDig()) {
      this.startDigging();
    }
    else if (keys[KEY_CODES.LEFT]) {
      this.direction.x = -1;
      this.direction.y = 0;
    }
    else if (keys[KEY_CODES.RIGHT]) {
      this.direction.x = 1;
      this.direction.y = 0;
    }
    else if (keys[KEY_CODES.DOWN]) {
      this.direction.x = 0;
      this.direction.y = 1;
    }
    else if (keys[KEY_CODES.UP]) {
      this.direction.x = 0;
      this.direction.y = -1;
    }
    else {
      this.direction.x = 0;
      this.direction.y = 0;
    }
  }

  update(deltaTime) {
    let vec2 = this.direction.clone();
    vec2.multiplyScalar(this.speed * 32 * deltaTime / 1000);
    this.position.add(vec2);
  }

  canDig() {
    let tilePos = this.map.worldToTileXY(this.position.x, this.position.y);
    console.log(`Checking if can dig at ${tilePos.x}, ${tilePos.y}.`);
    return this.map.hasOreAt(tilePos.x, tilePos.y);
  }

  startDigging() {
    this.isDigging = true;
    this.direction.x = 0;
    this.direction.y = 0;
  }

  asJSON() {
    return {
      clientId: this.clientId,
      speed: this.speed,
      position: this.position,
      direction: this.direction,
      isDigging: this.isDigging
    };
  }
}

module.exports = Avatar;
