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

        // 2. Broadcast the user's message to everyone in the room immediately
        io.to(matchId).emit("receiveMessage", populatedMessage);

        // 3. AI Interception Logic!
        if (text.trim().toLowerCase().startsWith("@ai")) {
          // Import our AI utility (we put the import here or at the top of the file)
          const { generateAiResponse } = require("./ai");
          const Connection = require("../models/connection");

          // Extract the OTHER user's ID from the matchId to check connection status
          const userIds = matchId.split('_');
          const otherUserId = userIds[0] === senderId.toString() ? userIds[1] : userIds[0];

          // Check if they are actually a Premium Connection (accepted)
          const connection = await Connection.findOne({
            status: "accepted",
            $or: [
              { fromUserId: senderId, toUserId: otherUserId },
              { fromUserId: otherUserId, toUserId: senderId },
            ],
          });

          if (connection) {
            // Get the last 3 messages for strict token-saving context
            const previousMessages = await Message.find({ matchId })
              .populate("senderId", "firstName lastName")
              .sort({ createdAt: -1 })
              .limit(3);

            // Our DB sorts them descending (newest first), so reverse them for chronological context
            const chronologicalMessages = previousMessages.reverse();

            // Ask Gemini for an answer!
            const aiResponseText = await generateAiResponse(chronologicalMessages, text);

            // Save the AI's response to the database
            const aiMessage = await Message.create({
              matchId,
              senderId: senderId, // We map it to the user who asked, but flag it as AI
              text: aiResponseText,
              isAi: true,
            });

            // Populate the AI message
            const populatedAiMessage = await aiMessage.populate("senderId", "firstName lastName");

            // Broadcast the AI response to the room!
            io.to(matchId).emit("receiveMessage", populatedAiMessage);
          } else {
             // Optional: If you want the AI to complain they aren't premium
             // We can skip this so it silently ignores @ai in limited mode
             console.log("Ignored @ai command: Users do not have an accepted premium connection.");
          }
        }
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
