import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { login, registerUser, addPatient, addPatientTest, getUser } from '../api';

describe('API Service', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mock.reset();
  });

  it('logs in a user successfully', async () => {
    const username = 'testuser';
    const password = 'password123';
    const responseData = { token: 'fake-jwt-token' };

    mock.onPost('/api/users/login').reply(200, responseData);

    const response = await login(username, password);
    expect(response.data).toEqual(responseData);
  });

  it('handles login error', async () => {
    const username = 'testuser';
    const password = 'wrongpassword';

    mock.onPost('/api/users/login').reply(401, { message: 'Invalid credentials' });

    await expect(login(username, password)).rejects.toThrow('Request failed with status code 401');
  });

  it('registers a user successfully', async () => {
    const userData = { name: 'Jane Doe', email: 'jane.doe@example.com', password: 'password123' };
    const responseData = { id: '124', ...userData };

    mock.onPost('/api/users/register').reply(201, responseData);

    const response = await registerUser(userData);
    expect(response.data).toEqual(responseData);
  });

  it('adds a patient successfully', async () => {
    const patientData = { name: 'John Patient', age: 30 };
    const responseData = { id: '1', ...patientData };

    mock.onPost('/api/patients').reply(201, responseData);

    const response = await addPatient(patientData);
    expect(response.data).toEqual(responseData);
  });

  it('adds a test for a patient successfully', async () => {
    const patientId = '1';
    const testData = { type: 'Blood Test', result: 'Normal' };
    const responseData = { id: 'test1', ...testData };

    mock.onPost(`/api/tests/${patientId}/tests`).reply(201, responseData);

    const response = await addPatientTest(patientId, testData);
    expect(response.data).toEqual(responseData);
  });

  it('fetches user data with correct user ID', async () => {
    const userId = '123';
    const responseData = { id: '123', name: 'John Doe', email: 'john.doe@example.com' };

    mock.onGet(`https://meditrack-app.onrender.com/api/users/${userId}`).reply(200, responseData);

    const response = await getUser(userId);

    expect(response.data).toEqual(responseData);
  });

  it('handles user not found error', async () => {
    const userId = '999';

    mock.onGet(`https://meditrack-app.onrender.com/api/users/${userId}`).reply(404, { message: 'User not found' });

    await expect(getUser(userId)).rejects.toThrow('Request failed with status code 404');
  });
});