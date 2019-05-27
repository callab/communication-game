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

  // Returns a string representation of the board state
  draw() {
    let str = ''

    this.state.forEach(row => {
      str += '|'

      row.forEach(val => {
        str += val;
        str += '|';
      });

      str += '\n';
    });

    return str;
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
