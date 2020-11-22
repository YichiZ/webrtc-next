require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, { pingTimeout: 60000 });

const rooms = {};

process.env.DEBUG = "engine,socket.io*";

// This is for 2 people
io.on("connection", (socket) => {
  socket.on("join room", (roomId) => {
    console.log(`join room: id=${socket.id}, roomId=${roomId}`);
    if (rooms[roomId]) {
      rooms[roomId].push(socket.id);
    } else {
      rooms[roomId] = [socket.id];
    }
    const otherSocketId = rooms[roomId].find((id) => id !== socket.id);
    if (otherSocketId) {
      socket.emit("other user", otherSocketId);
      socket.broadcast.emit("user joined", socket.id);
    }
  });

  socket.on("offer", (payload) => {
    console.log(`offer: ${JSON.stringify(payload)}`);
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    console.log(`answer: ${JSON.stringify(payload)}`);
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (payload) => {
    console.log(`ice-candidate: ${JSON.stringify(payload)}`);
    io.to(payload.target).emit("ice-candidate", payload.candidate);
  });

  socket.on("disconnect", (reason) => {
    console.log(`disconnect: ${reason}`);

    rooms[1] = rooms[1]?.filter((id) => id !== socket.id);
  });
});

server.listen(process.env.PORT, () =>
  console.log(`server is running on port ${process.env.PORT}`)
);

// 1. Launch server
// 2. Open client 1 and dev tools
// 3. Open client 2 and dev tools
