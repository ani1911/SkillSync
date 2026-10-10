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

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chat history", error: err.message });
  }
});

module.exports = router;
