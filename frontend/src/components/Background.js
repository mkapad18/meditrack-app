import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';

const Background = ({ children }) => {
  return (
    <ImageBackground
      source={require('../../assets/diamond-sunset.png')} // Update the path to your background image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Optional: Add a dark overlay for better text visibility
    justifyContent: 'center',
    padding: 20,
  },
});

export default Background; 