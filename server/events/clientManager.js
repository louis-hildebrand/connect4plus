const utils = require("../utils.js");

function handleChoosePiece(io, socket, arg, callback) {
  // TODO: Check that the correct player is making the request

  const currentPlayerId = "";

  socket.to(arg.gameCode).emit("piece-chosen", { index: arg.index, currentPlayerId: currentPlayerId });

  callback({ status: 200, index: arg.piece, currentPlayerId: currentPlayerId });
}

function handleCreateGame(io, socket, arg, callback) {
  // Leave any existing rooms (except their personal room)
  socket.rooms.forEach(room => {
    if (room !== socket.id) {
      socket.leave(room);
    }
  });

  // Generate new game code
  const gameCode = utils.generateNewGameCode();
  socket.join(gameCode);

  // Save display name
  socket.displayName = arg.displayName;

  // Let the client know what their game code is
  callback({ status: 200, gameCode: gameCode });
}

function handleDisconnect(io, socket, reason) {
  console.log(`Client '${socket.id}' disconnected.`);
  console.log(`    Reason: ${reason}`);
}

function handleJoinGame(io, socket, arg, callback) {
  const game = io.gameState.get(arg.gameCode);

  // Game exists
  if (game === undefined) {
    callback({ status: 404 });
    return;
  }

  // Game has not yet started
  if (game.started) {
    callback({ status: 409 });
    return;
  }

  socket.displayName = arg.displayName;

  // Leave any existing rooms (except their personal room) and add them to the requested room
  socket.rooms.forEach(room => {
    if (room !== socket.id) {
      socket.leave(room);
    }
  });
  socket.join(arg.gameCode);

  socket.to(arg.gameCode).emit("player-joined", {
    player: { id: socket.id, name: arg.displayName }
  });

  const roomMembers = io.sockets.adapter.rooms.get(arg.gameCode);
  const players = Array.from(roomMembers).map((id) => {
    const name = io.sockets.sockets.get(id).displayName;
    return {id: id, name: name};
  });
  callback({ status: 200, players: players });
}

function handlePlacePiece(io, socket, arg, callback) {
  // TODO: Check that the correct player is making the request

  socket.to(arg.gameCode).emit("piece-placed", { index: arg.index });

  callback({ status: 200, index: arg.index });
}

function handleStartGame(io, socket, arg, callback) {
  // Check that the person starting the game is the host
  if (io.gameState.get(arg.gameCode).host !== socket.id) {
    callback({ status: 403 });
    return;
  }

  // Check that there are at least 2 players
  const roomMembers = io.sockets.adapter.rooms.get(arg.gameCode);
  if (roomMembers.size < 2) {
    callback({ status: 400 });
    return;
  }

  io.gameState.get(arg.gameCode).started = true;

  const currentPlayerId = socket.id;

  socket.to(arg.gameCode).emit("game-started", { currentPlayerId: currentPlayerId });

  callback({ status: 200, currentPlayerId: currentPlayerId });
}

module.exports = {
  handleChoosePiece,
  handleCreateGame,
  handleDisconnect,
  handleJoinGame,
  handlePlacePiece,
  handleStartGame
};
