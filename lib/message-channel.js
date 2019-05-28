const Message = require('./message');

class MessageChannel {
  constructor() {
    this.messages = [];
  }

  appendMessage(clientId, content) {
    let indexNumber = this.messages.length();
    let message = new Message(clientId, content, indexNumber);
    this.messages.push(message);
  }

  messagesSince(index) {
    return this.messages.slice(index + 1);
  }
}

module.exports = MessageChannel;
