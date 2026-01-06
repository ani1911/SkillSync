const express = require("express");
const router = express.Router();

const Match = require("../models/match");
const { userAuth } = require("../middlewares/auth");

router.post("/match/:action/:userId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const action = req.params.action;

    if (!["like", "dislike"].includes(action)) {
      throw new Error("Invaild action");
    }
    // prevent self-like
    if (fromUserId.equals(toUserId)) {
      res.send({ message: "You cannot perform action on yourself" });
    }

    //create like
    await Match.create({
      fromUserId,
      toUserId,
      status: action,
    });
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
    if (err.code == 11000) {
      return res
        .status(400)
        .send({ message: "you already interacted with this user" });
    }
    res.status(400).send("ERROR : " + err.message);
  }
});

router.get("/match/matches", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const likedByMe = await Match.find({
      fromUserId: userId,
      status: "like",
    }).select("toUserId");

    const likedUserIds = likedByMe.map((doc) => doc.toUserId);

    const likedMe = await Match.find({
      fromUserId: { $in: likedUserIds },
      toUserId: userId,
      status: "like",
    }).populate("fromUserId", "-password");

    const matches = likedMe.map((doc) => doc.fromUserId);

    res.send({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to fetch matches",
      error: err.message,
    });
  }
});

module.exports = router;
