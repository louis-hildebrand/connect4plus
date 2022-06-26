const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const handleChoosePiece = require("./events/choosePiece.js");
const handleCreateGame = require("./events/createGame.js");
const handleDisconnect = require("./events/disconnect.js");
const handleJoinGame = require("./events/joinGame.js");
const handlePlacePiece = require("./events/placePiece.js");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  socket.on("create-game", (arg) => handleCreateGame(io, socket, arg));
  socket.on("join-game", (arg) => handleJoinGame(io, socket, arg));
  socket.on("choose-piece", (arg) => handleChoosePiece(io, socket, arg));
  socket.on("place-piece", (arg) => handlePlacePiece(io, socket, arg));
  socket.on("disconnect", (reason) => handleDisconnect(io, socket, reason));

  console.log(`Client '${socket.id}' connected.`);
});

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
