import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const EditReminder = ({ route, navigation }) => {
  const { item, index } = route.params;
  const [medicineName, setMedicineName] = useState(item.medicineName);
  const [dosageInstructions, setDosageInstructions] = useState(item.dosageInstructions); // Updated field
  const [time, setTime] = useState(new Date()); // Set random initial time
  const [selectedDays, setSelectedDays] = useState(item.days);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const randomTime = new Date();
    randomTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0); // Generate a random time
    setTime(randomTime);
  }, []);

  const saveEdits = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('reminders');
      const reminders = storedReminders ? JSON.parse(storedReminders) : [];

      // Update the reminder at the specified index
      reminders[index] = {
        ...reminders[index],
        medicineName,
        dosageInstructions, // Updated field
        time: time.toLocaleTimeString(),
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

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowPicker(false);
    setTime(currentTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Medicine Name</Text>
      <TextInput
        style={styles.input}
        value={medicineName}
        onChangeText={setMedicineName}
      />

      <Text style={styles.label}>Dosage Instructions</Text>
      <TextInput
        style={styles.input}
        value={dosageInstructions}
        onChangeText={setDosageInstructions}
        placeholder="e.g., Take 1 tablet after meals"
      />

      <Text style={styles.label}>Edit Time</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.timeButton}>
        <Text style={styles.timeText}>{time.toLocaleTimeString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

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

      <View style={styles.buttonsContainer}>
        <Button title="Save Changes" onPress={saveEdits} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
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
  timeButton: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  daySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditReminder;
