#!/usr/bin/node --experimental-modules

import EthOSHelperConfig from "./lib/EthOSHelperConfig";
import EthOSWatch from "./lib/EthOSWatch";

const conf = new EthOSHelperConfig().json;
const watch = new EthOSWatch(conf);

if (conf.watch.enable) {
  setTimeout(() => {
    if (conf.verbose) {
      console.log("EthOSHelper watch start");
    }
    watch.start();
  }, (conf.watch.delay || 1) * 1000 * 60);
}

if (conf.verbose) {
  console.log("EthOSHelper start");
}

