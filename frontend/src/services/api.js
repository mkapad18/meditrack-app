// src/services/api.js
import axios from 'axios';

const API_URL = 'http://10.0.0.30:3000/';

const api = axios.create({
  baseURL: API_URL,
});

// User-related API calls
export const login = (username, password) => api.post('/api/users/login', { username, password });
export const registerUser = (userData) => api.post('/api/users/register', userData);
export const getLoggedInUser = (token) => api.post('/api/users/getUser', token);

// Patient-related API calls
export const addPatient = (patientData) => api.post('/api/patients', patientData);
export const getPatients = (userId) => api.get(`/api/patients?userId=${userId}`);
export const getPatientById = (id) => api.get(`/api/patients/${id}`);
export const deletePatient = (id) => api.delete(`/api/patients/${id}`);
export const updatePatient = (id, updatedData) => api.put(`/api/patients/${id}`, updatedData);
export const getCriticalPatients = async (userId) => api.get(`/api/patients/critical?userId=${userId}`);

export const getTestsByPatientId = (patientId) => api.get(`/api/tests/${patientId}/tests`);
export const addPatientTest = (patientId, testData) => {
  return api.post(`/api/tests/${patientId}/tests`, testData);
};
export const updateTest = (testId, updatedData) => {
  return api.put(`/api/tests/${testId}`, updatedData);
};

// New function to delete a test
export const deleteTest = (testId) => {
  return api.delete(`/api/tests/${testId}`);
};

// Function to update patient status
export const updatePatientStatus = (patientId, status) => 
  api.put(`/api/patients/update-status/${patientId}`, { status });

export const getTestById = (testId) => api.get(`/api/tests/${testId}`);

