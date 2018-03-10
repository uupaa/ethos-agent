#!/usr/bin/node --exprimental-modules

import fs from "fs";

export class EthOSStatus {
  constructor() {
    this._state = {
      stopped: false,
      detail: {
        miner: "",
        gpu: 0, // crashed gpu id
        allow: false,
      },
    };
  }
  get state() {
    return this._state;
  }
  update() {
    const META = {
      allow: { path: "/opt/ethos/etc/allow.file", fn: (txt) => parseInt(txt) === 0 },
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



