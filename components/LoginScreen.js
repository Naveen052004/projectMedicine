import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground } from 'react-native';

// Import your background image
const backgroundImage = require('../static/img/image.png'); // Adjust the path as necessary

const LoginScreen = ({ navigation, title }) => {
  // console.log(title);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Simple login function
  const handleLogin = () => {
    navigation.navigate('Home');
    // if (!email || !password) {
    //   Alert.alert('Error', 'Please fill in both email and password!');
    // } else {
    //   // Simulating a successful login (you can integrate your real login logic here)
    //   Alert.alert('Success', 'You are logged in!');

    //   // You can navigate to the home screen here after successful login
    //   // navigation.navigate('Home');
    // }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        />
        
        <Button title="Login" onPress={handleLogin} />
        
        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text style={styles.signupLink} onPress={() => navigation.navigate('SignUp')}>
            Sign Up
          </Text>
        </Text>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjusted to lower opacity (0.5)
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  signupLink: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
