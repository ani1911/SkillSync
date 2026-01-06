const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  { timestamps: true }
);

matchSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

module.exports = mongoose.model("Match", matchSchema);
