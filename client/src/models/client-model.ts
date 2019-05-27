import { InventoryModel } from './inventory-model';

export class ClientModel {
  id: number;
  inventory: InventoryModel;

  constructor(jsonObj) {
    this.id = jsonObj.id;
    this.inventory = new InventoryModel(jsonObj.inventory);
  }
}
