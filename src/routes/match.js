const express = require("express");
const router = express.Router();

const Match = require("../models/match");
const { userAuth } = require("../middlewares/auth");

router.post("/match/:action/:userId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const action = req.params.action;

    // Validate action
    if (!["like", "dislike"].includes(action)) {
      return res.status(400).send({ message: "Invalid action" });
    }

    // Prevent self-like
    if (fromUserId.equals(toUserId)) {
      return res.status(400).send({
        message: "You cannot perform action on yourself",
      });
    }

    // Upsert the interaction
    const interaction = await Match.findOneAndUpdate(
      { fromUserId, toUserId },
      { status: action },
      { upsert: true, new: true }
    );

    // Only check match if action is like
    if (action === "like") {
      const reverseLike = await Match.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId,
        status: "like",
      });

      if (reverseLike) {
        return res.send({
          success: true,
          isMatch: true,
          message: "🎉 It's a match!",
        });
      }
    }

    res.send({
      success: true,
      isMatch: false,
      message: `User ${action} successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Failed to perform action",
      error: err.message,
    });
  }
});

module.exports = router;
