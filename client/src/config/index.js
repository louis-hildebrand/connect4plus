const devConfig = require("./development.js");
const prodConfig = require("./production.js");

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

module.exports = {
  backendUrl: config.backendUrl,
  port: 5001
};
