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

module.exports = handleJoinGame;
