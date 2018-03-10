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
      const data = `${new Date().toJSON()}:\n${JSON.stringify(this._status.json, null, 2)}\n${extraData}`;
      fs.writeFileSync(this._log, data, "utf8");
    }
  }
  start() {
    this.stop();
    if (this._tick.interval) {
      this._tick.timerID = setInterval(() => { this._tick.fn() }, this._tick.interval);
      this._ontick();

      // --- debug code ---
      if (this._conf.debug && this._conf.debug.simulate_problem) {
        this.log("simulate problem");
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
      this.log("tick");
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
      const { date, problem, miner_enable, miner_working,
              cpu_temp, gpu_count, gpu_crashed } = this._status.json;
      const items = JSON.stringify({ date, problem, miner_enable, miner_working,
                                     cpu_temp, gpu_count, gpu_crashed }, null, 2);
      const extraMessage = options.test ? "(this is test)" : "";
      const message = `<${json.url}|ethOS has problem (click here)>${extraMessage}: ${items}`;

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
      if (err) { this.log(err.message); }
      this.log(stdout);
    });
  }
}

export default EthOSWatch;
