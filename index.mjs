#!/usr/bin/node --experimental-modules

import path from "path";
import EthOSConfig from "./lib/EthOSConfig";
import EthOSAgent from "./lib/EthOSAgent";
import EthOSWatch from "./lib/EthOSWatch";
import EthOSNightShiftWatch from "./lib/EthOSNightShiftWatch";

// change working dir to /home/ethos/ethos-agent
// because execute from /etc/rc.local
process.chdir( path.parse( process.argv[1] ).dir );

const config = new EthOSConfig();
const agent = new EthOSAgent(config);
const watch = new EthOSWatch(agent);
const night = new EthOSNightShiftWatch(agent);

if (config.watch_enable) {
  console.log("ethos-agent watch enabled");
  setTimeout(() => {
    console.log("ethos-agent watch start");
    watch.start();
  }, config.watch_delay * 1000 * 60);
} else {
  console.log("ethos-agent watch disabled");
}

if (config.nightShift_enable) {
  console.log("ethos-agent night shift watch enabled");
  setTimeout(() => {
    console.log("ethos-agent night shift watch start");
    night.start();
  }, config.nightShift_delay * 1000 * 60);
} else {
  console.log("ethos-agent night shift watch disabled");
}