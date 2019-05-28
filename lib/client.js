const Inventory = require('./inventory');

const KEY_CODES = {
  LEFT: '37',
  UP: '38',
  RIGHT: '39',
  DOWN: '40',
  FORWARD_SLASH: '191'
};

const WS_OPEN = 1;

class Client {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.socket.on('message', this.handleMessage.bind(this));
    this.lastMessageIndex = 0;
    this.pendingMessages = [];

    this.input = {
      [KEY_CODES.LEFT]: false,
      [KEY_CODES.RIGHT]: false,
      [KEY_CODES.UP]: false,
      [KEY_CODES.DOWN]: false
    };

    this.inventory = new Inventory();
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
    this.lastMessageIndex = payload.messageLog.lastMessageIndex;
    this.pendingMessages = payload.messageLog.pendingMessages;
  }

  addOre() {
    this.inventory.ores += 1;
  }

  asJSON() {
    return {
      id: this.id,
      inventory: this.inventory.asJSON()
    };
  }
}

exports.Client = Client;
exports.KEY_CODES = KEY_CODES;
