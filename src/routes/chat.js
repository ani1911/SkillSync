const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const { userAuth } = require("../middlewares/auth");

// Fetch chat history for a specific room (matchId)
router.get("/chat/:matchId", userAuth, async (req, res) => {
  try {
    const { matchId } = req.params;

    // Fetch all messages for this matchId and sort by creation time
    const messages = await Message.find({ matchId })
      .populate("senderId", "firstName lastName")
      .sort({ createdAt: 1 });

    // Extract the other user's ID from the matchId to check connection status
    const userIds = matchId.split('_');
    const otherUserId = userIds[0] === req.user._id.toString() ? userIds[1] : userIds[0];

    const Connection = require("../models/connection");
    const connection = await Connection.findOne({
      $or: [
        { fromUserId: req.user._id, toUserId: otherUserId },
        { fromUserId: otherUserId, toUserId: req.user._id },
      ],
    });

    res.status(200).json({
      success: true,
      data: messages,
      connectionStatus: connection ? connection.status : null,
      isSender: connection ? connection.fromUserId.toString() === req.user._id.toString() : false
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chat history", error: err.message });
  }
});

module.exports = router;
