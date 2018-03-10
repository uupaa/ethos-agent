import fs from "fs";

export class EthOSHelperConfig {
  constructor() {
    try {
      this._json = JSON.parse( fs.readFileSync("ethoshelper.json", "utf-8") );
    } catch(err) {
      console.error(err.message);
      this._json = EthOSHelperConfig.getDefault();
    }
  }
  get json() {
    return this._json;
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
      }
    };
  }
}

export default EthOSHelperConfig;
