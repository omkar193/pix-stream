require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const connectDB = require("./config/db");
const uploadRoutes = require("./routes/upload");
const statusRoutes = require("./routes/status");
const csvRoutes = require("./routes/csv");

const app = express();
const PORT = process.env.PORT || 5000;

const swaggerDocument = YAML.load("./swagger.yaml");

// Middleware
app.use(cors());
app.use(morgan(process.env.LOG_LEVEL || "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
(async () => {
  try {
    await connectDB();
    console.log("Database Connected");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); 
  }
})();

// Serve Swagger API Docs at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api", uploadRoutes);
app.use("/api", statusRoutes);
app.use("/api", csvRoutes);

// Handle Unhandled Routes
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
