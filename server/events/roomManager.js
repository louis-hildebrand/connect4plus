const utils = require("../utils.js");

function handleCreateRoom(room) {
  if (utils.isGameCode(room)) {
    utils.createGame(room);
  }
}

function handleDeleteRoom(room) {
  if (utils.isGameCode(room)) {
    utils.deleteGame(room);
  }
}

function handleJoinRoom(room, id) {
  if (utils.isGameCode(room)) {
    const roomMembers = utils.getPlayerIds(room);
    if (roomMembers.size === 1) {
      utils.setHost(room, id);
    }
  }
}

module.exports = {
  handleCreateRoom,
  handleDeleteRoom,
  handleJoinRoom
};
