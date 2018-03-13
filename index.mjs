#!/usr/bin/node --experimental-modules

import path from "path";
import EthOSHelperConfig from "./lib/EthOSHelperConfig";
import EthOSWatch from "./lib/EthOSWatch";

// change working dir to /home/ethos/ethos-agent
// because execute from /etc/rc.local
process.chdir( path.parse( process.argv[1] ).dir );

const conf = new EthOSHelperConfig().json;
const watch = new EthOSWatch(conf);

if (conf.watch.enable) {
  setTimeout(() => {
    if (conf.verbose) {
      watch.log("ethos-agent watch start");
    }
    watch.start();
  }, (conf.watch.delay || 1) * 1000 * 60);
}

console.log("ethos-agent start");

