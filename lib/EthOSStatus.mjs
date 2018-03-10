import fs from "fs";

export class EthOStatus {
  constructor() {
    this._logPath = "./log.txt";
    this._status = {
      url:            "",     // control panel url
      problem:        false,  // has GPU/proxy problem or crashed
      miner_enable:   false,  // `allow` is true, `disallow` is false
      miner_working:  false,  // miner proxy working
      cpu_temp:       0,      // cpu temp number
      gpu_count:      0,      // gpu count
      gpu_crashed:    [],     // crashed gpu ids
    };
  }
  set logPath(path) {        this._logPath = path; }
  get logPath()     { return this._logPath; }
  get state()       { return this._status; }
  log(extraData = "") {
    const data = JSON.stringify(this._status, null, 2) + "\n" + extraData;
    fs.writeFileSync(this._logPath, data, "utf-8");
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
    for (const key in META) {
      const { path, fn } = META[key];
      const bin = fs.readFileSync(path, "utf-8");
      const result = fn(bin);
      this._status[key] = result;
    }
    return this._status;
  }
}

export default EthOStatus;
