#!/usr/bin/node --experimental-modules

import path from "path";
import EthOSConfig from "./lib/EthOSConfig";
import EthOSAgent from "./lib/EthOSAgent";
import EthOSWatch from "./lib/EthOSWatch";

// change working dir to /home/ethos/ethos-agent
// because execute from /etc/rc.local
process.chdir( path.parse( process.argv[1] ).dir );

const config = new EthOSConfig();
const agent = new EthOSAgent(config);
const watch = new EthOSWatch(agent);

if (config.watch_enable) {
  setTimeout(() => {
    console.log("ethos-agent watch start");
    watch.start();
  }, config.watch_delay * 1000 * 60);
} else {
  console.log("ethos-agent disabled");
}

