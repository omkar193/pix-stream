// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema({
//     requestId: String,
//     name: String,
// });

// module.exports = mongoose.model("Product", ProductSchema);


const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true }, // ✅ Ensure it links to Request
    name: { type: String, required: true },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], // ✅ Array of Images
  },
  { timestamps: true } // ✅ Added timestamps
);

module.exports = mongoose.model("Product", ProductSchema);
