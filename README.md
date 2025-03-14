---

# 📌 Image Processing System  
🚀 Process CSV-Based Image Data Efficiently  

## 📖 Overview  
This project processes image data from CSV files asynchronously. It:  
✔️ Accepts a CSV file with product details & image URLs  
✔️ Validates CSV formatting  
✔️ Compresses images by 50%  
✔️ Uploads processed images to Cloudinary  
✔️ Stores product & image details in MongoDB  
✔️ Provides APIs to check processing status & download output CSV  

## 🛠️ Tech Stack  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Queue Processing:** BullMQ + Redis  
- **Cloud Storage:** Cloudinary  
- **API Documentation:** Swagger (OpenAPI 3.0)  

## 🔥 Features  
✔️ **Upload CSV** → Submit CSV with product & image URLs  
✔️ **Process Images** → Asynchronous image compression & upload  
✔️ **Track Status** → Query processing status using `requestId`  
✔️ **Download CSV** → Get processed images as a CSV file  
✔️ **Webhook Support** → Notify users when processing is done  

---

## 🔧 Installation & Setup  

### 1️⃣ Clone the Repository  
```sh
git clone https://github.com/omkar193/pix-stream.git
cd pix-stream
```

### 2️⃣ Install Dependencies  
```sh
npm install
```

### 3️⃣ Setup Environment Variables  
Create a `.env` file in the root directory and add:  
```ini
# 🚀 MongoDB Atlas Connection String
MONGO_URI=<your_mongodb_uri>

# 🔑 JWT Secret Key (For Authentication, if needed)
JWT_SECRET=<your_jwt_secret>

# 📌 Server Port
PORT=5000

# 🔵 Redis Connection (For BullMQ Queue)
REDIS_URL=<your_redis_url>

# 🖼️ Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>

# 🌍 Webhook URL (For Notifications)
WEBHOOK_URL=<your_webhook_url>

# ✅ Log Level (For debugging: info, debug, warn, error)
LOG_LEVEL=info
```

### 4️⃣ Start the Application  
```sh
npm start
```

---

## 📌 API Documentation  
🌍 **Live API URL:** [https://pix-stream.onrender.com](https://pix-stream.onrender.com)  
📑 **Swagger UI:** [https://pix-stream.onrender.com/api-docs](https://pix-stream.onrender.com/api-docs)  

### 1️⃣ Upload CSV File  
- **Endpoint:** `POST /api/upload`  
- **Request:** Multipart form-data (`file: CSV`)  
- **Response:**  
```json
{
    "requestId": "abc-123",
    "message": "Processing started."
}
```

### 2️⃣ Get Processing Status  
- **Endpoint:** `GET /api/status/{requestId}`  
- **Response:**  
```json
{
    "status": "completed",
    "totalImages": 5,
    "processedImages": 5
}
```

### 3️⃣ Download Processed CSV  
- **Endpoint:** `GET /api/csv/{requestId}`  
- **Response:** Processed CSV file download  

### 4️⃣ Webhook Notification  
- **Triggered when processing completes**  
- **Payload:**  
```json
{
    "requestId": "abc-123",
    "status": "completed"
}
```

---

## 🛠️ Project Structure  
```yaml
📂 pix-stream  
│── 📜 README.md        # Project Documentation  
│── 📜 swagger.yaml     # OpenAPI Documentation  
│── 📜 .env.example     # Environment Variables Example  
│── 📜 package.json     # Node Dependencies  
│── 📂 src  
│   ├── 📂 routes       # Express API Routes  
│   ├── 📂 models       # Mongoose Schemas  
│   ├── 📂 workers      # BullMQ Worker for Processing  
│   ├── 📜 server.js    # Main Entry Point  
│── 📂 diagrams         # System Design & API Flow  
│── 📂 csv_outputs      # Processed CSV Files  
```

---

## 🚀 Deployment  

### 1️⃣ Push to GitHub  
```sh
git add .
git commit -m "Updated README with live API URL & Swagger UI"
git push origin master
```

### 2️⃣ Deploy on Render / Railway / AWS / Vercel / DigitalOcean  
- **Use MongoDB Atlas** for database  
- **Use Upstash Redis** for BullMQ queues  
- **Add `.env` variables** in the hosting environment  

---

## 🎯 Next Steps  
✅ Ensure all API endpoints work correctly  
✅ Validate `requestId` tracking for async processing  
✅ Optimize error handling & logging  

🚀 **Project is ready for submission!**  

---

### **🔹 What to do now?**
1. **Copy & Replace** this in your `README.md` file.
2. **Commit & Push** the updated file:  
   ```sh
   git add README.md
   git commit -m "Finalized README before submission"
   git push origin master
   ```
3. **Submit the GitHub link** in your assignment form.

Let me know if you need any last-minute changes! 🚀🔥
