export class MessageUI {
  ui: HTMLElement;
  input: HTMLInputElement;
  onInput: (inputVal) => void = (inputVal) => {};

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

  handleInput(inputVal) {
    this.input.value = '';
    this.onInput(inputVal);
  }

  shutdown() {
    this.ui.classList.add('hidden');
  }
}
