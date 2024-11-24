const express = require('express');
const router = express.Router();
const { getTestsByPatientId, addTest, getAllCriticalPatients, editTest } = require('../controllers/testController');

// Get all tests for a specific patient
router.get('/:patientId/tests', getTestsByPatientId);

// Add a new test for a specific patient
router.post('/:patientId/tests', addTest);

// Get all critical tests for patients
router.get('/critical', getAllCriticalPatients);

// Edit a test by ID
router.put('/:testId', editTest);

module.exports = router;
