import { MessageModel } from './models/message-model';
import { MessageLog } from './message-log';

export class MessageUI {
  ui: HTMLElement;
  input: HTMLInputElement;
  onInput: (inputVal) => void = (inputVal) => {};
  lastMessageIndex: number = -1;

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
    p.textContent = message.content;
    log.appendChild(p);
  }

  handleInput(inputVal) {
    this.input.value = '';
    this.onInput(inputVal);
  }

  shutdown() {
    this.ui.classList.add('hidden');
  }
}
