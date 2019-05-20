const { Client, KEY_CODES } = require('./client');
const Avatar = require('./avatar');

const FPS = 1;

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

    let avatar = new Avatar();
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

    let now = new Date();
    let frameDuration = now - frameStartTime;
    setTimeout(this.update.bind(this), 1000 / FPS - frameDuration);
  }
}

module.exports = Game;
