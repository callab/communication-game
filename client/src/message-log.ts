import { MessageModel } from './models/message-model';

export class MessageLog {
  messages: MessageModel[] = [];

  get lastMessageIndex() {
    if (this.messages.length > 0) {
      return this.messages[this.messages.length - 1].indexNumber;
    }
    else {
      return 0;
    }
  }

  updateAuthoritative(messages: MessageModel[]) {
    let newMessages = messages.filter((msg) => {
      return msg.indexNumber > this.lastMessageIndex;
    });

    newMessages.forEach((msg) => {
      this.messages.push(msg);
    });
  }
}
