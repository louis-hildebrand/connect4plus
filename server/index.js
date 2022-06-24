const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log(`A client connected (${socket.id}).`);

  socket.on("disconnect", (reason) => {
    console.log(`A client disconnected (${socket.id}).`);
    console.log(`    Reason: ${reason}`)
  });
});

const port = 3000;
httpServer.listen(port, () => {
  console.log(`Listening on http://localhost:${port}.`)
});
