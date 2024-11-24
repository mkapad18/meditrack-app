import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Background from '../components/Background';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getPatients } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = ({ navigation }) => {
    const [patientsCount, setPatientsCount] = useState(0);
    const [criticalPatientsCount, setCriticalPatientsCount] = useState(0);

    const getAllCount = async () => {
        const userId = await AsyncStorage.getItem("userId");
        console.log("Retrieved User ID:", userId); // Log the user ID

        if (userId) {
            try {
                const patients = await getPatients(userId);
                console.log("Patients Data:", patients.data); // Log the patients data
                setPatientsCount(patients.data.length);

                // Filter critical patients from the fetched patients
                const criticalPatients = patients.data.filter(patient => patient.status === 'Critical');
                console.log("Critical Patients Data:", criticalPatients); // Log critical patients data
                setCriticalPatientsCount(criticalPatients.length);
            } catch (error) {
                console.error("Error fetching patients:", error); // Log any errors
            }
        } else {
            console.error("User ID not found in AsyncStorage");
        }
    };

    const fetchAllCount = async () => {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
            try {
                const patients = await getPatients(userId);
                setPatientsCount(patients.data.length);
                const criticalPatients = patients.data.filter(patient => patient.status === 'Critical');
                setCriticalPatientsCount(criticalPatients.length);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        }
    };

    const widgets = [
        { title: 'Patients', icon: 'people', value: `${patientsCount}`, onPress: () => navigation.navigate('PatientsList', fetchAllCount) },
        { title: 'Critical Patients', icon: 'accessibility', value: `${criticalPatientsCount}`, onPress: () => navigation.navigate('CriticalPatients') },
        { title: 'Profile', icon: 'account-circle', onPress: () => navigation.navigate('Profile') },
    ];

    useEffect(() => {
        getAllCount();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <View style={styles.widgetContainer}>
                {widgets.map((widget, index) => (
                    <TouchableOpacity key={index} style={styles.widget} onPress={widget.onPress}>
                        <Icon name={widget.icon} size={30} color="#004a59" />
                        <Text style={styles.widgetValue}>{widget.value}</Text>
                        <Text style={styles.widgetTitle}>{widget.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('AddPatient', { fetchAllCount })}>
                <Icon name="add" size={24} color="white" />
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 50,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    widgetContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    widget: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '45%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    widgetValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    widgetTitle: {
        fontSize: 12,
        color: 'gray',
        marginTop: 5,
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
        elevation: 5,
    },
});

export default DashboardScreen;