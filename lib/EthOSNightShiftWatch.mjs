export class EthOSNightShiftWatch {
  constructor(agent) {
    this._agent = agent;
    this._currentMode = ""; // String - "day" or "night"
    this._tick = {
      timerID: 0,
      interval: 3 * 60 * 1000, // 3 min interval
      fn: this._ontick.bind(this),
    };
  }
  start() {
    this.stop();
    if (this._tick.interval) {
      this._tick.timerID = setInterval(() => this._tick.fn(), this._tick.interval);
    }
  }
  stop() {
    if (this._tick.timerID) {
      clearInterval(this._tick.timerID);
      this._tick.timerID = 0;
    }
  }
  async _ontick() {
    const status = this._agent.updateStatus();

    switch (this._currentMode) {
    case "": // at first time
      this._currentMode = status.night ? "night" : "day";
      this._agent.shift(this._currentMode);
      break;
    case "day":
      if ( status.night ) {
        this._currentMode = "night";
        this._agent.shift(this._currentMode);
      }
      break;
    case "night":
      if ( !status.night ) {
        this._currentMode = "day";
        this._agent.shift(this._currentMode);
      }
    }
  }
}

export default EthOSNightShiftWatch;
