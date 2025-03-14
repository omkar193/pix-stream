const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "pending",
    },
    totalImages: { type: Number, default: 0 }, 
    processedImages: { type: Number, default: 0 }, 
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Request", RequestSchema);
