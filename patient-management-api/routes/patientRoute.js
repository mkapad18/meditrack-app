const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllPatients, getPatientById, addPatient, updatePatient, deletePatient, getCriticalPatients, updatePatientStatus } = require('../controllers/patientController');
const Patient = require('../models/Patient');

// Get all patients for a specific user
router.get('/', async (req, res) => {
    const userId = req.query.userId; // Get userId from query parameters
    console.log("Received userId:", userId); // Log the received userId
    try {
        const patients = await Patient.find({ userId }); // Filter patients by userId
        console.log("Patients found:", patients); // Log the patients found
        res.json(patients);
    } catch (err) {
        console.error("Error fetching patients:", err); // Log the error object
        res.status(500).json({ message: 'Server error' });
    }
});

// Get patient by ID
router.get('/:id', getPatientById);

// Add new patient
router.post('/', addPatient);

// Update patient by ID
router.put('/:id', updatePatient);

// Delete patient by ID
router.delete('/:id', deletePatient);

// Define the route for getting critical patients
router.get('/critical', getCriticalPatients);

// Define the route for updating patient status
router.put('/update-status/:id', updatePatientStatus);

module.exports = router;
