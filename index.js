const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet"); // Import Helmet
const compression = require("compression");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const employeeRoutes = require("./src/routes/employeeRoutes");
const payrollRoutes = require("./src/routes/payrollRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");
const timeRoutes = require("./src/routes/timeRoutes");
const performanceRoutes = require("./src/routes/performanceRoutes");
const announcementRoutes = require("./src/routes/announcementRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const profileRoutes = require("./src/routes/profileRoutes"); // Import profile routes
const { authLimiter, generalLimiter } = require("./src/middleware/rateLimitMiddleware");

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet()); // Use Helmet for security
app.use(compression()); // Enable gzip compression

// Set Content Security Policy (CSP) with Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
      // Add other directives as needed
    },
  })
);

// Log incoming requests for better debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the API!"); // Simple response
});

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running smoothly!" });
});

// Apply rate limiting
app.use("/api/auth", authLimiter);
app.use(generalLimiter); // General rate limit for all APIs

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payrolls", payrollRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/time", timeRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profiles", profileRoutes); // Add profile routes

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Graceful Shutdown
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle termination signals for graceful shutdown
process.on("SIGINT", () => {
  console.log("Received SIGINT. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
