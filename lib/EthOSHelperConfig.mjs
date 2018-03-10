import fs from "fs";

export class EthOSHelperConfig {
  constructor() {
    this._json = EthOSHelperConfig.load() || EthOSHelperConfig.getDefault();
  }
  get json() {
    return this._json;
  }
  static load() {
    try {
      return JSON.parse( fs.readFileSync("ethoshelper.json", "utf8") );
    } catch(err) {
      console.error(err.message);
    }
    return null;
  }
  static save(json) {
    const data = JSON.stringify(json, null, 2);
    try {
      fs.writeFileSync("ethoshelper.json", data, "utf8");
    } catch(err) {
      console.error(err.message);
    }
  }
  static getDefault() {
    return {
      "verbose": 0,     // 0 or 1 or 2
      "watch": {
        "enable": true, // watch enable
        "delay": 3,     // watch start minutes (at after OS booted)
        "interval": 5,  // watch interval minutes
        "log": "./log.txt",
      }, 
      "notify": {
        "type": "slack-webhook",
        "url": "",  // "https://hooks.slack.com/services/T00000000/B00000000/xxxxxxxxxxxxxxxxxxxxxxxx"
      },
      "debug": {
        "simulate_problem": false
      }
    };
  }
}

export default EthOSHelperConfig;
