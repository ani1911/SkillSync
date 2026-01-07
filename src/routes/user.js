const express = require("express");
const router = express.Router();
const Connection = require("../models/connection");
const Match = require("../models/match");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

//get all the pending connection request for the loggedIn user
router.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Connection.find({
      toUserId: userId,
      status: "pending",
    }).populate("fromUserId", "-password -emailId");

    res.send({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//get the all matches of users
router.get("/user/matches", userAuth, async (req, res) => {
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
    }).populate("fromUserId", "-password -emailId");

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

//get the all connection of users
router.get("/user/connectionlist", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const connections = await Connection.find({
      status: "accepted",
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    }).populate("fromUserId toUserId", "-password -emailId");

    const formattedConnections = connections.map((key) => {
      const otherUser = key.fromUserId._id.equals(userId)
        ? key.toUserId
        : key.fromUserId;
      return {
        _id: key._id,
        user: otherUser,
        createdAt: key.createdAt,
        updatedAt: key.updatedAt,
      };
    });
    res.send({
      success: true,
      count: formattedConnections.length,
      data: formattedConnections,
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to fetch connections",
      error: err.message,
    });
  }
});

//get the feed

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const interaction = await Match.find({
      fromUserId: userId,
    }).select("toUserId");

    const interactedUserIds = interaction.map((k) => k.toUserId);

    const connections = await Connection.find({
      status: { $in: ["accepted", "rejected"] },
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    });

    const connectionUserIds = connections.map((conn) =>
      conn.fromUserId.equals(userId) ? conn.toUserId : conn.fromUserId
    );

    const excludeUsers = [userId, ...interactedUserIds, ...connectionUserIds];

    const filter = {
      _id: { $nin: excludeUsers },
      isActive: true,
    };

    const users = await User.find(filter)
      .select("firstName lastName photourl headline skills experienceLevel")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      page,
      count: users.length,
      feed: users,
    });
  } catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
});

module.exports = router;
