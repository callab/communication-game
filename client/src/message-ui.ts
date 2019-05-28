export class MessageUI {
  input: HTMLInputElement;
  onInput: (inputVal) => void = (inputVal) => {};

  constructor() {
    this.input = document.querySelector('.message-ui input') as HTMLInputElement;
    this.input.addEventListener('keypress', (e) => {
      if (e.key == 'Enter') {
        this.handleInput(this.input.value);
      }
    });
  }

  handleInput(inputVal) {
    this.input.value = '';
    this.onInput(inputVal);
  }
}
