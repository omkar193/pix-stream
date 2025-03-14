# 📌 Low-Level Design (LLD) - Image Processing System

## **1️⃣ Overview**
The Image Processing System asynchronously processes images uploaded via a CSV file. The system validates input, compresses images, stores them in Cloudinary, tracks processing, and generates an output CSV.

---

## **2️⃣ System Components & Interactions**
### **1. API Gateway (Express.js)**
- Handles incoming requests (`/upload`, `/status`, `/csv`).
- Validates CSV file format.
- Returns a **requestId** to the user.

### **2. MongoDB (Database)**
- Stores **Request, Product, and Image** data.
- Tracks **processing status**.

### **3. BullMQ (Queue + Redis)**
- **Pushes image-processing jobs** to a queue.
- **Workers** consume jobs asynchronously.

### **4. Image Processing Worker**
- Compresses images **by 50%**.
- Uploads images **to Cloudinary**.
- Updates **processing status** in MongoDB.

### **5. Webhook System (Optional)**
- Sends a **notification to users** after processing.

---

## **3️⃣ Data Flow Diagram**
[CSV Upload] → [Validate CSV] → [Store Request] → [Queue Images] → [Worker Processes Images] → [Upload to Cloudinary] → [Update DB] → [Webhook Notification] → [Download Processed CSV]


---

## **4️⃣ Database Schema**
### **1. Request Table**
| Column         | Type      | Description                          |
|---------------|----------|--------------------------------------|
| requestId     | String   | Unique request identifier (Primary Key) |
| status        | Enum     | pending, processing, completed      |
| totalImages   | Integer  | Total number of images in request   |
| processedImages | Integer | Count of processed images          |
| createdAt     | DateTime | Timestamp of request creation       |
| updatedAt     | DateTime | Timestamp of last update            |

### **2. Product Table**
| Column    | Type    | Description                           |
|-----------|--------|---------------------------------------|
| productId | String | Unique product identifier (Primary Key) |
| requestId | String | Foreign Key → `Request.requestId`     |
| name      | String | Name of the product                  |
| createdAt | DateTime | Timestamp of product creation     |
| updatedAt | DateTime | Timestamp of last update          |

### **3. Image Table**
| Column     | Type    | Description                         |
|------------|--------|-------------------------------------|
| imageId    | String | Unique image identifier (Primary Key) |
| productId  | String | Foreign Key → `Product.productId`  |
| requestId  | String | Foreign Key → `Request.requestId`  |
| inputUrl   | String | Original image URL                 |
| outputUrl  | String | Processed image URL                |
| createdAt  | DateTime | Timestamp of image creation      |
| updatedAt  | DateTime | Timestamp of last update         |

✅ **See `diagrams/database_schema.png` for a visual representation**.

---

## **5️⃣ Asynchronous Workers (BullMQ)**
- Worker script **(`src/workers/imageProcessor.js`)** processes images asynchronously.
- Uses **Redis** for queue management.
- **Steps:**
  1. Fetches image-processing jobs from **BullMQ**.
  2. Downloads and **compresses** the image by **50%**.
  3. Uploads the processed image to **Cloudinary**.
  4. Updates the **MongoDB** database with the new URL.
  5. Tracks processing status (`pending → processing → completed`).

✅ **See `docs/asynchronous_workers.md` for detailed worker documentation**.

---

## **6️⃣ API Endpoints**
| Endpoint            | Method | Description                      |
|--------------------|--------|----------------------------------|
| `/upload`         | POST   | Upload CSV & start processing    |
| `/status/{id}`    | GET    | Get processing status            |
| `/csv/{id}`       | GET    | Download processed CSV           |

✅ **See `swagger.yaml` for full API documentation**.

---

## **7️⃣ Deployment & Scaling Considerations**
- **Use Redis & BullMQ** for handling large volumes.
- Store **processed images on Cloudinary/AWS S3**.
- **Webhook for notifications** after processing.
- Deploy using **Render/Vercel/AWS** with MongoDB Atlas.

✅ **See `README.md` for deployment instructions**.

---
