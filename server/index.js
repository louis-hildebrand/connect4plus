const config = require("config");
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

// Game state
io.gameState = new Map();
io.of("/").adapter.on("create-room", (room) => {
  io.gameState.set(room, {
    started: false
  });
  console.log(`Room '${room}' created.`);
});
io.of("/").adapter.on("delete-room", (room) => {
  io.gameState.delete(room);
  console.log(`Room '${room}' deleted.`);
});

// Event handlers
io.on("connection", (socket) => {
  socket.on("create-game", (arg, callback) => handleCreateGame(io, socket, arg, callback));
  socket.on("join-game", (arg) => handleJoinGame(io, socket, arg));
  socket.on("choose-piece", (arg) => handleChoosePiece(io, socket, arg));
  socket.on("place-piece", (arg) => handlePlacePiece(io, socket, arg));
  socket.on("disconnect", (reason) => handleDisconnect(io, socket, reason));

  console.log(`Client '${socket.id}' connected.`);
});

const port = process.env.PORT || config.get("server.port");
httpServer.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
