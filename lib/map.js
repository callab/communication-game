const Victor = require('victor');

class Map {
  constructor(mapJsonObj) {
    this.width = mapJsonObj.width;
    this.height = mapJsonObj.height;
    this.tileWidth = mapJsonObj.tileWidth;
    this.tileHeight = mapJsonObj.tileHeight;

    this.state = this.create2DArray(this.width, this.height);
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        this.state[row][col] = mapJsonObj.data[this.width * row + col];
      }
    }
  }

  positionToTileXY(positionX, positionY) {
    let tileX = Math.floor(positionX / this.tileWidth);
    let tileY = Math.floor(positionY / this.tileWidth);
    return new Victor(tileX, tileY);
  }

  hasOreAt(tileX, tileY) {
    return this.state[tileY][tileX] == 1;
  }

  removeOreAt(tileX, tileY) {
    this.state[tileY][tileX] = 0;
  }

  inBounds(positionX, positionY) {
    let answer = true;

    if (positionX < 0 || positionX >= this.width * this.tileWidth) {
      answer = false;
    }

    if (positionY < 0 || positionY >= this.height * this.tileHeight) {
      answer = false;
    }

    return answer;
  }

  // Returns a string representation of the board state
  draw() {
    let str = ''

    for (let row = 0; row < this.height; row++) {
      str += '|'

      for (let col = 0; col < this.width; col++) {
        str += this.state[row][col];
        str += '|';
      }

      str += '\n';
    }

    return str;
  }

  asJSON() {
    return {
      width: this.width,
      height: this.height,
      state: this.state
    }
  }

  create2DArray(width, height) {
    let rows = new Array(height);
    for (let i = 0; i < height; i++) {
      rows[i] = new Array(width).fill(0);
    }

    return rows;
  }
}

module.exports = Map;
