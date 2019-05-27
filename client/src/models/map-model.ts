export class MapModel {
  width: number;
  height: number;
  state: number[][];

  constructor(jsonObj) {
    this.width = jsonObj.width;
    this.height = jsonObj.height;
    this.state = jsonObj.state;
  }
}
