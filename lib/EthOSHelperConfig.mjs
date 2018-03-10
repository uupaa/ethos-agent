import fs from "fs";

export class EthOSHelperConfig {
  constructor() {
    this._json = this.load() || EthOSHelperConfig.getDefault();
  }
  get json() {
    return this._json;
  }
  load() {
    try {
      return JSON.parse( fs.readFileSync("ethoshelper.json", "utf-8") );
    } catch(err) {
      console.error(err.message);
    }
    return null;
  }
  save() {
    const data = JSON.stringify(this._json, null, 2);
    try {
      fs.writeFileSync(data, "ethoshelper.json", "utf-8");
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
