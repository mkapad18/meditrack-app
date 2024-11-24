import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getPatientById, getTestsByPatientId, updatePatientStatus } from '../services/api';
import dayjs from 'dayjs'; // Import dayjs for date formatting

const PatientDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { patientId } = route.params; // Get the patientId from the route parameters
  const [patient, setPatient] = useState(null);
  const [recentTests, setRecentTests] = useState([]);

  // Fetch patient details from the server
  const fetchPatientDetails = async () => {
    try {
      const response = await getPatientById(patientId);
      setPatient(response.data);
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  // Fetch all tests for the patient and check for critical conditions
  const fetchAllTestsAndUpdateStatus = async () => {
    try {
      const response = await getTestsByPatientId(patientId);
      const tests = response.data;
  
      // Group tests by dataType
      const groupedTests = tests.reduce((acc, test) => {
        if (!acc[test.dataType] || new Date(test.testDate) > new Date(acc[test.dataType].testDate)) {
          acc[test.dataType] = test;
        }
        return acc;
      }, {});
  
      // Get the latest test for each dataType
      const latestTests = Object.values(groupedTests);
  
      // Check for critical conditions in the latest tests
      const criticalTests = latestTests.filter(test => test.criticalFlag);
      
      if (criticalTests.length > 0) {
        // If any test is critical, update patient status to critical
        console.log("Patient status should be updated to critical.");
        setPatient(prev => ({ ...prev, status: 'Critical' }));
        // Call the API function to update the patient's status
        await updatePatientStatus(patientId, 'Critical');
      } else {
        // If no tests are critical, update patient status to stable
        console.log("Patient status should be updated to stable.");
        setPatient(prev => ({ ...prev, status: 'Stable' }));
        // Call the API function to update the patient's status
        await updatePatientStatus(patientId, 'Stable');
      }
  
      // Set the recent tests state to the latest tests
      setRecentTests(latestTests); // Update recent tests state
  
    } catch (error) {
      console.error("Error fetching patient tests:", error);
    }
  };

  useEffect(() => {
    fetchPatientDetails();
    fetchAllTestsAndUpdateStatus();
  }, [patientId]);

  return (
    <ScrollView style={styles.container}>
      {patient ? (
        <>
          <View style={styles.header}>
            <Image
              source={{ uri: `https://avatar.iran.liara.run/public/${Math.round(Math.random(0,500)*10)}` }} // Random avatar
              style={styles.avatar}
            />
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientInfo}>DOB: {new Date(patient.dob).toLocaleDateString()}</Text>
            <Text style={styles.patientInfo}>Gender: {patient.gender}</Text>
            <Text style={styles.patientInfo}>Address: {patient.address}</Text>
            <Text style={styles.patientInfo}>Contact: {patient.contactNumber}</Text>
            <Text style={[styles.patientInfo, patient.status === 'Critical' ? styles.critical : styles.stable]}>
              Status: {patient.status}
            </Text>
          </View>
        
          {/* Recent Tests Section */}
          <View style={styles.testsContainer}>
            <Text style={styles.sectionTitle}>Recent Tests</Text>
            {recentTests.length > 0 ? (
              recentTests.map((test, index) => (
                <View key={index} style={styles.testItem}>
                  <Text style={styles.testInfo}>Test Type: {test.dataType}</Text>
                  <Text style={styles.testInfo}>Reading: {test.reading}</Text>
                  <Text style={styles.testInfo}>Date: {dayjs(test.testDate).format('MM/DD/YYYY')}</Text>
                </View>
              ))
            ) : (
              <Text>No recent tests available.</Text>
            )}

            {/* Button to View All Tests */}
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('AllTests', { patientId, fetchPatientDetails })}>
              <Text style={styles.viewAllButtonText}>View All Tests</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>Loading patient details...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  patientInfo: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  critical: {
    color: 'red', // Highlight critical status in red
    fontWeight: 'bold',
  },
  stable: {
    color: 'green', // Highlight stable status in green
    fontWeight: 'bold',
  },
  testsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  testItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  testInfo: {
    fontSize: 16,
    color: '#333',
  },
  viewAllButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  viewAllButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PatientDetailsScreen;
