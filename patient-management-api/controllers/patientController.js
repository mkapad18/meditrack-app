const Patient = require('../models/Patient');


const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


 
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const addPatient = async (req, res) => {
  const { name, dob, gender, address, contactNumber, userId } = req.body;
  try {
    const newPatient = new Patient({ name, dob, gender, address, contactNumber, userId });
    await newPatient.save();
    res.json(newPatient);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const updatePatient = async (req, res) => {
  const { name, dob, gender, address, contactNumber } = req.body;
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { name, dob, gender, address, contactNumber },
      { new: true }
    );
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePatientStatus = async (req, res) => {
    const { id } = req.params; // Get patient ID from the URL parameters
    const { status } = req.body; // Expecting new status in the body
    console.log("Received ID:", id, "Received Status:", status); // Log the received values
    try {
        const patient = await Patient.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getCriticalPatients = async (req, res) => {
  console.log("hello")
    const { userId } = req.query; // Get userId from query parameters
    try {
        // Find patients that are critical and belong to the specified user
        console.log("checking userId",userId)
        const criticalPatients = await Patient.find({
            userId: userId,
            status: 'Critical' // Correctly filtering by status
        });
        res.json(criticalPatients);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllPatients, getPatientById, addPatient, updatePatient, deletePatient, updatePatientStatus, getCriticalPatients };
