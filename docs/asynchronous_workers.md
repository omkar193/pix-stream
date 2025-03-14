# 🛠️ Asynchronous Workers Documentation

## Overview  
The system processes images asynchronously using **BullMQ** and **Redis**.  
Workers pick up tasks from the queue, compress images, and upload them to Cloudinary.

---

## 🎯 Workflow  
1️⃣ **Job Enqueue:**  
   - When a CSV file is uploaded, each image URL is added to the BullMQ queue.  
   - The queue stores jobs with unique `requestId`.

2️⃣ **Worker Processing:**  
   - The worker fetches jobs from the queue and processes images.  
   - It compresses each image by **50% quality** before uploading.

3️⃣ **Upload to Cloudinary:**  
   - The worker uploads the processed image to Cloudinary.  
   - The output URL is saved in MongoDB.

4️⃣ **Update Status:**  
   - The database updates `processedImages` count.  
   - When all images are done, the request status updates to `completed`.

5️⃣ **Webhook Notification (If Enabled):**  
   - If a webhook URL is provided, the system notifies upon completion.

---

## ⚡ **BullMQ Queue Setup (`src/config/redis.js`)**  
The **BullMQ queue** is responsible for handling job distribution to workers efficiently.

```javascript
const { Worker, Queue } = require("bullmq");
const Redis = require("ioredis");

const redisConnection = new Redis(process.env.REDIS_URL);

// Create a Queue for Image Processing
const imageQueue = new Queue("image-processing", { connection: redisConnection });

const worker = new Worker(
  "image-processing",
  async (job) => {
    console.log(`Processing job ${job.id}`);
  },
  { connection: redisConnection }
);

module.exports = { imageQueue, worker };

🔧 Worker Code (src/workers/imageProcessor.js)
The worker processes images asynchronously.

javascript
Copy
Edit
const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");
const Image = require("../models/Image");
const Request = require("../models/Request");
const { imageQueue } = require("../config/redis");

imageQueue.process(async (job) => {
  try {
    console.log(`Processing Image: ${job.data.inputUrl}`);

    // Compress image
    const compressedBuffer = await sharp(job.data.inputUrl)
      .jpeg({ quality: 50 })
      .toBuffer();

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload_stream(
      { folder: "processed_images" },
      async (error, result) => {
        if (error) throw error;

        // Update Database
        await Image.findByIdAndUpdate(job.data.imageId, { outputUrl: result.secure_url });

        // Update request progress
        await Request.findByIdAndUpdate(job.data.requestId, { $inc: { processedImages: 1 } });

        console.log(`✅ Image Processed: ${result.secure_url}`);
      }
    );

    uploadResponse.end(compressedBuffer);
  } catch (error) {
    console.error(`❌ Image Processing Error:`, error);
  }
});
🚀 Key Features
✔️ Asynchronous Image Processing
✔️ Redis Queue Management
✔️ Parallel Execution for Faster Performance
✔️ Automatic Database Updates
✔️ Webhook Support for Notifications