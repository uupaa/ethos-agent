#!/usr/bin/node --experimental-modules

import EthOSConfig from "../lib/EthOSConfig";
import EthOSAgent from "../lib/EthOSAgent";

console.log("ethos-agent reboot test");

new EthOSAgent( new EthOSConfig() ).test({ notify: false, reboot: true });
