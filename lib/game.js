const Board = require('./board');

class Game {
  constructor(playerOne, playerTwo) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.currentPlayer = playerOne;
    this.board = new Board(4, 4);

    playerOne.socket.on('message', msg => {
      this.handleInput(playerOne, msg);
    });

    playerTwo.socket.on('message', msg => {
      this.handleInput(playerTwo, msg);
    });
  }

  start() {
    this.beginRound();
  }

  beginRound() {
    this.playerOne.send(JSON.stringify(this.asJSON(this.playerOne)));
    this.playerTwo.send(JSON.stringify(this.asJSON(this.playerTwo)));
  }

  handleInput(player, msg) {
    if (player === this.currentPlayer) {
      let move = JSON.parse(msg);
      let x = move.row;
      let y = move.col;
      this.board.scan(x, y, this.currentPlayer.id);

      console.log(this.board.draw());
      console.log();
      this.swapPlayers();
      this.beginRound();
    }
  }

  swapPlayers() {
    if (this.currentPlayer === this.playerOne) {
      this.currentPlayer = this.playerTwo;
    }
    else {
      this.currentPlayer = this.playerOne;
    }
  }

  asJSON(player) {
    let isCurrent = this.currentPlayer === player;

    return {
      isCurrent: isCurrent,
      playerId: player.id,
      board: this.board.asJSON()
    };
  }
}

module.exports = Game;
