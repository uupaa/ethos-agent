import fs from "fs";

export class EthOStatus {
  constructor() {
    this._status = {
      date:           "",
      url:            "",     // control panel url
      problem:        false,  // has GPU/proxy problem or crashed
      miner_enable:   false,  // `allow` is true, `disallow` is false
      miner_working:  false,  // miner proxy working
      cpu_temp:       0,      // cpu temp number
      gpu_count:      0,      // gpu count
      gpu_crashed:    [],     // crashed gpu ids
    };
    this.update();
  }
  get json() {
    return this._status;
  }
  get string() {
    return JSON.stringify(this._status, null, 2);
  }
  update() {
    const META = {
      url:            { path: "/var/run/ethos/url.file",          fn: b => b.trim() },
      problem:        { path: "/var/run/ethos/status.file",       fn: b => /(problem|crash)/.test(b) },
      miner_enable:   { path: "/opt/ethos/etc/allow.file",        fn: b => parseInt(b) === 1 },
      miner_working:  { path: "/var/run/ethos/proxy_error.file",  fn: b => b.trim() === "working" },
      cpu_temp:       { path: "/var/run/ethos/cputemp.file",      fn: b => parseInt(b) },
      gpu_count:      { path: "/var/run/ethos/gpucount.file",     fn: b => parseInt(b) },
      gpu_crashed:    { path: "/var/run/ethos/crashed_gpus.file", fn: b => b.trim().length ? b.trim().split(/\s+/).map(n => parseInt(n)) : [] },
    };
    this._status.date = new Date().toUTCString();
    for (const key in META) {
      const { path, fn } = META[key];
      try {
        const bin = fs.readFileSync(path, "utf-8");
        const result = fn(bin);
        this._status[key] = result;
      } catch(err) {
        console.error(err.message);
      }
    }
    return this._status;
  }
}

export default EthOStatus;
