import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getLoggedInUser } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const user = await getLoggedInUser({ token });
        setUserInfo(user.data);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => {
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('userId')
        navigation.navigate('Login');
      }}
    ])
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>
      
      <View style={styles.profileContainer}>
        {/* Profile Image */}
        <Image
          source={{ uri: 'https://avatar.iran.liara.run/public'}}
          style={styles.profileImage}
        />
        
        {/* User Details */}
        {userInfo && (
          <>
            <Text style={styles.name}>{userInfo.username}</Text>
            <Text style={styles.email}>{userInfo.email}</Text>
          </>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.btn}>
      <Button title="Logout" onPress={handleLogout} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FF5733',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
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

export default ProfileScreen;
