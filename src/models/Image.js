const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true }, // ✅ Added reference to Request
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // ✅ Added reference to Product
    inputUrl: { type: String, required: true },
    outputUrl: { type: String, required: true }, // Stores Cloudinary URL instead of mock storage
  },
  { timestamps: true } // ✅ Added timestamps
);

module.exports = mongoose.model("Image", ImageSchema);
