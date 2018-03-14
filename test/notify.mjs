#!/usr/bin/node --experimental-modules

import EthOSConfig from "./lib/EthOSConfig";
import EthOSAgent from "./lib/EthOSAgent";

console.log("ethos-agent notify test");

new EthOSAgent( new EthOSConfig() ).test({ notify: true, reboot: false });
