# 📌 Image Processing System  
🚀 **Efficiently Process Image Data from CSV Files**  

## 📖 Overview  
This system asynchronously processes images from a CSV file. It:  
- ✔️ Accepts a CSV file with product details & image URLs  
- ✔️ Validates CSV formatting  
- ✔️ Compresses images by 50%  
- ✔️ Uploads processed images to Cloudinary  
- ✔️ Stores product & image details in MongoDB  
- ✔️ Provides APIs to check processing status & download output CSV  

---

## 🌍 **Live Deployment**  
✅ **Base URL:** [https://pix-stream.onrender.com](https://pix-stream.onrender.com)  
✅ **Swagger API Docs:** [https://pix-stream.onrender.com/api-docs](https://pix-stream.onrender.com/api-docs)  

---

## 🛠️ Tech Stack  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Queue Processing:** BullMQ + Redis  
- **Cloud Storage:** Cloudinary  
- **API Documentation:** Swagger (OpenAPI 3.0)  
- **Deployment:** Render  

---

## 🔥 Features  
- ✔️ **Upload CSV** → Submit CSV with product & image URLs  
- ✔️ **Process Images** → Asynchronous image compression & upload  
- ✔️ **Track Status** → Query processing status using `requestId`  
- ✔️ **Download CSV** → Get processed images as a CSV file  
- ✔️ **Webhook Support** → Notify users when processing is done  

---

## 🔧 Installation & Local Setup  

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
**Swagger UI:** [https://pix-stream.onrender.com/api-docs](https://pix-stream.onrender.com/api-docs)  

### 1️⃣ Upload CSV File  
- **Endpoint:** `POST /api/upload`  
- **Request:** Multipart form-data (`file: CSV`)  
- **Response:**  
```json
{
    "requestId": "1acde6c9-9f17-4443-a423-935e9bd91134",
    "processedProducts": 2
}
```

### 2️⃣ Get Processing Status  
- **Endpoint:** `GET /api/status/{requestId}`  
- **Response:**  
```json
{
    "_id": "1acde6c9-9f17-4443-a423-935e9bd91134",
    "status": "completed",
    "totalImages": 4,
    "processedImages": 4,
    "createdAt": "2025-03-14T14:02:15.457Z",
    "updatedAt": "2025-03-14T14:02:25.822Z",
    "__v": 0
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

## 📌 **Postman Collection**  
🔗 **Public Link:** [Postman Collection](https://www.postman.com/maintenance-cosmonaut-16756371/workspace/my-workspace/collection/41544662-45d20e2e-a139-4a5f-865c-9c93b901363d)  

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
│── 📂 docs            # LLD, Workers Documentation, API Docs  
│── 📂 diagrams        # System Design, API Flow, DB Schema  
│── 📂 csv_outputs     # Processed CSV Files  
│── 📂 postman_collection # Public Postman Collection  
```

---

## 🚀 Deployment on Render  
This project is deployed on **Render**.  

### 1️⃣ **Push to GitHub**  
```sh
git add .
git commit -m "Updated README with deployment details"
git push origin master
```

### 2️⃣ **Deploy on Render**  
1. **Go to** [Render](https://dashboard.render.com/)  
2. **Click** `New Web Service` → `Connect GitHub Repository`  
3. **Set Build & Start Commands**  
   - **Build Command:** `npm install`  
   - **Start Command:** `node src/server.js`  
4. **Add Environment Variables** in Render Dashboard  
5. **Click Deploy!**  

---

## 📌 **Supporting Documents (LLD, API Docs, Diagrams, etc.)**  
📂 **Google Drive Folder:**  
🔗 **[All Supporting Docs](https://drive.google.com/drive/folders/1LjStzDNHXKoTnVZsAxXlPscxH-QG10pf?usp=sharing)**  

---
