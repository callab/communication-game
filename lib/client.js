const KEY_CODES = {
  LEFT: '37',
  UP: '38',
  RIGHT: '39',
  DOWN: '40',
  SPACE: '32'
};

const WS_OPEN = 1;

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

  isOpen() {
    return this.socket.readyState === WS_OPEN;
  }

  sendGameState(state) {
    let msg = JSON.stringify(state);
    this.socket.send(msg);
  }

  kick() {
    this.socket.close();
  }

  handleMessage(msg) {
    let payload = JSON.parse(msg);
    this.input = payload.keys;
  }
}

exports.Client = Client;
exports.KEY_CODES = KEY_CODES;