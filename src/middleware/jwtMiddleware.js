// src/middleware/jwtMiddleware.js
const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>

  // Check if token is provided
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Attach the decoded user information to the request object
    req.user = {
      empId: decoded.empId,
      roles: decoded.roles,
    };

    // Proceed to the next middleware or route handler
    next();
  });
};

module.exports = jwtMiddleware;