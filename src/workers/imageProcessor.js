const { Queue, Worker } = require("bullmq");
const axios = require("axios");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv"); 

const Image = require("../models/Image");
const Product = require("../models/Product");
const Request = require("../models/Request");
const redisClient = require("../config/redis");
require("dotenv").config();

const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const csvOutputDir = path.join(__dirname, "../../csv_outputs");
if (!fs.existsSync(csvOutputDir)) {
  fs.mkdirSync(csvOutputDir, { recursive: true });
}

// Upload Image to Cloudinary
async function uploadToCloudinary(imageBuffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image" }, (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      })
      .end(imageBuffer);
  });
}

async function generateCSV(requestId) {
  try {
    const images = await Image.find({ requestId }).lean();
    const products = await Product.find({ requestId }).lean();

    if (images.length === 0 || products.length === 0) {
      console.log(`No data found for request ${requestId}, skipping CSV.`);
      return;
    }

    // Group images by Product ID
    const productMap = {};
    images.forEach((img) => {
      if (!productMap[img.productId]) {
        productMap[img.productId] = { inputUrls: [], outputUrls: [] };
      }
      productMap[img.productId].inputUrls.push(img.inputUrl);
      productMap[img.productId].outputUrls.push(img.outputUrl);
    });

    // Prepare CSV Data
    const csvData = products.map((product, index) => ({
      "S.No": index + 1,
      "Product Name": product.name,
      "Input Image Urls": productMap[product._id]?.inputUrls.join(", ") || "",
      "Output Image Urls": productMap[product._id]?.outputUrls.join(", ") || "",
    }));

    // Convert JSON to CSV
    const fields = ["S.No", "Product Name", "Input Image Urls", "Output Image Urls"];
    const parser = new Parser({ fields, quote: '"' });
    const csv = parser.parse(csvData);

    // Save CSV
    const csvPath = path.join(csvOutputDir, `${requestId}.csv`);
    fs.writeFileSync(csvPath, csv, "utf8");

    console.log(`CSV saved successfully: ${csvPath}`);
  } catch (error) {
    console.error(`Error generating CSV for request ${requestId}:`, error);
  }
}


// Create BullMQ Queue
const imageQueue = new Queue("imageProcessing", {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: true,
  },
});

// Create Worker to Process Images
new Worker(
  "imageProcessing",
  async (job) => {
    const { productId, inputUrl, requestId } = job.data;
    console.log(`Processing Job: ${job.id} for Product: ${productId}`);

    try {
      //  Download and Compress Image
      const imageBuffer = (
        await axios({ url: inputUrl, responseType: "arraybuffer" })
      ).data;
      const compressedImage = await sharp(imageBuffer)
        .jpeg({ quality: 50 })
        .toBuffer();

      // Upload to Cloudinary
      const outputUrl = await uploadToCloudinary(compressedImage);

      await Image.create({ requestId, productId, inputUrl, outputUrl });

      const processedImages = await Image.countDocuments({ requestId });
      const request = await Request.findById(requestId);

      if (!request) {
        console.error(`Request ID ${requestId} not found in database.`);
        return;
      }

      const totalImages = request.totalImages || 0;
      console.log(`Processed ${processedImages}/${totalImages} for request ${requestId}`);

      // Mark Request as Completed
      if (processedImages === totalImages) {
        await Request.findByIdAndUpdate(
          requestId,
          { status: "completed", processedImages, updatedAt: new Date() },
          { new: true }
        );

        console.log(`Request ${requestId} marked as completed`);

        // Send Webhook Notification
        if (WEBHOOK_URL) {
          axios
            .post(WEBHOOK_URL, {
              requestId,
              status: "completed",
              processedImages,
              totalImages,
            })
            .then(() => console.log(`Webhook sent for request ${requestId}`))
            .catch((err) => console.error(`Webhook failed:`, err.message));
        }

        await generateCSV(requestId);
      }

      console.log(`Job ${job.id} Completed: Image Uploaded to ${outputUrl}`);
    } catch (error) {
      console.error(`Error in Job ${job.id}:`, error);
    }
  },
  { connection: redisClient }
);

module.exports = imageQueue;
