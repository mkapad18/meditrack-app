import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from './src/screens/DashboardScreen';
import PatientsListScreen from './src/screens/PatientsListScreen';
import AddPatientScreen from './src/screens/AddPatientScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import EditPatientScreen from './src/screens/EditPatientScreen';
import PatientDetailsScreen from './src/screens/PatientDetailsScreen';
import AllTestsScreen from './src/screens/AllTestsScreen';
import AddTestScreen from './src/screens/AddTestScreen';
import EditTestScreen from './src/screens/EditTestScreen';
import CriticalPatientsScreen from './src/screens/CriticalPatientsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }}  />
        <Stack.Screen name="PatientsList" component={PatientsListScreen} options={{ title: 'My Patients' }} />
        <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} options={{ title: 'Patient Details' }} />
        <Stack.Screen name="AllTests" component={AllTestsScreen} options={{ title: 'All Tests' }} />
        <Stack.Screen name="EditTest" component={EditTestScreen} options={{ title: 'Edit Test' }} />
        <Stack.Screen name="CriticalPatients" component={CriticalPatientsScreen} options={{ title: 'Critical Patients' }} />
        <Stack.Screen name="AddTest" component={AddTestScreen} options={{ title: 'Add Test' }} />
        <Stack.Screen name="EditPatient" component={EditPatientScreen} options={{ title: 'Edit Patient' }} />
        <Stack.Screen name="AddPatient" component={AddPatientScreen} options={{ title: 'Add Patient' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;