export class Board {
  width: number;
  height: number;
  tiles: number[][];

  constructor(jsonObj) {
    this.width = jsonObj.width;
    this.height = jsonObj.height;
    this.tiles = jsonObj.tiles;
  }
}
