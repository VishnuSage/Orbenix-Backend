// src/middleware/performanceValidation.js
const { body, param, validationResult } = require('express-validator');

const validatePerformanceData = [
  body('empId').notEmpty().withMessage('Employee ID is required'),
  body('month').notEmpty().withMessage('Month is required'),
  body('performance').isNumeric().withMessage('Performance must be a number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateDeletePerformance = [
  param('empId').notEmpty().withMessage('Employee ID param is required'),
  param('month').notEmpty().withMessage('Month param is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateTrainingDetails = [
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('instructor').notEmpty().withMessage('Instructor is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateTrainingIdParam = [
  param('trainingId').notEmpty().withMessage('Training ID param is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validatePerformanceData,
  validateDeletePerformance,
  validateTrainingDetails,
  validateTrainingIdParam,
};
