# ethOS helper tools

EthOSHelper reboots the ethOS when the GPU freezes or something goes wrong. and also notify Slack.

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

`ethoshelper.json` is config file.

You can update `watch.delay` and `watch.interval` values.
and update `notify.url` value (`notify.url` is slack incoming Webhooks url. see: https://api.slack.com/incoming-webhooks)

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
  },
  "debug": {
    "simulate_problem": false // reboot and notifications test
  }
}
```

## Self test

Do you not want to test reboots and notifications?
You can the `debug.simulate_problem` value set to `true`.
Before rebooting, this setting is automatically turned off.

```js
{
  "debug": {
    "simulate_problem": true
  }
}
```

## Register startup code

You can start EthOSHelper automatically when ethOS boot up.

`sudo vi /etc/rc.local`

```diff
  # bits.
  #
  # By default this script does nothing.

+ /usr/bin/node --experimental-modules /home/ethos/tools/EthOSHelper/index.mjs

  exit 0

```
