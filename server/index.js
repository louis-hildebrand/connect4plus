const io = require("./io.js");

const clientManager = require("./events/clientManager.js");
const roomManager = require("./events/roomManager.js");

// Client events
io.on("connection", (socket) => {
  socket.on("choose-piece", (arg, callback) => clientManager.handleChoosePiece(io, socket, arg, callback));
  socket.on("create-game", (arg, callback) => clientManager.handleCreateGame(io, socket, arg, callback));
  socket.on("disconnect", (reason) => clientManager.handleDisconnect(io, socket, reason));
  socket.on("join-game", (arg, callback) => clientManager.handleJoinGame(io, socket, arg, callback));
  socket.on("place-piece", (arg, callback) => clientManager.handlePlacePiece(io, socket, arg, callback));
  socket.on("start-game", (arg, callback) => clientManager.handleStartGame(io, socket, arg, callback));
});

// Room events
io.of("/").adapter.on("create-room", roomManager.handleCreateRoom);
io.of("/").adapter.on("join-room", roomManager.handleJoinRoom);
io.of("/").adapter.on("delete-room", roomManager.handleDeleteRoom);
