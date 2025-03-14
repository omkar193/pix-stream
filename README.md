📌 Image Processing System
🚀 Process CSV-Based Image Data Efficiently
📖 Overview
This project processes image data from CSV files asynchronously. It:
✔️ Accepts a CSV file with product details & image URLs
✔️ Validates CSV formatting
✔️ Compresses images by 50%
✔️ Uploads processed images to Cloudinary
✔️ Stores product & image details in MongoDB
✔️ Provides APIs to check processing status & download output CSV

🛠️ Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Queue Processing: BullMQ + Redis
Cloud Storage: Cloudinary
API Documentation: Swagger (OpenAPI 3.0)
🔥 Features
✔️ Upload CSV → Submit CSV with product & image URLs
✔️ Process Images → Asynchronous image compression & upload
✔️ Track Status → Query processing status using requestId
✔️ Download CSV → Get processed images as a CSV file
✔️ Webhook Support → Notify users when processing is done

🔧 Installation & Setup
1️⃣ Clone the Repository
sh
Copy
Edit
git clone <your-repo-url>
cd <your-repo-folder>
2️⃣ Install Dependencies
sh
Copy
Edit
npm install
3️⃣ Setup Environment Variables
Create a .env file in the root directory and add:

ini
Copy
Edit
MONGO_URI=<your_mongodb_uri>
REDIS_URL=<your_redis_url>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
WEBHOOK_URL=<your_webhook_url>
PORT=5000
LOG_LEVEL=info
4️⃣ Start the Application
sh
Copy
Edit
npm start
📌 API Documentation
Swagger UI is available at: http://localhost:5000/api-docs

1️⃣ Upload CSV File
Endpoint: POST /api/upload
Request: Multipart form-data (file: CSV)
Response: { "requestId": "abc-123", "message": "Processing started." }
2️⃣ Get Processing Status
Endpoint: GET /api/status/{requestId}
Response: { "status": "completed", "totalImages": 5, "processedImages": 5 }
3️⃣ Download Processed CSV
Endpoint: GET /api/csv/{requestId}
Response: Processed CSV file download
4️⃣ Webhook Notification
Triggered when processing completes
Payload: { "requestId": "abc-123", "status": "completed" }
🛠️ Project Structure
graphql
Copy
Edit
📂 project-root  
│── 📜 README.md        # Project Documentation  
│── 📜 swagger.yaml     # OpenAPI Documentation  
│── 📜 .env.example     # Environment Variables  
│── 📜 package.json     # Node Dependencies  
│── 📂 src  
│   ├── 📂 routes       # Express API Routes  
│   ├── 📂 models       # Mongoose Schemas  
│   ├── 📂 workers      # BullMQ Worker for Processing  
│   ├── 📜 server.js    # Main Entry Point  
│── 📂 diagrams         # System Design & API Flow  
│── 📂 csv_outputs      # Processed CSV Files  
🚀 Deployment
1️⃣ Push to GitHub
sh
Copy
Edit
git add .
git commit -m "Initial Commit"
git push origin main
2️⃣ Deploy on Render / Railway / AWS / Vercel / DigitalOcean
Use MongoDB Atlas for database
Use Upstash Redis for BullMQ queues
Add .env variables in the hosting environment
