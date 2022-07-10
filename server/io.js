const config = require("config");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || config.get("server.port");
httpServer.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

const io = new Server(httpServer, {
  cors: { origin: "*" }
});

module.exports = io;
