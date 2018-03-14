import child_process from "child_process";
import SlackIntegration from "./SlackIntegration";
import EthOSStatus from "./EthOSStatus";

export class EthOSAgent {
  constructor(config) {
    this._config = config;
    this._status = new EthOSStatus();
  }
  get config() {
    return this._config;
  }
  updateStatus() { // @ret StatusObject - { url, problem, miner_*, cpu_temp, gpu_* }
    return this._status.update();
  }
  hasProblem(status) { // @ret Boolean
    if (status.miner_enable) {
      if (status.problem) { return true; }
      if (status.cpu_temp > 85) { return true; }
      if (status.gpu_crashed.length) { return true; }
      if (!status.miner_working) { return true; }
    }
    return false;
  }
  async test(options = { notify: false, reboot: false }) {
    if (options.notify) { await this.notify(); }
    if (options.reboot) { await this.reboot(); }
  }
  async notify(test = false) {
    const slack = new SlackIntegration();
    slack.url = this._config.notify_url;

    if (slack.url) {
      const { date, url, rig_name, problem, miner_enable, miner_working,
              cpu_temp, gpu_count, gpu_crashed } = this._status.json;
      const items = JSON.stringify({ date, problem, miner_enable, miner_working,
                                     cpu_temp, gpu_count, gpu_crashed }, null, 2);
      const extraMessage = test ? "(this is test message)" : "";
      const message = `<${url}|${rig_name} problem (click here)>${extraMessage}: ${items}`;

      try {
        const result = await slack.post({ text: message });
        if (this._config.verbose) {
          console.log(result);
        }
      } catch(err) {
        console.error(err.message);
      }
    }
  }
  async reboot() {
    // reboot ethOS
    const exec = child_process.exec;
    exec("/opt/ethos/bin/r", () => {});
  }
}

export default EthOSAgent;
