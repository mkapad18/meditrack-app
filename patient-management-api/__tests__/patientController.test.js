const mongoose = require('mongoose');
const { getAllPatients, getPatientById, addPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const Patient = require('../models/Patient');
const Test = require('../models/Test');

// Mock the Patient and Test models
jest.mock('../models/Patient');
jest.mock('../models/Test');

describe('Patient Controller Tests', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllPatients should return all patients', async () => {
    const mockPatients = [
      { _id: '1', name: 'John Doe' },
      { _id: '2', name: 'Jane Doe' }
    ];
    Patient.find.mockResolvedValue(mockPatients);

    await getAllPatients(mockRequest, mockResponse);

    expect(Patient.find).toHaveBeenCalled();
    expect(mockResponse.json).toHaveBeenCalledWith(mockPatients);
  });

  test('getPatientById should return a patient when valid ID is provided', async () => {
    const mockPatient = { _id: '1', name: 'John Doe' };
    mockRequest.params = { id: '1' };
    Patient.findById.mockResolvedValue(mockPatient);

    await getPatientById(mockRequest, mockResponse);

    expect(Patient.findById).toHaveBeenCalledWith('1');
    expect(mockResponse.json).toHaveBeenCalledWith(mockPatient);
  });


  test('deletePatient should remove patient and associated tests', async () => {
    mockRequest.params = { id: '1' };
    const mockPatient = { _id: '1', name: 'John Doe' };
    
    Patient.findByIdAndDelete.mockResolvedValue(mockPatient);
    Test.deleteMany.mockResolvedValue({});

    await deletePatient(mockRequest, mockResponse);

    expect(Test.deleteMany).toHaveBeenCalledWith({ patientId: '1' });
    expect(Patient.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Patient deleted successfully' });
  });
});
