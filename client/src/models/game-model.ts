import { AvatarModel } from './avatar-model';

export class GameModel {
  clientId: number;
  avatars: AvatarModel[];
  timeRemaining: number;

  constructor(jsonObj) {
    this.clientId = jsonObj.clientId;
    this.avatars = jsonObj.avatars.map((jsonObj) => new AvatarModel(jsonObj));
    this.timeRemaining = jsonObj.timeRemaining;
  }
}
