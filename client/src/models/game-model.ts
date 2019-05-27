import { AvatarModel } from './avatar-model';
import { MapModel } from './map-model';

export class GameModel {
  clientId: number;
  avatars: AvatarModel[];
  timeRemaining: number;
  map: MapModel;

  constructor(jsonObj) {
    this.clientId = jsonObj.clientId;
    this.avatars = jsonObj.avatars.map((jsonObj) => new AvatarModel(jsonObj));
    this.timeRemaining = jsonObj.timeRemaining;
    this.map = new MapModel(jsonObj.map);
  }
}
