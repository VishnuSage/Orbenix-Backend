// routes/performanceRoutes.js
const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');
const { validatePerformanceData, validateDeletePerformance, validateTrainingDetails, validateTrainingIdParam } = require("../middleware/performanceValidation");
const auditLogger = require("../middleware/auditLogger");

// Fetch all performance data
router.get('/', performanceController.fetchPerformanceData);

// Fetch training data
router.get('/training', performanceController.fetchTrainingData);

// Fetch all employees
router.get('/employees', performanceController.fetchEmployees);

// Fetch performance data by employee
router.get('/:empId', performanceController.fetchPerformanceByEmployee);

// Add performance data
router.post('/', validatePerformanceData, auditLogger('add-performance'), performanceController.addPerformanceData);

// Update performance data
router.put('/', validatePerformanceData, auditLogger('update-performance'), performanceController.updatePerformanceData);

// Delete performance data
router.delete('/:empId/:month', validateDeletePerformance, auditLogger('delete-performance'), performanceController.deletePerformanceData);

// Add training details
router.post('/training', validateTrainingDetails, auditLogger('add-training'), performanceController.addTrainingDetails);

// Update training details
router.put('/training/:trainingId', validateTrainingIdParam, validateTrainingDetails, auditLogger('update-training'), performanceController.updateTrainingDetails);

// Delete training details
router.delete('/training/:trainingId', validateTrainingIdParam, auditLogger('delete-training'), performanceController.deleteTrainingDetails);

module.exports = router;