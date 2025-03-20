const mongoose = require("mongoose")

const matchSchema = new mongoose.Schema({
  team1: {
    type: String,
    required: true,
  },
  team2: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  prediction: {
    team1: Number,
    team2: Number,
  },
  result: {
    winner: String,
    status: {
      type: String,
      enum: ["scheduled", "live", "completed"],
      default: "scheduled",
    },
  },
  weather: {
    condition: String,
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
  },
  pitch: {
    type: String,
    enum: ["batting", "bowling", "balanced"],
  },
  bets: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
      roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
      },
      teamId: String,
      amount: Number,
      status: {
        type: String,
        enum: ["pending", "won", "lost"],
        default: "pending",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
})

module.exports = mongoose.model("Match", matchSchema)

