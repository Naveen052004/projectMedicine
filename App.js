import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import HomeScreen from './components/HomeScreen';
import AddReminderScreen from './components/AddReminderScreen';
import ViewSchedule from './components/ViewSchedule';
import EditReminder from './components/EditReminder'; 
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'MediTrack' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'MediTrack - Sign Up' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'MediTrack - Home' }} />
        <Stack.Screen name="AddReminder" component={AddReminderScreen} options={{ title: 'MediTrack - Add Reminder' }} />
        <Stack.Screen name="Schedule" component={ViewSchedule} options={{ title: 'MediTrack - Schedule' }} />
        <Stack.Screen name="EditReminder" component={EditReminder} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
