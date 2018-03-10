#!/usr/bin/node --experimental-modules

import fs from "fs";

export class EthOSStatus {
  constructor() {
    this._state = {
      stopped: false,
      detail: {
        url:          "",     // control panel url
        problem:      false,  // has problem
        miner_enable: false,  // `allow` is true, `disallow` is false
        miner_proxy:  false,  // miner proxy has error -> false
        cpu_temp:     0,      // cpu temp number
        gpu_count:    0,      // gpu count
        gpu_crashed:  [],     // crashed gpu ids
      },
    };
  }
  get state() {
    return this._state;
  }
  update() {
    const META = {
      url:          { path: "/var/run/ethos/url.file",          fn: b => b.trim() },
      problem:      { path: "/var/run/ethos/status.file",       fn: b => /problem/.test(b) },
      miner_enable: { path: "/opt/ethos/etc/allow.file",        fn: b => parseInt(b) === 1 },
      miner_proxy:  { path: "/var/run/ethos/proxy_error.file",  fn: b => b.trim() === "working" },
      cpu_temp:     { path: "/var/run/ethos/cputemp.file",      fn: b => parseInt(b) },
      gpu_count:    { path: "/var/run/ethos/gpucount.file",     fn: b => parseInt(b) },
      gpu_crashed:  { path: "/var/run/ethos/crashed_gpus.file", fn: b => b.trim().length ? b.trim().split(/\s+/).map(n => parseInt(n)) : [] },
    };
    for (const key in META) {
      const { path, fn } = META[key];
      const bin = fs.readFileSync(path, "utf-8");
      const result = fn(bin);
      this._state.detail[key] = result;
    }
    return this._state;
  }
}

const ethos = new EthOSStatus();

console.log(ethos.update());
