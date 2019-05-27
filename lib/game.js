const { Client, KEY_CODES } = require('./client');
const Avatar = require('./avatar');
const Timer = require('./timer');

const FPS = 30;
const GAME_LENGTH_MS = 5 * 1000;

class Game {
  constructor(map) {
    this.map = map;

    this.clients = [];
    this.avatars = {};
    this.stopped = false;
    this.timer = new Timer(GAME_LENGTH_MS);
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

    this.clients.forEach((client) => {
      this.avatars[client.id].handleInput(client.input);
    });

    this.clients.forEach((client) => {
      this.avatars[client.id].update(delta);
    });

    this.clients.forEach((client) => {
      if (client.isOpen()) {
        client.sendGameState(this.asJSON(client.id));
      }
      else {
        client.kick();
      }
    });

    this.timer.update(delta);

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

  asJSON(clientId) {
    let client = this.clients.find(client => client.id == clientId);
    return {
      clientId: clientId,
      client: client.asJSON(),
      avatars: this.clients.map((client) => this.avatars[client.id].asJSON()),
      timeRemaining: this.timer.timeRemaining,
      map: this.map.asJSON()
    }
  }
}

module.exports = Game;
