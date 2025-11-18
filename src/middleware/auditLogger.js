// src/middleware/auditLogger.js
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../audit.log');

function auditLogger(action) {
  return (req, res, next) => {
    const user = req.user ? req.user.empId : 'anonymous';
    const logEntry = `${new Date().toISOString()} | ${user} | ${action} | ${req.method} ${req.originalUrl}\n`;
    fs.appendFile(logFile, logEntry, err => {
      if (err) console.error('Audit log error:', err);
    });
    next();
  };
}

module.exports = auditLogger;
