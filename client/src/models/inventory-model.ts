export class InventoryModel {
  ores: number;

  constructor(jsonObj) {
    this.ores = jsonObj.ores;
  }
}
