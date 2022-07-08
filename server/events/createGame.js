function randomString(chars, len) {
  var output = "";
  for (let i = 0; i < len; i++) {
    const i = Math.floor(Math.random() * chars.length);
    output += chars[i];
  }
  return output;
}

function newGameCode(disallowed) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  while (true) {
    const gameCode = randomString(chars, 6);
    if (!disallowed.some((x) => x === gameCode)) {
      return gameCode;
    }
  }
}

function handleCreateGame(io, socket, arg, callback) {
  // Leave any existing rooms (except their personal room)
  socket.rooms.forEach(room => {
    if (room !== socket.id) {
      socket.leave(room);
    }
  });

  // Generate new game code
  const existingRooms = Array.from(io.sockets.adapter.rooms.keys());
  const gameCode = newGameCode(existingRooms);
  socket.join(gameCode);

  // Save display name
  socket.displayName = arg.displayName;

  // Let the client know what their game code is
  callback({ gameCode: gameCode });
}

module.exports = handleCreateGame;
