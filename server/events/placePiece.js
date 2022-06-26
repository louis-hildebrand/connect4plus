function handlePlacePiece(io, socket, arg) {
  socket.to(arg.gameCode).emit("piece-placed", arg.piece);

  console.log(`Client '${socket.id}' placed a piece in room '${arg.gameCode}'.`);
}

module.exports = handlePlacePiece;
