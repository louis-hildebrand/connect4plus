const config = require("config");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const handleChoosePiece = require("./events/choosePiece.js");
const { handleCreateGame, isGameCode } = require("./events/createGame.js");
const handleDisconnect = require("./events/disconnect.js");
const handleJoinGame = require("./events/joinGame.js");
const handlePlacePiece = require("./events/placePiece.js");
const handleStartGame = require("./events/startGame.js");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// Game state
io.gameState = new Map();

io.of("/").adapter.on("create-room", (room) => {
  if (isGameCode(room)) {
    io.gameState.set(room, {
      started: false
    });
  }
});
io.of("/").adapter.on("join-room", (room, id) => {
  if (isGameCode(room)) {
    const roomMembers = io.sockets.adapter.rooms.get(room);
    if (roomMembers !== undefined && roomMembers.size === 1) {
      io.gameState.get(room).host = id;
    }
  }
});
io.of("/").adapter.on("delete-room", (room) => {
  if (isGameCode(room)) {
    io.gameState.delete(room);
  }
});

// Event handlers
io.on("connection", (socket) => {
  socket.on("choose-piece", (arg) => handleChoosePiece(io, socket, arg));
  socket.on("create-game", (arg, callback) => handleCreateGame(io, socket, arg, callback));
  socket.on("disconnect", (reason) => handleDisconnect(io, socket, reason));
  socket.on("join-game", (arg, callback) => handleJoinGame(io, socket, arg, callback));
  socket.on("place-piece", (arg) => handlePlacePiece(io, socket, arg));
  socket.on("start-game", (arg, callback) => handleStartGame(io, socket, arg, callback));

  console.log(`Client '${socket.id}' connected.`);
});

const port = process.env.PORT || config.get("server.port");
httpServer.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
