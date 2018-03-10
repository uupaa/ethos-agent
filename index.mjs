#!/usr/bin/node --experimental-modules

import EthOSWatch from "./lib/EthOSWatch";

const watch = new EthOSWatch({
  notifyURL: "", // Slack WebHookURL: "https://hooks.slack.com/services/T00000000/B00000000/xxxxxxxxxxxxxxxxxxxxxxxx";
});

setTimeout(() => {
  watch.start();

}, 1000 * 60 * 5); // 5 min after

