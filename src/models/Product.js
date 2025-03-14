const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true }, 
    name: { type: String, required: true },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], 
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Product", ProductSchema);
