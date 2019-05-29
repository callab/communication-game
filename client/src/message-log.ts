import { MessageModel } from './models/message-model';

export class MessageLog {
  messages: MessageModel[] = [];
  pendingMessages: string[] = [];
  allowedWords: Set<string> = new Set<string>();

  get lastMessageIndex() {
    if (this.messages.length > 0) {
      return this.messages[this.messages.length - 1].indexNumber;
    }
    else {
      return -1;
    }
  }

  sendMessage(msg) {
    console.log(`Sending message: ${msg}`);
    this.pendingMessages.push(msg);
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

  fetchAllowedWords(callback) {
    let req = new XMLHttpRequest();
    req.open('GET', '/game/words', true);

    req.onload = () => {
      if (req.status >= 200 && req.status < 400) {
        let data = JSON.parse(req.responseText);
        this.updateAllowedWords(data.words);
        callback(null);
      }
      else {
        callback(`HTTP Status: ${req.status}.`);
      }
    }

    req.onerror = () => {
      callback(`HTTP Status: ${req.status}.`);
    }

    req.send();
  }

  updateAllowedWords(wordList) {
    wordList.forEach((word) => {
      this.allowedWords.add(word);
    });
  }

  asJSON() {
    return {
      lastMessageIndex: this.lastMessageIndex,
      pendingMessages: this.pendingMessages
    };
  }
}
