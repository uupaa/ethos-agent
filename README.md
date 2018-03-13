# ethos-agent

ethOS agent tools. Send a notification to Slack and reboots when GPU crashed.

# Prepare

Install node.js (if not installed)

```sh
# check installed node.js package
dpkg -l | grep node

# install node.js and npm
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get-ubuntu install -y nodejs

# check node.js and npm versions
node --version
> v9.8.0

npm --version
> 5.6.0
```

# Install

```sh
cd ~
git clone https://github.com/uupaa/ethos-agent.git
cd ethos-agent
```

## Update config

`ethos-agent.json` is config file.

You can update `watch.delay`, `watch.interval` and `notify.url` values.

```js
{
  "verbose": 0,     // verbose level (0 is no verbose)
  "watch": {
    "enable": true, // watch enable
    "delay": 3,     // watch start minutes (at after OS booted)
    "interval": 5,  // watch interval minutes
    "log": "/tmp/ethos-agent.log"
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

![Slack web-hook example](https://uupaa.github.io/assets/images/ethos-agent/slack-webhook-ss.png)

## Register startup code

You can start ethos-agent automatically when ethOS boot up.

`sudo vi /etc/rc.local`

```diff
  # bits.
  #
  # By default this script does nothing.

+ /usr/bin/node --experimental-modules /home/ethos/ethos-agent/index.mjs

  exit 0
```

# Uninstall

## Unregister startup code

`sudo vi /etc/rc.local`

```diff
  # bits.
  #
  # By default this script does nothing.

- /usr/bin/node --experimental-modules /home/ethos/ethos-agent/index.mjs

  exit 0
```

## Remove ethos-agent dir and reboot

```sh
rm -rf ~/ethos-agent
r
```
