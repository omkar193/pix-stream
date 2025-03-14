const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true }, 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, 
    inputUrl: { type: String, required: true },
    outputUrl: { type: String, required: true }, 
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Image", ImageSchema);
