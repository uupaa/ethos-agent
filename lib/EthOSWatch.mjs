import fs from "fs";
import child_process from "child_process";
import SlackIntegration from "./SlackIntegration";
import EthOSHelperConfig from "./EthOSHelperConfig";
import EthOSStatus from "./EthOSStatus";

export class EthOSWatch {
  constructor(conf) {
    this._conf = conf;
    this._verbose = conf.verbose || 0;
    this._log = conf.watch.log || ""; // default no log
    this._tick = {
      timerID: 0,
      interval: (conf.watch.interval || 5) * 60 * 1000, // default 5 min
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
      this._ontick();

      // --- debug code ---
      if (this._conf.debug && this._conf.debug.simulate_problem) {
        console.log("simulate problem");
        this._conf.debug.simulate_problem = false; // flag off
        EthOSHelperConfig.save(this._conf);
        setTimeout(() => {
          this.stop();
          this._onerror({ test: true });
        }, 2000)
      }
    }
  }
  stop() {
    if (this._tick.timerID) {
      clearInterval(this._tick.timerID);
      this._tick.timerID = 0;
    }
  }
  _ontick() {
    const json = this._status.update();
    if (this._verbose) {
      console.log("EthOSWatch:\n" + this._status.string);
    }
    if (json.miner_enable) {
      if (json.problem || !json.miner_working ||
          json.gpu_crashed.length || json.cpu_temp > 85) {
        this.stop();
        this._onerror();
      }
    }
  }
  async _onerror(options = { test: false }) {
    const json = this._status.json;
    const slack = this._slack;

    if (slack.url) {
      const extraMessage = options.test ? "(this is test)" : "";
      const message = `<${json.url}|has problem ${extraMessage}>${this._status.string}`;

      try {
        const result = await slack.post({ text: message });
        this.log(result);
      } catch(err) {
        console.error(err.message);
      }
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
