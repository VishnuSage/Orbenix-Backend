// src/middleware/profileValidation.js
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

const validateProfileUpdate = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
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
  validateProfileUpdate,
};
