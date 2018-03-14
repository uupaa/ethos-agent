export class EthOSWatch {
  constructor(agent) {
    this._agent = agent;
    this._tick = {
      timerID: 0,
      interval: agent.config.watch_interval * 60 * 1000,
      fn: this._ontick.bind(this),
    };
  }
  start() {
    this.stop();
    if (this._tick.interval) {
      this._tick.timerID = setInterval(() => this._tick.fn(), this._tick.interval);
      this._ontick();
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
    const problem = this._agent.hasProblem(status);
    if (problem) {
      this.stop();
      await this._agent.notify();
      await this._agent.reboot();
    }
  }
}

export default EthOSWatch;
