import fs from "fs";
import child_process from "child_process";
import SlackIntegration from "./SlackIntegration";
import EthOSStatus from "./EthOSStatus";

export class EthOSWatch {
  constructor(conf) {
    this._verbose = conf.verbose || 0;
    this._log = conf.watch.log || ""; // default no log
    this._tick = {
      timerID: 0,
      interval: conf.watch.interval * 60 * 1000, // default 5 min
      fn: this._ontick.bind(this),
    };
    this._status = new EthOSStatus();
    this._slack = new SlackIntegration();
    this._slack.url = conf.notify.url || "";
  }
  log(extraData = "") {
    if (this._log) {
      const data = this._status.string + "\n" + extraData;
      fs.writeFileSync(this._log, data, "utf-8");
    }
  }
  start() {
    this.stop();
    if (this._tick.interval) {
      this._tick.timerID = setInterval(() => { this._tick.fn() }, this._tick.interval);
    }
  }
  stop() {
    if (this._tick.timerID) {
      clearInterval(this._tick.timerID);
      this._tick.timerID = 0;
    }
  }
  _ontick() {
    if (this._verbose) {
      console.log("EthOSWatch:\n" + this._status.string);
    }
    const status = this._status.json;
    if (status.miner_enable) {
      if (status.problem || !status.miner_working ||
          status.gpu_crashed.length || status.cpu_temp > 85) {
        this.stop();
        this._onerror();
      }
    }
  }
  async _onerror() {
    const status = this._status.json;
    const slack = this._slack;

    if (slack.url) {
      const message =
        `<a href="${status.url}">${status.url}</a> has problem. ` +
        `<p>${JSON.stringify(status, null, 2)}</p>`;

      const result = await slack.post({ text: message });
      this.log(result);
    } else {
      this.log();
    }
    const exec = child_process.exec;
    exec("/opt/ethos/bin/r", (err, stdout) => {
      if (err) { console.log(err); }
      console.log(stdout);
    });
  }
}

export default EthOSWatch;
