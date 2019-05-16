import { GameState } from './game-state';

export class Socket {
  ws: WebSocket;

  // Initialize these as no-ops.
  onOpen: () => void = () => {};
  onUpdate: (state: GameState) => void = () => {};
  onClose: () => void = () => {};

  constructor(path: string) {
    let host = window.location.host;
    this.ws = new WebSocket(`ws://${host}${path}`);

    this.ws.onopen = this.handleOnOpen;
    this.ws.onmessage = this.handleOnMessage;
    this.ws.onclose = this.handleOnClose;

    this.setStatus('Connecting...');
  }

  send(message: string) {
    console.log("Sending data:");
    console.log(message);
    this.ws.send(message);
  }

  // These handler functions need to be written this way so that "this" points
  // to the object instance. Sad!
  handleOnOpen = (ev: Event) => {
    this.setStatus('Connected.');
    this.onOpen();
  }

  handleOnMessage = (ev: MessageEvent) => {
    //console.log('Data received:');
    //console.log(ev.data);

    let message = ev.data.trim();
    if (message.length > 0) {
      let jsonObj = null;

      try {
        jsonObj = JSON.parse(message);
      }
      catch (e) {
        return;
      }

      let state = new GameState(jsonObj);
      this.onUpdate(state);
    }
  }

  handleOnClose = (ev: Event) => {
    this.setStatus('Connection closed.');
    this.onClose();
  }

  setStatus(statusMessage) {
    let el = document.querySelector('.message');
    el.textContent = statusMessage;
  }
}
