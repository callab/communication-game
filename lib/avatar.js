const Victor = require('victor');
const { KEY_CODES } = require('./client');
const Timer = require('./timer');

const DIGGING_DURATION_MS = 5 * 1000;

class Avatar {
  constructor(clientId, map) {
    this.clientId = clientId;
    this.map = map;
    this.speed = 5;
    this.position = Victor(48, 48); // This is relative to map top-left corner
    this.direction = Victor(0, 0);
    this.diggingTimer = null;
  }

  isDigging() {
    return this.diggingTimer != null;
  }

  handleInput(keys) {
    if (this.isDigging()) {
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
    let vec = this.direction.clone();
    vec.multiplyScalar(this.speed * 32 * deltaTime / 1000);
    vec.add(this.position);

    if (this.map.inBounds(vec.x, vec.y)) {
      this.position = vec;
    }

    if (this.isDigging()) {
      this.diggingTimer.update(deltaTime);

      if (this.diggingTimer.stopped) {
        this.finishDigging();
      }
    }
  }

  canDig() {
    let tilePos = this.map.positionToTileXY(this.position.x, this.position.y);
    return this.map.hasOreAt(tilePos.x, tilePos.y);
  }

  startDigging() {
    this.direction.x = 0;
    this.direction.y = 0;
    this.diggingTimer = new Timer(DIGGING_DURATION_MS);
  }

  finishDigging() {
    let tilePos = this.map.positionToTileXY(this.position.x, this.position.y);
    this.map.removeOreAt(tilePos.x, tilePos.y);
    this.diggingTimer = null;
  }

  asJSON() {
    return {
      clientId: this.clientId,
      speed: this.speed,
      position: this.position,
      direction: this.direction,
      isDigging: this.isDigging()
    };
  }
}

module.exports = Avatar;
