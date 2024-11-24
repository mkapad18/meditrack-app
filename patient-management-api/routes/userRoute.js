const express = require('express');
const { registerUser, loginUser, getLoggedinUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const Patient = require('../models/Patient');

const router = express.Router();

// Register routes
router.post('/register', registerUser);

// Get logged-in user
router.post('/getUser', getLoggedinUser);

// Login routes
router.post('/login', loginUser);

// Get patients by userId
router.get('/', async (req, res) => {
    const userId = req.query.userId; // Get userId from query parameters
    try {
        const patients = await Patient.find({ userId }); // Filter patients by userId
        res.json(patients);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;