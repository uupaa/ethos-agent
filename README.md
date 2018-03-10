# ethOS helper tools

## Prepare

Download and install [node.js](https://nodejs.org/en/download/current/) (Linux Binaries x64 64-bit version).

```sh
mkdir ~/tools
cd ~/tools
git clone https://github.com/uupaa/EthOSHelper.js.git
cd EthOSHelper.js
chmod +x index.mjs
```

## Update config file

`ethoshelper.json` is EthOSHelper.js congiguration file.

1. Update `watch.delay` and `watch.interval` values.
2. Update `notify.url` value.
    - `notify.url` is slack incoming Webhooks url. https://api.slack.com/incoming-webhooks

```js
{
  "verbose": 0,
  "watch": {
    "enable": true, // watch enable
    "delay": 3,     // watch start minutes (at after OS booted)
    "interval": 5,  // watch interval minutes
    "log": "./log.txt"
  },
  "notify": {
    "type": "slack-webhook",
    "url": ""       // https://hooks.slack.com/services/T00000000/B00000000/xxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

## Register startup code

`sudo vi /etc/rc.local`

```diff
  # bits.
  #
  # By default this script does nothing.

+ /usr/bin/node --experimental-modules /home/ethos/tools/EthOSHelper.js/index.mjs

  exit 0

```
