import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { getPatientById, updatePatient } from '../services/api';

const EditPatientScreen = ({ route, navigation }) => {
  const { patientId, fetchData ,getAllCount} = route.params;
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const patient = await getPatientById(patientId);
      console.log(patient.data)
      setName(patient.data.name);
      setDob(patient.data.dob);
      setGender(patient.data.gender);
      setAddress(patient.data.address);
      setContactNumber(patient.data.contactNumber);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  const handleUpdatePatient = async () => {
    const updatedPatientData = { name, dob, gender, address, contactNumber };
    try {
      await updatePatient(patientId, updatedPatientData);
      fetchData();
      Alert.alert('Success', 'Patient updated successfully', [
        { text: 'OK', onPress: () => navigation.navigate('PatientsList',{getAllCount}) }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update patient');
    }
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
      <Button title="Update Patient" onPress={handleUpdatePatient} color="#004a59" />
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
    borderRadius: 5,
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

export default EditPatientScreen;
