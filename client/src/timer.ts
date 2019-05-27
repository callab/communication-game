export class Timer {
  timeRemaining: number;
  stopped: boolean;
  listeners: Array<() => void>;

  constructor(startTimeMs) {
    this.timeRemaining = startTimeMs;
    this.listeners = [];
  }

  addListener(listener: () => void) {
    this.listeners.push(listener);
  }

  update(deltaTime) {
    if (this.timeRemaining > 0) {
      this.timeRemaining -= deltaTime;
    }
  }

  updateAuthoritative(timeRemaining) {
    this.timeRemaining = timeRemaining;
    if (this.timeRemaining <= 0 && !this.stopped) {
      this.stopped = true;
      this.notifyListeners();
    }
  }

  clockDigits() {
    if (this.timeRemaining > 0) {
      let seconds = Math.floor(this.timeRemaining / 1000).toString();
      let remainder = this.timeRemaining % 1000;
      let hundredths = Math.floor(remainder / 10).toString();
      return `${this.leftPad(seconds)}:${this.leftPad(hundredths)}`;
    }
    else {
      return '00:00';
    }
  }

  protected notifyListeners() {
    this.listeners.forEach(listener => {
      listener();
    });
  }

  protected leftPad(str) {
    let pad = '00';
    return pad.substring(0, pad.length - str.length) + str;
  }
}
