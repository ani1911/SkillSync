const { Server } = require("socket.io");
const Message = require("../models/message");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New WebSocket Connection Established: ", socket.id);

    socket.on("joinChat", ({ matchId }) => {
      socket.join(matchId);
      console.log(`Socket ${socket.id} joined room: ${matchId}`);
    });

    // Handle receiving a message from a user
    socket.on("sendMessage", async ({ matchId, senderId, text }) => {
      try {
        // 1. Save the message to the database immediately
        const message = await Message.create({
          matchId,
          senderId,
          text,
        });

        // Populate the sender info before broadcasting so the frontend has avatar/name
        const populatedMessage = await message.populate("senderId", "firstName lastName");

        // 2. Broadcast the saved message to everyone in the room
        io.to(matchId).emit("receiveMessage", populatedMessage);
      } catch (err) {
        console.error("Failed to save message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected: ", socket.id);
    });
  });
};

module.exports = { initializeSocket };
