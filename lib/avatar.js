const Victor = require('victor');
const { KEY_CODES } = require('./client');

class Avatar {
  constructor(clientId) {
    this.clientId = clientId;
    this.speed = 1;
    this.position = Victor(200, 200);
    this.direction = Victor(0, 0);
  }

  handleInput(keys) {
    if (keys[KEY_CODES.LEFT]) {
      this.direction.x = -1;
      this.direction.y = 0;
    }
    else if (keys[KEY_CODES.RIGHT]) {
      this.direction.x = 1;
      this.direction.y = 0;
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

  asJSON() {
    return {
      clientId: this.clientId,
      speed: this.speed,
      position: this.position
    };
  }
}

module.exports = Avatar;
