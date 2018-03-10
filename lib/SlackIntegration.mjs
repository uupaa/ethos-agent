import url from "url";
import https from "https";

export class SlackIntegration {
  constructor() {
    this._url = "";
  }
  set url(url) { // @arg WebHookURL
    this._url = url;
  }
  get url() { // @ret URLString
    return this._url;
  }
  async post(json) { // @arg JSONObject - { text: message }
/*
    const url = this._url;
    const method = "POST";
    const header = {
      "Accept": "application/json",
      "Content-Type": "application/json",
    };
    const body = JSON.stringify(json);
    const resp = await fetch(url, { method, header, body });
    if (resp.ok) {
      return 200;
    }
    return resp.status;
 */
    return new Promise((resolve, reject) => {
      const urls = new url.URL(this._url);
      const body = JSON.stringify(json);
      const options = {
        method: "POST",
        protocol: urls.protocol,
        hostname: urls.hostname,
        port: urls.port,
        path: urls.pathname,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": body.length,
        },
      };
      const req = https.request(options, res => {
        console.log(`response.statusCode: ${res.statusCode}`);
        if (res.ok) {
          resolve(200);
        } else {
          reject(new Error(res.status));
        }
      });
      req.on("error", err => {
        console.error(`Problem with request: ${err.message}`);
      });
      req.write(body);
      req.end();
    });
  }
}

export default SlackIntegration;