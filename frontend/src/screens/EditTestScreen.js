import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { updateTest } from '../services/api';

const EditTestScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { testId, patientId, fetchAllTests } = route.params;

  const [testType, setTestType] = useState('');
  const [reading, setReading] = useState('');
  const [testDate, setTestDate] = useState(dayjs()); // Default to current date
  const [testTypes] = useState(['Blood Pressure', 'Respiratory Rate', 'Blood Oxygen Level']); // Example test types

  useEffect(() => {
    // Fetch the test details from the API when the screen loads
    fetchTestDetails();
  }, []);

  const fetchTestDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tests/${testId}`);
      const test = response.data;
      setTestType(test.dataType);
      setReading(test.reading);
      setTestDate(dayjs(test.testDate)); // Assuming testDate is in ISO format
    } catch (error) {
      console.error("Error fetching test details:", error);
      Alert.alert('Error', 'There was an issue fetching the test details.');
    }
  };

  const handleDateChange = (date) => {
    setTestDate(date); // Update the state with the selected date
  };

  const handleEditTest = async () => {
    if (!testType || !reading || !testDate) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const updatedTest = {
        patientId,
        dataType: testType,
        reading,
        testDate: testDate.toISOString(), // Convert the date to ISO string for the database
      };

      // Make a PUT request to update the test
      await updateTest(testId, updatedTest);
      Alert.alert('Success', 'Test updated successfully!');
      fetchAllTests(); // Refresh the tests list
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error("Error updating test:", error);
      Alert.alert('Error', 'There was an issue updating the test.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Test</Text>

      {/* Test Type Drop-Down using RNPickerSelect */}
      <Text style={styles.label}>Test Type</Text>
      <RNPickerSelect
        onValueChange={(value) => setTestType(value)}
        items={testTypes.map((type) => ({ label: type, value: type }))}
        style={{
          inputIOS: styles.picker,
          inputAndroid: styles.picker,
        }}
        value={testType}
      />

      {/* Test Reading */}
      <Text style={styles.label}>Test Reading</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter test reading"
        value={reading}
        onChangeText={setReading}
        keyboardType="numeric"
      />

      {/* Test Date */}
      <Text style={styles.label}>Test Date</Text>
      <DateTimePicker
        mode="single"
        height={300}
        date={testDate}
        onChange={(params) => handleDateChange(params.date)}
      />

      {/* Submit Button */}
      <Button title="Update Test" onPress={handleEditTest} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
  },
});

export default EditTestScreen;
