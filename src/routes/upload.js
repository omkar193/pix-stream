// const express = require("express");
// const multer = require("multer");
// const csvParser = require("csv-parser");
// const fs = require("fs");
// const { v4: uuidv4 } = require("uuid");

// const Request = require("../models/Request");
// const Product = require("../models/Product");
// const imageQueue = require("../workers/imageProcessor");

// const router = express.Router();

// const upload = multer({
//     storage: multer.diskStorage({}),
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
// });

// router.post("/upload", upload.single("file"), async(req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//     }

//     try {
//         const requestId = uuidv4();
//         await Request.create({ _id: requestId, status: "pending" });

//         const results = [];
//         const promises = [];

//         fs.createReadStream(req.file.path)
//             .pipe(csvParser())
//             .on("data", (row) => {
//                 console.log("📥 Processing row:", row);

//                 const productName = row["Product Name"] ?.trim(); // ✅ Fixed optional chaining
//                 const imageUrls = row["Input Image Urls"] ?.split(",").map((url) => url.trim()); // ✅ Fixed optional chaining

//                 if (!productName || !imageUrls || imageUrls.length === 0) {
//                     console.log("⚠️ Skipping invalid row:", row);
//                     return;
//                 }

//                 const productPromise = Product.create({ requestId, name: productName })
//                     .then((product) => {
//                         const productId = product._id;

//                         imageUrls.forEach((url) => {
//                             imageQueue.add("processImage", { productId, inputUrl: url, requestId });
//                         });

//                         results.push({ productId, imageUrls });
//                     })
//                     .catch((error) => console.error("❌ Error processing row:", error));

//                 promises.push(productPromise);
//             })
//             .on("end", async() => {
//                 await Promise.all(promises);
//                 fs.unlinkSync(req.file.path);
//                 console.log(`✅ Upload Completed: ${results.length} products processed.`);
//                 res.json({ requestId, processedProducts: results.length });
//             });
//     } catch (error) {
//         console.error("❌ Error processing upload:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// module.exports = router;


const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const Request = require("../models/Request");
const Product = require("../models/Product");
const imageQueue = require("../workers/imageProcessor");

const router = express.Router();

// ✅ Configure Multer for File Uploads
const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// ✅ Upload API
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const requestId = uuidv4();
    const results = [];
    let totalImages = 0;

    await Request.create({ _id: requestId, status: "pending", totalImages });

    const promises = [];

    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on("data", (row) => {
        console.log("📥 Processing row:", row);

        const productName = row["Product Name"]?.trim();
        const imageUrls = row["Input Image Urls"]
          ?.split(",")
          .map((url) => url.trim());

        if (!productName || !imageUrls || imageUrls.length === 0) {
          console.log("⚠️ Skipping invalid row:", row);
          return;
        }

        totalImages += imageUrls.length;

        const productPromise = Product.create({ requestId, name: productName })
          .then((product) => {
            const productId = product._id;

            imageUrls.forEach((url) => {
              imageQueue.add("processImage", { productId, inputUrl: url, requestId });
            });

            results.push({ productId, imageUrls });
          })
          .catch((error) => console.error("❌ Error processing row:", error));

        promises.push(productPromise);
      })
      .on("end", async () => {
        await Promise.all(promises);
        await Request.findByIdAndUpdate(requestId, { totalImages });

        fs.unlinkSync(req.file.path);
        console.log(`✅ Upload Completed: ${results.length} products processed.`);
        res.json({ requestId, processedProducts: results.length });
      });
  } catch (error) {
    console.error("❌ Error processing upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
