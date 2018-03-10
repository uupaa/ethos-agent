import EthOSStatus from "./EthOSStatus";
import SlackIntegration from "./SlackIntegration";
import child_process from "child_process";

export class EthOSWatch {
  constructor(options = { notifyURL: "" }) {
    this._interval = 3 * 60 * 1000; // 3min
    this._tick = {
      timerID: 0,
      fn: this._ontick.bind(this),
    };
    this._ethos = new EthOSStatus();
    this._slack = new SlackIntegration();
    this._slack.url = options.notifyURL || "";
  }
  set interval(n) {
    if (n < 1 * 60 * 1000) { throw new TypeError(`less then 1 min`); }
    this._interval = n;
  }
  get interval() {
    return this._interval;
  }
  start() {
    this.stop();
    this._tick.timerID = setInterval(() => { this._tick.fn() }, this._interval);
  }
  stop() {
    if (this._tick.timerID) {
      clearInterval(this._tick.timerID);
      this._tick.timerID = 0;
    }
  }
  _ontick() {
    const status = this._ethos.status;
    if (status.miner_enable) {
      if (status.problem || !status.miner_working ||
          status.gpu_crashed.length || status.cpu_temp > 85) {
        this.stop();
        this._onerror();
      }
    }
  }
  async _onerror() {
    const status = this._ethos.status;
    const slack = this._slack;

    if (slack.url) {
      const message =
        `<a href="${status.url}">${status.url}</a> has problem. ` +
        `<p>${JSON.stringify(status, null, 2)}</p>`;

      const result = await slack.post({ text: message });
      status.log(result);
    } else {
      status.log();
    }
    const exec = child_process.exec;
    exec("/opt/ethos/bin/r", (err, stdout) => {
      if (err) { console.log(err); }
      console.log(stdout);
    });
  }
}

export default EthOSWatch;
