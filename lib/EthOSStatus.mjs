import fs from "fs";

export class EthOStatus {
  constructor() {
    this._status = {
      date:           "",
      url:            "",     // control panel url
      rig_name:       "",     // "${os-specified-rig-name} ${user-specified-rig-name}" or ""
      problem:        false,  // has GPU/proxy problem or crashed
      miner_enable:   true,   // `allow` is true, `disallow` is false
      miner_working:  true,   // miner proxy working
      cpu_temp:       0,      // cpu temp number
      gpu_count:      0,      // gpu count
      gpu_crashed:    [],     // crashed gpu ids
    };
    this._peek({
      url:            { path: "/var/run/ethos/url.file",          fn: t => t.trim() },
      rig_name:       { path: "/home/ethos/local.conf",           fn: t => t.split("\n").filter(l => /^loc\s+/.test(l.trim())).join().slice(4) },
    });
    this.update();
  }
  get json() {
    return this._status;
  }
  update() {
    this._status.date = new Date().toJSON();
    return this._peek({
      problem:        { path: "/var/run/ethos/status.file",       fn: t => /(problem|crash)/.test(t) },
      miner_enable:   { path: "/opt/ethos/etc/allow.file",        fn: t => parseInt(t) === 1 },
      miner_working:  { path: "/var/run/ethos/proxy_error.file",  fn: t => t.trim() === "working" },
      cpu_temp:       { path: "/var/run/ethos/cputemp.file",      fn: t => parseInt(t) },
      gpu_count:      { path: "/var/run/ethos/gpucount.file",     fn: t => parseInt(t) },
      gpu_crashed:    { path: "/var/run/ethos/crashed_gpus.file", fn: t => t.trim().length ? t.trim().split(/\s+/).map(n => parseInt(n)) : [] },
    });
  }
  _peek(meta) {
    for (const key in meta) {
      const { path, fn } = meta[key];
      try {
        const txt = fs.readFileSync(path, "utf8");
        const result = fn(txt);
        this._status[key] = result;
      } catch(err) {
        //console.error(err.message);
      }
    }
    return this._status;
  }
}

export default EthOStatus;
