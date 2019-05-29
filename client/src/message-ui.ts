import { MessageModel } from './models/message-model';
import { MessageLog } from './message-log';

const CENSOR_PLACEHOLDER = '****';

export class MessageUI {
  ui: HTMLElement;
  input: HTMLInputElement;
  onInput: (inputVal) => void = (inputVal) => {};
  lastMessageIndex: number = -1;
  allowedWords: Set<string> = new Set<string>();

  constructor() {
    this.ui = document.querySelector('.message-ui');
    this.ui.classList.remove('hidden');

    this.input = document.querySelector('.message-ui input') as HTMLInputElement;
    this.input.addEventListener('keypress', (e) => {
      if (e.key == 'Enter') {
        this.handleInput(this.input.value);
      }
    });

    this.input.value = '';
    this.updateAllowedWords((window as any).allowedWords);
  }

  update(messageLog: MessageLog) {
    let newMessages = messageLog.messagesSince(this.lastMessageIndex);

    newMessages.forEach((msg) => {
      this.appendMessage(msg);
    });

    if (newMessages.length > 0) {
      let lastMessage = newMessages[newMessages.length - 1];
      this.lastMessageIndex = lastMessage.indexNumber;
    }
  }

  appendMessage(message: MessageModel) {
    let log = this.ui.querySelector('.log');
    let p = document.createElement('p');
    p.textContent = this.censor(message.content);
    p.classList.add('client-id-' + message.clientId);
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  handleInput(inputVal) {
    this.input.value = '';
    this.onInput(inputVal);
  }

  updateAllowedWords(wordList) {
    wordList.forEach((word) => {
      this.allowedWords.add(word);
    });
  }

  // Replaces disallowed words with ****
  censor(message: string) {
    let regex = /[\w']+/g;
    let badWords = [];
    let result = [];

    while ((result = regex.exec(message)) !== null) {
      let word = result[0];
      if (!this.allowedWords.has(word)) {
        badWords.push(word);
      }
    }

    if (badWords.length > 0) {
      let badWordRegex = new RegExp(badWords.join('|'), 'g');
      return message.replace(badWordRegex, CENSOR_PLACEHOLDER);
    }
    else {
      return message;
    }
  }

  shutdown() {
    this.ui.classList.add('hidden');
  }
}
