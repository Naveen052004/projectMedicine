// EditReminder.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const EditReminder = ({ route, navigation }) => {
  const { item, index } = route.params;
  const [medicineName, setMedicineName] = useState(item.medicineName);
  const [dosage, setDosage] = useState(item.dosage);
  const [time, setTime] = useState(item.time);
  const [selectedDays, setSelectedDays] = useState(item.days);

  const saveEdits = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('reminders');
      const reminders = storedReminders ? JSON.parse(storedReminders) : [];

      // Update the reminder at the specified index
      reminders[index] = {
        ...reminders[index],
        medicineName,
        dosage,
        time,
        days: selectedDays,
      };

      await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
      Alert.alert('Success', 'Medicine details updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save edits', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  };

  const toggleDaySelection = (day) => {
    setSelectedDays((prevDays) => {
      if (prevDays.includes(day)) {
        return prevDays.filter((d) => d !== day);
      } else {
        return [...prevDays, day];
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Medicine Name</Text>
      <TextInput
        style={styles.input}
        value={medicineName}
        onChangeText={setMedicineName}
      />

      <Text style={styles.label}>Dosage</Text>
      <TextInput
        style={styles.input}
        value={dosage}
        onChangeText={setDosage}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Time</Text>
      <TextInput
        style={styles.input}
        value={time}
        onChangeText={setTime}
        placeholder="HH:MM AM/PM"
      />

      <Text style={styles.label}>Days</Text>
      {daysOfWeek.map((day) => (
        <View key={day} style={styles.daySelector}>
          <Text>{day}</Text>
          <Button
            title={selectedDays.includes(day) ? 'Selected' : 'Select'}
            onPress={() => toggleDaySelection(day)}
          />
        </View>
      ))}

      <Button title="Save Changes" onPress={saveEdits} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  daySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});

export default EditReminder;
