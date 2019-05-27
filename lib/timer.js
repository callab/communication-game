class Timer {
  constructor(startTimeMs) {
    this.timeRemaining = startTimeMs;
    this.stopped = false;
  }

  update(deltaTime) {
    if (this.stopped) {
      return;
    }

    if (this.timeRemaining > 0) {
      this.timeRemaining -= deltaTime;
    }
    else {
      this.stopped = true;
    }
  }
}

module.exports = Timer;
