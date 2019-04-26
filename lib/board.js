class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.state = this.create2DArray(width, height);
  }

  scan(x, y, playerId) {
    this.state[x][y] = playerId;
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

  asJSON() {
    return {
      tiles: this.state,
      width: this.width,
      height: this.height
    };
  }

  create2DArray(width, height) {
    let rows = new Array(width);
    for (let i = 0; i < width; i++) {
      rows[i] = new Array(height).fill(0);
    }

    return rows;
  }
}

module.exports = Board;
