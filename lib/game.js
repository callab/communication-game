const { Client, KEY_CODES } = require('./client');
const Avatar = require('./avatar');

const FPS = 30;

class Game {
  constructor() {
    this.clients = [];
    this.avatars = {};
  }

  start() {
    console.log('Game started!');
    this.lastFrameStartTime = new Date();
    setTimeout(this.update.bind(this), 1000 / FPS);
  }

  addClient(ws) {
    let id = this.clients.length + 1;
    let client = new Client(id, ws);
    this.clients.push(client);

    let avatar = new Avatar(id);
    this.avatars[client.id] = avatar;

    if (this.clients.length === 1) {
      this.start();
    }
  }

  update() {
    let frameStartTime = new Date();
    let delta = frameStartTime - this.lastFrameStartTime;
    this.lastFrameStartTime = frameStartTime;

    this.clients.forEach((client) => {
      this.avatars[client.id].handleInput(client.input);
    });

    this.clients.forEach((client) => {
      this.avatars[client.id].update(delta);
    });

    this.clients.forEach((client) => {
      client.sendGameState(this.asJSON(client.id));
    });

    let now = new Date();
    let frameDuration = now - frameStartTime;
    setTimeout(this.update.bind(this), 1000 / FPS - frameDuration);
  }

  asJSON(clientId) {
    return {
      clientId: clientId,
      avatars: this.clients.map((client) => this.avatars[client.id].asJSON())
    }
  }
}

module.exports = Game;
