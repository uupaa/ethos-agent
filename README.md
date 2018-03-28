# ethos-agent

The ethOS agent tools. Send a notification to Slack and reboots when GPU crashed.

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

# set your local timezone offset
# show timezone list
$ timedatectl list-timezones
> Africa/Abidjan
> Africa/Accra
>      :

# set your timezone
$ sudo timedatectl set-timezone Asia/Tokyo

# check timezone
$ timedatectl
>       Local time: Tue 2018-03-27 23:51:37 JST 
>   Universal time: Tue 2018-03-27 14:51:37 UTC
>         Timezone: Asia/Tokyo (JST, +0900)
```

# Install

```sh
$ cd ~
$ git clone https://github.com/uupaa/ethos-agent.git
$ cd ethos-agent

# register startup code
# you can start ethos-agent automatically when ethOS boot up

$ crontab .crontab
```

## Update config

`ethos-agent.json` is configuration file.

You can update `notify.url` and `nightShift.fan` values.

```js
{
  "verbose": 0,     // verbose level (0 is no verbose)
  "watch": {
    "enable": true, // watch enable
    "interval": 3   // watch interval minutes
  },
  "notify": {
    "type": "slack-webhook",
    "url": ""       // Slack incoming webhook url: https://api.slack.com/incoming-webhooks
                    // eg: https://hooks.slack.com/services/T00000000/B00000000/xxxxxxxxxxxxxxxxxxxxxxxx"
  },
  "nightShift": {   // can reduce unpleasant fan noise at night time
    "enable": true, // night shift enable
    "fan": 40       // globalfan value at night time
  }
}
```

# Test

Do you not want to test notifications, reboots and night shift?

You can `test/notify.mjs`, `test/reboot.mjs` and `test/nightShift.mjs` script.

```sh
# Slack notify test
$ ./test/notify.mjs

# Reboot test (reboot OS immediately)
$ ./test/reboot.mjs

# Night shift test
$ ./test/nightShift.mjs day
$ ./test/nightShift.mjs night
```

![Slack web-hook example](https://uupaa.github.io/assets/images/ethos-agent/slack-webhook-ss.png)

# Log

`~/ethos-agent/log` is log file.

`$ tail -f ~/ethos-agent/log`

# Uninstall

Remove ethos-agent dir.

`$ rm -rf ~/ethos-agent`

Remove crontab setting.

`$ crontab -e`

```
# @reboot /usr/bin/node --experimental-modules /home/ethos/ethos-agent/index.mjs >> /home/ethos/ethos-agent/log
```

Reboot.

`$ r`
