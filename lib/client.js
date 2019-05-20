const KEY_CODES = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
};

class Client {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.socket.on('message', this.handleMessage.bind(this));

    this.input = {
      [KEY_CODES.LEFT]: false,
      [KEY_CODES.RIGHT]: false,
      [KEY_CODES.UP]: false,
      [KEY_CODES.DOWN]: false
    };
  }

  send(message) {
    this.socket.send(message);
  }

  kick() {
    this.socket.close();
  }

  handleMessage(msg) {
    let input = JSON.parse(msg);
    this.input = input;
  }
}

exports.Client = Client;
exports.KEY_CODES = KEY_CODES;
