const Message = require('./message');

class MessageChannel {
  constructor() {
    this.messages = [];
  }

  lastMessageIndex() {
    if (this.messages.length > 0) {
      return this.messages[this.messages.length - 1].indexNumber;
    }
    else {
      return -1;
    }
  }

  update(client) {
    if (client.lastMessageIndex < this.lastMessageIndex()) {
      // Dont' accept message from clients that aren't up to date yet
      return;
    }

    client.pendingMessages.forEach((msg) => {
      this.appendMessage(client.id, msg);
    });
  }

  appendMessage(clientId, content) {
    let indexNumber = this.messages.length;
    console.log(`Appending message "${content}" with index number: ${indexNumber}.`);
    let message = new Message(clientId, content, indexNumber);
    this.messages.push(message);
  }

  messagesSince(index) {
    return this.messages.slice(index + 1);
  }
}

module.exports = MessageChannel;
