class Player {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
  }

  send(message) {
    this.socket.send(message);
  }

  kick() {
    this.socket.send('Your connection has been closed.');
    this.socket.close();
  }
}

module.exports = Player;
