# tools-ethos

tools-ethos is reboots the ethOS when the GPU freezes or something goes wrong. and also notify Slack.

## Prepare

```sh
sudo apt-get-ubuntu install node
cd ~
git clone https://github.com/uupaa/tools-ethos.git
cd tools-ethos
```

## Update config file

`tools-ethos.json` is config file.

You can update `watch.delay`, `watch.interval` and `notify.url` values.

```js
{
  "verbose": 0,     // verbose level (0 is no verbose)
  "watch": {
    "enable": true, // watch enable
    "delay": 3,     // watch start minutes (at after OS booted)
    "interval": 5,  // watch interval minutes
    "log": "/tmp/tools-ethos.log"
  },
  "notify": {
    "type": "slack-webhook",
    "url": ""       // slack incoming Webhooks url. see https://api.slack.com/incoming-webhooks
                    // eg: https://hooks.slack.com/services/T00000000/B00000000/xxxxxxxxxxxxxxxxxxxxxxxx"
  },
  "debug": {
    "simulate_problem": false // reboot and notifications test
  }
}
```

### Self test

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

You can start tools-ethos automatically when ethOS boot up.

`sudo vi /etc/rc.local`

```diff
  # bits.
  #
  # By default this script does nothing.

+ /usr/bin/node --experimental-modules /home/ethos/tools-ethos/index.mjs

  exit 0

```
