const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Test = require('../models/Test');


const getTestsByPatientId = async (req, res) => {
  const { patientId } = req.params;
  try {
    const tests = await Test.find({ patientId });
    res.json(tests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const addTest = async (req, res) => {
  try {
    const { patientId, dataType, reading, testDate } = req.body;

    // Log the received data
    console.log("Received data:", { patientId, dataType, reading, testDate });

    // Validate input
    if (!patientId || !dataType || reading === undefined || !testDate) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Convert reading to a number
    const readingValue = parseFloat(reading);
    console.log("Parsed reading value:", readingValue);

    // Fetch the patient to get the userId
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Determine if the reading is in a critical range
    let criticalFlag = false;
    if (
      (dataType === 'Blood Pressure' && (readingValue < 50 || readingValue > 160)) ||
      (dataType === 'Respiratory Rate' && (readingValue < 12 || readingValue > 25)) ||
      (dataType === 'Blood Oxygen Level' && readingValue < 90) ||
      (dataType === 'Heartbeat Rate' && (readingValue < 40 || readingValue > 120))
    ) {
      criticalFlag = true;
    }

    // Create a new test instance
    const newTest = new Test({
      patientId,
      userId: patient.userId, // Include the userId from the patient
      dataType,
      reading: readingValue,
      testDate,
      criticalFlag,
    });

    // Save the test to the database
    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  } catch (err) {
    console.error("Error in addTest:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllCriticalPatients = async (req, res) => {
  try {
    // Find all tests that indicate critical conditions
    const criticalTests = await Test.find({
      $or: [
        { dataType: 'Blood Pressure', reading: { $gte: 180 } }, // High blood pressure
        { dataType: 'Blood Pressure', reading: { $lte: 90 } },  // Low blood pressure
        { dataType: 'Respiratory Rate', reading: { $gte: 30 } }, // High respiratory rate
        { dataType: 'Respiratory Rate', reading: { $lte: 8 } },  // Low respiratory rate
        { dataType: 'Blood Oxygen Level', reading: { $lte: 92 } }, // Low blood oxygen
        { dataType: 'Heartbeat Rate', reading: { $gte: 130 } },  // High heart rate
        { dataType: 'Heartbeat Rate', reading: { $lte: 40 } }    // Low heart rate
      ]
    }).populate('patientId');

    // Get unique patients from critical tests
    const criticalPatients = [...new Set(criticalTests.map(test => test.patientId))];

    // Populate user information for critical patients
    const patientsWithUsers = await Patient.find({ _id: { $in: criticalPatients } }).populate('userId');

    res.json(patientsWithUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const editTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { dataType, reading, testDate } = req.body;

    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      { dataType, reading, testDate },
      { new: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.json(updatedTest);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTestById = async (req, res) => {
  const { testId } = req.params;
  try {
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTestsByPatientId, addTest, getAllCriticalPatients, editTest, getTestById };
