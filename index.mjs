#!/usr/bin/node --experimental-modules

import path from "path";
import EthOSHelperConfig from "./lib/EthOSHelperConfig";
import EthOSWatch from "./lib/EthOSWatch";

// change working dir to /home/ethos/tools/EthOSHelper.js
// because execute from rc.local
process.chdir( path.parse( process.argv[1] ).dir );

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

