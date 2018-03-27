#!/usr/bin/node --experimental-modules

import EthOSConfig from "../lib/EthOSConfig";
import EthOSAgent from "../lib/EthOSAgent";

console.log("ethos-agent night shift test");

const mode = process.argv[2] || "night"; // "day" or "night"

new EthOSAgent( new EthOSConfig() ).test({ nightShift: mode });
