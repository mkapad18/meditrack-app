import {
  login,
  registerUser,
  getPatients,
  getTestById,
  updateTest,
} from '../api';

describe('API Tests', () => {
  let token; 
  const userData = { username: 'hello', password: 'Hello@123' }; 

  it('should login a user', async () => {
    const response = await login(userData.username, userData.password);
    expect(response.data).toHaveProperty('token');
    expect(response.data).toHaveProperty('userId');
    token = response.data.token; 
  });

  

  it('should get patients by user ID', async () => {
    const userId = '6742030f33d26d18e78dfb8b';
    const response = await getPatients(userId);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0); // Assuming there are patients
  });

  it('should get a test by ID', async () => {
    const testId = '6742036f33d26d18e78dfb91'; // Replace with a valid test ID
    const response = await getTestById(testId);
    expect(response.data).toHaveProperty('_id', testId);
    expect(response.data).toHaveProperty('dataType');
    expect(response.data).toHaveProperty('reading');
  });

  it('should update a test', async () => {
    const testId = '6742036f33d26d18e78dfb91'; // Replace with a valid test ID
    const updatedData = { dataType: 'Blood Pressure', reading: 130 };
    const response = await updateTest(testId, updatedData);
    expect(response.data).toHaveProperty('_id', testId);
  });
});