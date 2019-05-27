import { ClientModel } from './client-model';
import { AvatarModel } from './avatar-model';
import { MapModel } from './map-model';

export class GameModel {
  clientId: number;
  clients: ClientModel[];
  avatars: AvatarModel[];
  timeRemaining: number;
  map: MapModel;

  get client() {
    return this.clients.find((client) => client.id == this.clientId);
  }

  constructor(jsonObj) {
    this.clientId = jsonObj.clientId;
    this.clients = jsonObj.clients.map((jsonObj) => {
      return new ClientModel(jsonObj);
    });

    this.avatars = jsonObj.avatars.map((jsonObj) => new AvatarModel(jsonObj));

    this.timeRemaining = jsonObj.timeRemaining;
    this.map = new MapModel(jsonObj.map);
  }
}
