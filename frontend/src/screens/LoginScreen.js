import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Text, ImageBackground, TouchableOpacity} from 'react-native';
import meditrack from '../../assets/meditrack-logo1.png';
import background from '../../assets/bg.png'; 
import { login } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';




const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle login request
  const handleLogin = async () => {
    console.log("button clicked")
    if(username === '' || password === ''){
      setErrorMessage('Please enter username and password');
      return;
    }
  // Assuming you get the token from your API after successful login
  try{
    const response = await login(username, password);
    console.log("response",response.status)
    if(response.status === 200){
      const data = response.data
      await AsyncStorage.setItem("token", data.token)
      await AsyncStorage.setItem("userId", data.userId)
      console.log("Token and User ID stored successfully");
      setUsername("")
      setPassword("")
      setErrorMessage("")
      navigation.navigate('Dashboard');
    } else {
      // Handle specific error messages based on response
      if (response.data && response.data.message) {
        setErrorMessage(response.data.message); // Show specific error message from API
      } else {
        setErrorMessage('Invalid login'); // Generic error message
      }
    }
  } catch (error) {
    console.error(error)
    setErrorMessage('Invalid username or password');
  }
};


  return (
    <ImageBackground 
      source={background}  // Set the background image
      style={styles.backgroundImage}
      resizeMode="cover"  // Ensures the image covers the screen
    >
      <View style={styles.container}>
        <Image
          source={meditrack}
          style={styles.logo}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}  
          onChangeText={setPassword}
          secureTextEntry
        />
        
        {/* Display error message if any */}
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Button title="Login" color={'#044956'} onPress={handleLogin}/>
        </TouchableOpacity>
        
        <Text style={styles.registerText}>
          Don't have an account? &nbsp;
          <Text 
            style={styles.registerLink} 
            onPress={() => navigation.navigate('Register')}
          > 
               Register
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,  // Ensures the background image covers the entire screen
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius:50,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical:10,
    fontSize:16,
    backgroundColor: 'white',  // Adds a white background to input fields
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight:'bold'
  },
  registerLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontWeight:'bold'
  },
  btn: {
    backgroundColor: '#044956',
    borderRadius: 50,
    overflow: 'hidden',
    paddingVertical: 3,
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  }
});

export default LoginScreen;
