// src/middleware/payrollValidation.js
const { body, param, validationResult } = require('express-validator');

const validatePayrollIdParam = [
  param('_id').notEmpty().withMessage('Payroll ID param is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateCreatePayroll = [
  body('empId').notEmpty().withMessage('Employee ID is required'),
  body('salary').isNumeric().withMessage('Salary must be a number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validatePayrollIdParam,
  validateCreatePayroll,
};
