function handleJoinGame(io, socket, arg) {
  const gameCode = arg.gameCode;

  // Check that the room exists
  const existingRooms = io.sockets.adapter.rooms;
  const roomMembers = existingRooms[gameCode];
  if (roomMembers === undefined) {
    io.to(socket.id).emit("game-not-found");
    console.log(`Client '${socket.id}' attempted to join game '${gameCode}', but no matching room was found.`);
    return;
  }

  // Check that the room has exactly one person in it
  if (roomMembers.size !== 1) {
    io.to(socket.id).emit("game-already-started");
    console.log(`Client '${socket.id}' attempted to join game '${gameCode}', but there were already two players.`);
    return;
  }

  // Leave any existing rooms (except their personal room) and add them to the requested room
  socket.rooms.forEach(room => {
    if (room !== socket.id) {
      socket.leave(room);
    }
  });
  socket.join(gameCode);

  console.log(`Client '${socket.id}' joined room '${gameCode}'.`);

  // Alert both players that the game can start
  io.to(gameCode).emit("game-started");

  console.log(`Game '${gameCode}' started.`);
}

module.exports = handleJoinGame;
