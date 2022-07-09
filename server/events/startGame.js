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

  // Alert other players that the game is starting
  socket.to(arg.gameCode).emit("game-started");

  callback({ status: 200 });
}

module.exports = handleStartGame;
