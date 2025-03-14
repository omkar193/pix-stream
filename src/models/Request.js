// const mongoose = require("mongoose");

// const RequestSchema = new mongoose.Schema({
//     _id: String,
//     status: {
//         type: String,
//         enum: ["pending", "processing", "completed"],
//         default: "pending",
//     },
//     createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Request", RequestSchema);


const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed"],
      default: "pending",
    },
    totalImages: { type: Number, default: 0 }, // ✅ Track expected images
    processedImages: { type: Number, default: 0 }, // ✅ Track completed images
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // ✅ Added timestamps
);

module.exports = mongoose.model("Request", RequestSchema);
