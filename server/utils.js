const io = require("./io.js");

io.gameState = new Map();

// Private functions
function randomString(chars, len) {
  var output = "";
  for (let i = 0; i < len; i++) {
    const i = Math.floor(Math.random() * chars.length);
    output += chars[i];
  }
  return output;
}

// Public functions
function createGame(gameCode) {
  io.gameState.set(gameCode, {
    started: false
  });
}

function deleteGame(gameCode) {
  io.gameState.delete(gameCode);
}

function isGameCode(input) {
  return input.length === 6;
}

function generateNewGameCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const disallowed = Array.from(io.sockets.adapter.rooms.keys());

  while (true) {
    const gameCode = randomString(chars, 6);
    if (!disallowed.some((x) => x === gameCode)) {
      return gameCode;
    }
  }
}

function getPlayerIds(gameCode) {
  return io.sockets.adapter.rooms.get(gameCode);
}

function setHost(gameCode, playerId) {
  io.gameState.get(gameCode).host = playerId;
}

module.exports = {
  createGame,
  deleteGame,
  getPlayerIds,
  generateNewGameCode,
  isGameCode,
  setHost
};
