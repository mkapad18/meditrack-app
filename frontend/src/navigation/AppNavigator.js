import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="PatientsList" component={PatientsListScreen} options={{ title: 'My Patients' }} />
      <Stack.Screen name="PatientFile" component={PatientFileScreen} options={{ title: 'Patient File' }} />
      <Stack.Screen name="AddPatient" component={AddPatientScreen} options={{ title: 'Add Patient' }} />
      <Stack.Screen name="Tests" component={TestsScreen} options={{ title: 'Patient Tests' }} />
        <Stack.Screen name="AddTest" component={AddTestScreen} options={{ title: 'Add New Test' }} />
    </Stack.Navigator>
  </NavigationContainer>
  );
};

export default AppNavigator;