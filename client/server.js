const history = require("connect-history-api-fallback");
const express = require("express");
const path = require("path");
const serveStatic = require("serve-static");

const config = require("./src/config");

app = express();
app.use(history());
app.use(serveStatic(path.join(__dirname, "dist")));

const port = process.env.PORT || config.port;
app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
