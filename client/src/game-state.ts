import { Board } from './board';

export class GameState {
  isCurrent: boolean;
  playerId: number;
  board: Board;

  constructor(jsonObj) {
    this.isCurrent = jsonObj.isCurrent;
    this.playerId = jsonObj.playerId;
    this.board = new Board(jsonObj.board);
  }
}
