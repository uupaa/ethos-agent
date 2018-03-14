# ethos-agent

ethOS agent tools. Send a notification to Slack and reboots when GPU crashed.

# Prepare

Install node.js (if not installed)

```sh
# check installed node.js package
$ dpkg -l | grep node

# install node.js and npm
$ curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
$ sudo apt-get-ubuntu install -y nodejs

# check node.js and npm versions
$ node --version
> v9.8.0

$ npm --version
> 5.6.0
```

# Install

```sh
$ cd ~
$ git clone https://github.com/uupaa/ethos-agent.git
$ cd ethos-agent
```

## Update config

`ethos-agent.json` is configuration file.

You can update `watch.delay`, `watch.interval` and `notify.url` values.

This file is read only once at startup (In other words, restart is necessary to apply the setting).

```js
{
  "verbose": 0,     // verbose level (0 is no verbose)
  "watch": {
    "enable": true, // watch enable
    "delay": 3,     // watch start minutes (at after OS booted)
    "interval": 5   // watch interval minutes
  },
  "notify": {
    "type": "slack-webhook",
    "url": ""       // Slack incoming webhook url: https://api.slack.com/incoming-webhooks
                    // eg: https://hooks.slack.com/services/T00000000/B00000000/xxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

### Test

Do you not want to test notifications and reboots?

You can `test/notify.mjs` and `test/reboot.mjs` script.

```sh
# Slack notify test
$ ./test/notify.mjs

# Reboot test
$ ./test/reboot.mjs
```

Reboot test will restart ethOS immediately. Be careful!

![Slack web-hook example](https://uupaa.github.io/assets/images/ethos-agent/slack-webhook-ss.png)

## Register startup code

You can start ethos-agent automatically when ethOS boot up.

`$ sudo vi /etc/rc.local`

```diff
  # bits.
  #
  # By default this script does nothing.

  # leading `+` is a symbol for diff on description, it's do not need to add it.
+ /usr/bin/node --experimental-modules /home/ethos/ethos-agent/index.mjs

  exit 0
```

# Uninstall

## Unregister startup code

Remove

`$ sudo vi /etc/rc.local`

```diff
  # bits.
  #
  # By default this script does nothing.

- /usr/bin/node --experimental-modules /home/ethos/ethos-agent/index.mjs

  exit 0
```

### Remove ethos-agent dir and reboot

```sh
$ rm -rf ~/ethos-agent
$ r
```
