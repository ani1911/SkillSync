const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchId: {
      type: String,
      required: true,
      index: true, // We index this so fetching chat history is extremely fast
    },
    text: {
      type: String,
      required: true,
    },
    isAi: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
