import { AvatarModel } from './avatar-model';

export class GameModel {
  clientId: number;
  avatars: AvatarModel[];

  constructor(jsonObj) {
    this.clientId = jsonObj.clientId;
    this.avatars = jsonObj.avatars.map((jsonObj) => new AvatarModel(jsonObj));
  }
}
