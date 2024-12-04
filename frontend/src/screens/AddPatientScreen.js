// src/screens/AddPatientScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { addPatient } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPatientScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const { fetchData,getAllCount } = route.params;

  const handleAddPatient = async () => {
    // Retrieve user ID from AsyncStorage
    const userId = await AsyncStorage.getItem("userId");

    // Prepare patient data for submission
    const patientData = { name, dob, gender, address, contactNumber, userId };
    
    
    try {
      await addPatient(patientData);
      
      // Call fetchData from PatientsListScreen
      fetchData(); // Call fetchData passed from PatientsListScreen
      Alert.alert('Success', 'Patient added successfully', [
        { text: 'OK', onPress: () => navigation.navigate('PatientsList',{getAllCount}) }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add patient');
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChangeText={setDob}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.btn}>
      <Button title="Add Patient" onPress={handleAddPatient} color="#004a59" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  btn:{
    backgroundColor: '#044956',
    color:'red',
    borderRadius: 50,
    overflow:'hidden',
    paddingVertical: 3,
    marginTop:20,
    fontSize: 16,
  }
});

export default AddPatientScreen;
