// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

exports.authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.empId = decoded.empId; // Use empId instead of userId
    req.roles = decoded.roles;
    next();
  });
};

exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!req.roles || !roles.some((role) => req.roles.includes(role))) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};
