import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateTest, getTestById } from '../services/api';

const EditTestScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { testId, patientId, fetchAllTests } = route.params;

  const [reading, setReading] = useState('');
  const [dataType, setDataType] = useState('');

  useEffect(() => {
    const fetchTestDetails = async () => {
      const response = await getTestById(testId);
      setReading(response.data.reading.toString());
      setDataType(response.data.dataType);
    };

    fetchTestDetails();
  }, [testId]);

  const handleUpdateTest = async () => {
    if (!reading || !dataType) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const readingValue = parseFloat(reading);
    let criticalFlage = false;

    if (
      (dataType === 'Blood Pressure' && (readingValue < 50 || readingValue > 160)) ||
      (dataType === 'Respiratory Rate' && (readingValue < 12 || readingValue > 25)) ||
      (dataType === 'Blood Oxygen Level' && readingValue < 90) ||
      (dataType === 'Heartbeat Rate' && (readingValue < 40 || readingValue > 120))
    ) {
      console.log("it is setting true")
      criticalFlage = true;
    }

    const updatedData = {
      reading,
      dataType,
      testDate: new Date().toISOString(),
      criticalFlag:criticalFlage,
    };

    try {
      await updateTest(testId, updatedData);
      Alert.alert('Success', 'Test updated successfully', [
        { text: 'OK', onPress: () => {
          fetchAllTests();
          navigation.goBack();
        }},
      ]);
    } catch (error) {
      console.error("Error updating test:", error);
      Alert.alert('Error', 'There was an issue updating the test.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Test</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter test reading"
        value={reading}
        onChangeText={setReading}
        keyboardType="numeric"
      />
      <Button title="Update Test" onPress={handleUpdateTest} />
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
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 20,
  },
});

export default EditTestScreen;
