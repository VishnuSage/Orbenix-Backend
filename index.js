const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
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
const profileRoutes = require("./src/routes/profileRoutes");
const { authLimiter, generalLimiter } = require("./src/middleware/rateLimitMiddleware");

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Connect to the database
connectDB();

// FIXED CORS CONFIGURATION
app.use(cors({
  origin: ["https://vis-orbenix.netlify.app", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Allow preflight requests for all routes
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(helmet()); 
app.use(compression());

// ✅ FIXED CONTENT SECURITY POLICY
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: [
        "'self'",
        "https://vis-orbenix.netlify.app",
        "https://orbenix-backend.onrender.com"
      ],
    },
  })
);

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the API!");
});

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running smoothly!" });
});

// Apply rate limiting
app.use("/api/auth", authLimiter);
app.use(generalLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payrolls", payrollRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/time", timeRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/profiles", profileRoutes);

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
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
