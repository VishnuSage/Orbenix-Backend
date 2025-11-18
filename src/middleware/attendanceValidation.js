// src/middleware/attendanceValidation.js
const { param, body, validationResult } = require('express-validator');

const validateEmpIdParam = [
  param('empId').notEmpty().withMessage('Employee ID param is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLeaveRequest = [
  param('empId').notEmpty().withMessage('Employee ID param is required'),
  body('leaveType').notEmpty().withMessage('Leave type is required'),
  body('startDate').notEmpty().withMessage('Start date is required'),
  body('endDate').notEmpty().withMessage('End date is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLeaveRequestId = [
  param('empId').notEmpty().withMessage('Employee ID param is required'),
  param('leaveRequestId').notEmpty().withMessage('Leave request ID param is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateEmpIdParam,
  validateLeaveRequest,
  validateLeaveRequestId,
};
