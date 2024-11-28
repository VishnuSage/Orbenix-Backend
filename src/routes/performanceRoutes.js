// routes/performanceRoutes.js
const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');

// Fetch all performance data
router.get('/', performanceController.fetchPerformanceData);

// Fetch training data
router.get('/training', performanceController.fetchTrainingData);

// Fetch all employees
router.get('/employees', performanceController.fetchEmployees);

// Fetch performance data by employee
router.get('/:empId', performanceController.fetchPerformanceByEmployee);

// Add performance data
router.post('/', performanceController.addPerformanceData);

// Update performance data
router.put('/', performanceController.updatePerformanceData);

// Delete performance data
router.delete('/:empId/:month', performanceController.deletePerformanceData);

// Add training details
router.post('/training', performanceController.addTrainingDetails);

// Update training details
router.put('/training/:trainingId', performanceController.updateTrainingDetails);

// Delete training details
router.delete('/training/:trainingId', performanceController.deleteTrainingDetails);

module.exports = router;