function handleChoosePiece(io, socket, arg) {
  socket.to(arg.gameCode).emit("piece-chosen", arg.piece);

  console.log(`Client '${socket.id}' chose a piece in room '${arg.gameCode}'.`);
}

module.exports = handleChoosePiece;
