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
  async test(options = { notify: false, reboot: false, nightShift: "" }) {
    if (options.notify) { await this.notify(); }
    if (options.reboot) { await this.reboot(); }
    if (/^(day|night)$/i.test(options.nightShift || "")) {
      await this.shift(options.nightShift.toLowerCase());
    }
  }
  async notify(test = false) {
    const slack = new SlackIntegration();
    slack.url = this._config.notify_url;

    if (slack.url) {
      const { date, url, rig_name, problem, miner_enable, miner_working,
              cpu_temp, gpu_count, gpu_driver, gpu_crashed } = this._status.json;
      const items = JSON.stringify({ date, problem, miner_enable, miner_working,
                                     cpu_temp, gpu_count, gpu_driver, gpu_crashed, test }, null, 2);
      const message = `<${url}|${rig_name} has problem (click here)>: ${items}`;

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
  async shift(mode) { // @arg String - "day" or "night"
    const status = this._status.json;
    const gpu_driver = status.gpu_driver;

    switch (gpu_driver) {
    case "nvidia": break;
    default: console.error(`Sorry, Unsupported GPU driver: ${gpu_driver}`); return;
    }
    if (mode === "day") {
      await this.overclock();
    } else {
      const percent = this._config.nightShift_fan;
      for (let i = 0, iz = status.gpu_count; i < iz; ++i) {
        await this.setFunSpeed(i, percent, gpu_driver);
      }
    }
  }
  overclock() {
    return new Promise((resolve, reject) => {
      const exec = child_process.exec;
      const command = `/usr/bin/sudo /opt/ethos/sbin/ethos-overclock`;
      console.log(command);
      exec(command, (err, stdout, stderr) => {
        if (stderr) {
          reject(stderr);
        } else {
          const kind = stdout.trim();
          if (kind) {
            resolve(stdout);
          }
        }
      });
    });
  }
  setFunSpeed(index, percent) {
    return new Promise((resolve, reject) => {
      const exec = child_process.exec;
      const command = `/usr/bin/sudo /usr/bin/nvidia-settings -a [gpu:${index}]/GPUFanControlState=1 -a [fan:${index}]/GPUTargetFanSpeed="${percent}"`;
      console.log(command);
      exec(command, (err, stdout, stderr) => {
        if (stderr) {
          reject(stderr);
        } else {
          const kind = stdout.trim();
          if (kind) {
            resolve(stdout);
          }
        }
      });
    });
  }
}

export default EthOSAgent;
