const Message = require('./message');

class MessageChannel {
  constructor() {
    this.messages = [];
  }

  update(client) {
    client.pendingMessages.forEach((msg) => {
      this.appendMessage(client.id, msg);
    });
  }

  appendMessage(clientId, content) {
    let indexNumber = this.messages.length - 1;
    let message = new Message(clientId, content, indexNumber);
    this.messages.push(message);
  }

  messagesSince(index) {
    return this.messages.slice(index + 1);
  }
}

module.exports = MessageChannel;
