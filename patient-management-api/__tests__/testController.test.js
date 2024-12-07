const { addTest, getTestsByPatientId, editTest, deleteTest } = require('../controllers/testController');
const Test = require('../models/Test');
const Patient = require('../models/Patient');

jest.mock('../models/Test');
jest.mock('../models/Patient');

describe('Test Controller Tests', () => {
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

  test('getTestsByPatientId should return all tests for a patient', async () => {
    const mockTests = [
      { _id: '1', patientId: '123', dataType: 'Blood Pressure', reading: 120 },
      { _id: '2', patientId: '123', dataType: 'Heart Rate', reading: 80 }
    ];
    mockRequest.params = { patientId: '123' };
    Test.find.mockResolvedValue(mockTests);

    await getTestsByPatientId(mockRequest, mockResponse);

    expect(Test.find).toHaveBeenCalledWith({ patientId: '123' });
    expect(mockResponse.json).toHaveBeenCalledWith(mockTests);
  });

  test('addTest should create a new test with critical flag', async () => {
    const testData = {
      patientId: '123',
      dataType: 'Blood Pressure',
      reading: '180',
      testDate: '2024-03-20'
    };
    mockRequest.body = testData;

    const mockPatient = { _id: '123', userId: 'user123' };
    Patient.findById.mockResolvedValue(mockPatient);

    const mockSavedTest = { 
      ...testData, 
      reading: 180,
      criticalFlag: true,
      userId: 'user123',
      _id: '1'
    };
    Test.prototype.save.mockResolvedValue(mockSavedTest);

    await addTest(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockSavedTest);
  });

  test('editTest should update test data', async () => {
    const testData = {
      dataType: 'Blood Pressure',
      reading: 120,
      testDate: '2024-03-20'
    };
    mockRequest.params = { testId: '1' };
    mockRequest.body = testData;

    const mockUpdatedTest = { ...testData, _id: '1' };
    Test.findByIdAndUpdate.mockResolvedValue(mockUpdatedTest);

    await editTest(mockRequest, mockResponse);

    expect(Test.findByIdAndUpdate).toHaveBeenCalledWith(
      '1',
      testData,
      { new: true }
    );
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedTest);
  });

  test('deleteTest should remove a test', async () => {
    mockRequest.params = { testId: '1' };
    const mockDeletedTest = { _id: '1', patientId: '123' };
    
    Test.findByIdAndDelete.mockResolvedValue(mockDeletedTest);

    await deleteTest(mockRequest, mockResponse);

    expect(Test.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Test deleted successfully' });
  });
}); 