import { MessageModel } from './models/message-model';

export class MessageLog {
  messages: MessageModel[] = [];
  pendingMessages: string[] = [];

  get lastMessageIndex() {
    if (this.messages.length > 0) {
      return this.messages[this.messages.length - 1].indexNumber;
    }
    else {
      return -1;
    }
  }

  sendMessage(msg) {
    if (msg && msg.length > 0) {
      console.log(`Sending message: ${msg}`);
      this.pendingMessages.push(msg);
    }
  };

  updateAuthoritative(messages: MessageModel[]) {
    let newMessages = messages.filter((msg) => {
      return msg.indexNumber > this.lastMessageIndex;
    });

    newMessages.forEach((msg) => {
      this.messages.push(msg);

      let index = this.pendingMessages.indexOf(msg.content);
      if (index >= 0) {
        this.pendingMessages.splice(index, 1);
      }
    });
  }

  messagesSince(index) {
    return this.messages.slice(index + 1);
  }

  asJSON() {
    return {
      lastMessageIndex: this.lastMessageIndex,
      pendingMessages: this.pendingMessages
    };
  }
}
