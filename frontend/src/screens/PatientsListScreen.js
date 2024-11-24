import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getPatients, deletePatient } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PatientsListScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        const fetchedPatients = await getPatients(userId);
        setPatients(fetchedPatients.data);
      } else {
        console.error("User ID not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      await deletePatient(selectedPatientId);
      setIsModalVisible(false);
      Alert.alert('Deleted', 'Patient has been successfully deleted.');
      fetchData();  // Re-fetch patient list after deletion
    } catch (error) {
      Alert.alert('Error', 'Failed to delete patient.');
    }
  };
  

  const renderPatientItem = ({ item }) => (
    <View style={styles.patientItem}>
      <TouchableOpacity 
        style={styles.infoContainer} 
        onPress={() => navigation.navigate('PatientDetails', { patientId: item._id })}
      >
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientInfo}>{item.gender} | {item.dob.substring(0, 10)}</Text>
        <Text style={styles.patientInfo}>{item.address}</Text>
        <Text style={styles.patientInfo}>{item.contactNumber}</Text>
      </TouchableOpacity>
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('EditPatient', { patientId: item._id, fetchData })} style={styles.editButton}>
          <Icon name="edit" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setSelectedPatientId(item._id);
          setIsModalVisible(true);
        }} style={styles.deleteButton}>
          <Icon name="delete" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredPatients = Array.isArray(patients) 
    ? patients.filter(patient => patient.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search patients..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={item => item._id.toString()}
      />
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this patient?</Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="#4CAF50" />
              <Button title="Delete" onPress={confirmDelete} color="#f44336" />
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPatient', { fetchData })}
      >
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  patientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 1,
  },
  infoContainer: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  patientInfo: {
    fontSize: 14,
    color: 'gray',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 4,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#004a59',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PatientsListScreen;
