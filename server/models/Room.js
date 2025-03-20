const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
  roomKey: {
    type: String,
    required: true,
    unique: true,
  },
  hostName: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  maxParticipants: {
    type: Number,
    required: true,
  },
  members: [
    {
      name: {
        type: String,
        required: true,
      },
      favoriteTeam: {
        type: String,
        required: true,
      },
      balance: {
        type: Number,
        default: 0,
      },
      isHost: {
        type: Boolean,
        default: false,
      },
    },
  ],
  currentBettor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
  bettingSchedule: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
      date: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Room", roomSchema)

