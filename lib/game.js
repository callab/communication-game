const { Client, KEY_CODES } = require('./client');
const Avatar = require('./avatar');
const Timer = require('./timer');
const MessageChannel = require('./message-channel');

const FPS = 30;
const GAME_LENGTH_MS = 60 * 1000;

class Game {
  constructor(map) {
    this.map = map;

    this.clients = [];
    this.avatars = {};
    this.stopped = false;
    this.timer = new Timer(GAME_LENGTH_MS);

    this.messageChannel = new MessageChannel();
  }

  start() {
    console.log('Game started!');
    console.log(this.map.draw());
    this.lastFrameStartTime = new Date();
    setTimeout(this.update.bind(this), 1000 / FPS);
  }

  addClient(ws) {
    let id = this.clients.length + 1;
    let client = new Client(id, ws);
    this.clients.push(client);

    let avatar = new Avatar(id, this.map, (clientId, tilePos) => {
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
      setTimeout(this.update.bind(this), 1000 / FPS - frameDuration);
    }
    else {
      this.endGame();
    }
  }

  endGame() {
    this.stopped = true;
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
