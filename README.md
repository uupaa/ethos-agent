# ethOS helper tools

## Prepare

```sh
sudo apt-get-ubuntu install node
mkdir ~/tools
cd ~/tools
git clone https://github.com/uupaa/EthOSHelper.git
cd EthOSHelper
chmod +x index.mjs
```

## Update config file

`ethoshelper.json` is EthOSHelper congiguration file.

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
    "log": "/tmp/ethoshelper.log"
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

+ /usr/bin/node --experimental-modules /home/ethos/tools/EthOSHelper/index.mjs

  exit 0

```
