const { Client, KEY_CODES } = require('./client');

class Game {
  constructor() {
    this.clients = [];
  }

  start() {
    setInterval(this.update.bind(this), 1000);
    console.log('Game started!');
  }

  addClient(ws) {
    let id = this.clients.length + 1;
    let client = new Client(id, ws);
    this.clients.push(client);

    if (this.clients.length === 1) {
      this.start();
    }
  }

  update() {
    this.clients.forEach((client, i) => {
      console.log(`Client ${i} input:`);
      console.log(client.input);
    });
  }
}

module.exports = Game;
