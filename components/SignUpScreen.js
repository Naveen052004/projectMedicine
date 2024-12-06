import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, TouchableOpacity } from 'react-native';

// Import your background image
const backgroundImage = require('../static/img/image.png'); // Adjust the path as necessary

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    Alert.alert('Success', 'Account created successfully!');
    navigation.navigate('Login');
  };

  const handleGoogleSignUp = () => {
    Alert.alert('Sign Up with Google', 'This feature will be implemented soon!');
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>MediTrack - Sign Up</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        
        <Button title="Sign Up" onPress={handleSignUp} />

        {/* OR Line */}
        <Text style={styles.orText}>— OR —</Text>

        {/* Google Sign Up Button */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
          <Text style={styles.googleButtonText}>Sign Up with Google</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjusted to lower opacity (0.5)
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  orText: {
    marginVertical: 15,
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
    fontStyle: 'italic',
  },
  googleButton: {
    marginTop: 20,
    backgroundColor: '#DB4437', // Google reddish-orange color
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
  },
  googleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
