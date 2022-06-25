const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const handleDisconnect = require("./events/disconnect.js");
const handleCreateGame = require("./events/createGame.js");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  socket.on("create-game", (arg) => handleCreateGame(io, socket, arg));
  socket.on("disconnect", (reason) => handleDisconnect(io, socket, reason));

  console.log(`Client '${socket.id}' connected.`);
});

const port = 3000;
httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}.`)
});
