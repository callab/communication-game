class Message {
  constructor(clientId, content, indexNumber) {
    this.content = content;
    this.clientId = clientId;
    this.indexNumber = indexNumber;
  }
}

module.exports = Message;
