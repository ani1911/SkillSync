const express = require("express");
const router = express.Router();
const Connection = require("../models/connection");
const Match = require("../models/match");
const { userAuth } = require("../middlewares/auth");
router.post("/connection/send/:userId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;

    if (fromUserId.equals(toUserId)) {
      return res.status(400).send({
        message: "Cannot connect with yourself",
      });
    }

    //  ENSURE USERS ARE MATCHED
    const isMatched = await Match.findOne({
      fromUserId,
      toUserId,
      status: "like",
    });

    const reverseLike = await Match.findOne({
      fromUserId: toUserId,
      toUserId: fromUserId,
      status: "like",
    });

    // if (!isMatched || !reverseLike) {
    //   return res.status(403).send({
    //     message: "Connection allowed only after match",
    //   });
    // }

    //  CHECK REVERSE PENDING REQUEST (EDGE CASE)
    const reverseRequest = await Connection.findOne({
      fromUserId: toUserId,
      toUserId: fromUserId,
      status: "pending",
    });

    if (reverseRequest) {
      reverseRequest.status = "accepted";
      await reverseRequest.save();

      return res.send({
        success: true,
        autoAccepted: true,
        message: "Connection auto-accepted",
      });
    }

    // CHECK IF CONNECTION ALREADY EXISTS
    const existingConnection = await Connection.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnection) {
      return res.status(400).send({
        message: `Connection already ${existingConnection.status}`,
      });
    }

    await Connection.create({
      fromUserId,
      toUserId,
      status: "pending",
    });

    res.send({
      success: true,
      autoAccepted: false,
      message: "Connection request sent",
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to send connection request",
      error: err.message,
    });
  }
});

router.patch("/connection/:action/:requestId", userAuth, async (req, res) => {
  try {
    const action = req.params.action;
    const userId = req.user._id;
    const requestId = req.params.requestId;

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).send({ message: "Invalid action" });
    }

    const connection = await Connection.findOne({
      _id: requestId,
      toUserId: userId,
      status: "pending",
    });

    if (!connection) {
      return res.status(404).send({
        message: "Connection request not found",
      });
    }

    connection.status = action === "accept" ? "accepted" : "rejected";
    await connection.save();

    res.send({
      success: true,
      message: `Connection ${connection.status}`,
    });
  } catch (err) {
    res.status(500).send({
      message: "Failed to update connection",
      error: err.message,
    });
  }
});

module.exports = router;
