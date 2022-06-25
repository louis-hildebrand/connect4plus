function handleDisconnect(io, socket, reason) {
  console.log(`Client '${socket.id}' disconnected.`);
  console.log(`    Reason: ${reason}`);
}

module.exports = handleDisconnect;
