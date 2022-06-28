const config = require("config");
const express = require("express");
const history = require("connect-history-api-fallback");
const serveStatic = require("serve-static");
const path = require("path");

app = express();
app.use(history());
app.use(serveStatic(path.join(__dirname, "dist")));

const port = process.env.PORT || config.get("server.port");
app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
