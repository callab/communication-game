const { Client, KEY_CODES } = require('./client');
const Avatar = require('./avatar');
const Timer = require('./timer');
const MessageChannel = require('./message-channel');

class Game {
  constructor(app, map) {
    this.app = app;
    this.config = app.config.game;
    this.map = map;

    this.clients = [];
    this.avatars = {};
    this.stopped = false;
    this.timer = new Timer(this.config.game_length_ms);

    this.messageChannel = new MessageChannel();
  }

  isFull() {
    return this.clients.length >= this.config.players_per_game;
  }

  start() {
    console.log('Game started!');
    this.lastFrameStartTime = new Date();
    setTimeout(this.update.bind(this), 1000 / this.config.fps);
  }

  addClient(ws) {
    let id = this.clients.length + 1;
    let client = new Client(id, ws);
    this.clients.push(client);

    let avatar = new Avatar(id, this.map, this.config, (clientId, tilePos) => {
      this.handleFinishedDig(clientId, tilePos);
    });
    this.avatars[client.id] = avatar;

    if (this.clients.length === 1) {
      this.start();
    }
  }

  update() {
    let frameStartTime = new Date();
    let delta = frameStartTime - this.lastFrameStartTime;
    this.lastFrameStartTime = frameStartTime;

    this.timer.update(delta);

    this.clients.forEach((client) => {
      this.avatars[client.id].handleInput(client.input);
    });

    this.clients.forEach((client) => {
      this.avatars[client.id].update(delta);
    });

    this.clients.forEach((client) => {
      this.messageChannel.update(client);
    });

    this.clients.forEach((client) => {
      if (client.isOpen()) {
        client.sendGameState(this.asJSON(client));
      }
      else {
        client.kick();
      }
    });

    let now = new Date();
    let frameDuration = now - frameStartTime;

    if (this.clients.some(client => client.isOpen()) && !this.timer.stopped) {
      setTimeout(this.update.bind(this), 1000 / this.config.fps - frameDuration);
    }
    else {
      this.endGame();
    }
  }

  endGame() {
    this.stopped = true;
    this.app.db.recordGame(
      this.finalTeamScore(),
      this.messageChannel.allContent()
    );

    console.log('Game ended.');
  }

  finalTeamScore() {
    return this.clients.reduce((sum, client) => {
      return sum + client.inventory.ores;
    }, 0);
  }

  handleFinishedDig(clientId, tilePos) {
    this.map.removeOreAt(tilePos.x, tilePos.y);
    let client = this.clients.find(client => client.id == clientId);
    client.addOre();
  }

  asJSON(client) {
    return {
      clientId: client.id,
      clients: this.clients.map((client) => client.asJSON()),
      avatars: this.clients.map((client) => this.avatars[client.id].asJSON()),
      timeRemaining: this.timer.timeRemaining,
      map: this.map.asJSON(),
      messages: this.messageChannel.messagesSince(client.lastMessageIndex)
    }
  }
}

module.exports = Game;
