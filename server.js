
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productsRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check (does not require database)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AYMAX API is running",
  });
});

// Connect to MongoDB BEFORE handling API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);

    return res.status(503).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// API routes
app.use("/api/products", productsRoutes);
app.use("/api/auth", authRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// Export Express app for Vercel
module.exports = app;

// Local development only
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
