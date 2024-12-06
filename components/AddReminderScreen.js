import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing reminders
import * as Notifications from 'expo-notifications';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AddReminderScreen = ({ navigation }) => {
  const [medicineName, setMedicineName] = useState('');
  const [dosageInstructions, setDosageInstructions] = useState(''); // Changed to "Dosage Instructions"
  const [time, setTime] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [everydaySelected, setEverydaySelected] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    requestPermissions();
  }, []);

  const toggleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
      setEverydaySelected(false);
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleEverydaySelection = () => {
    if (everydaySelected) {
      setSelectedDays([]);
    } else {
      setSelectedDays(daysOfWeek);
    }
    setEverydaySelected(!everydaySelected);
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowPicker(false);
    setTime(currentTime);
  };

  const scheduleNotification = async (reminder) => {
    const notificationTime = new Date(time);
    
    for (const day of reminder.days) {
      const dayIndex = daysOfWeek.indexOf(day);
      const dayDate = new Date(notificationTime);
      const daysUntilNextOccurrence = (dayIndex - dayDate.getDay() + 7) % 7; // Calculate days until next occurrence
      dayDate.setDate(dayDate.getDate() + daysUntilNextOccurrence);
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time to take your ${reminder.medicineName}!`,
          body: `${reminder.dosageInstructions}`, // Updated field name
          sound: 'default',
        },
        trigger: {
          date: dayDate,
          seconds: 0,
          repeats: true,
        },
      });
    }
  };

  const handleAddMedicine = async () => {
    if (!medicineName || !dosageInstructions || selectedDays.length === 0) { // Changed to dosageInstructions
      Alert.alert('Error', 'Please fill in all fields and select at least one day!');
      return;
    }

    const newReminder = {
      medicineName,
      dosageInstructions, // Changed to dosageInstructions
      time: time.toLocaleTimeString(),
      days: selectedDays,
    };

    try {
      const existingReminders = await AsyncStorage.getItem('reminders');
      const reminders = existingReminders ? JSON.parse(existingReminders) : [];
      reminders.push(newReminder);
      await AsyncStorage.setItem('reminders', JSON.stringify(reminders));

      await scheduleNotification(newReminder);

      Alert.alert('Success', 'Medicine added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save the reminder.');
    }
  };

  return (
    <ImageBackground source={require('../static/img/image.png')} style={styles.background}>
      <View style={styles.whiteContainer}>
        <Text style={styles.title}>Add Medicine Reminder</Text>

        <TextInput
          style={styles.input}
          placeholder="Medicine Name"
          value={medicineName}
          onChangeText={setMedicineName}
        />

        <TextInput
          style={styles.input}
          placeholder="Dosage Instructions (e.g., 1 pill after meal)"
          value={dosageInstructions} // Changed field name
          onChangeText={setDosageInstructions} // Changed field name
        />

        <Text style={styles.label}>Select Days:</Text>
        <View style={styles.daysContainer}>
          <TouchableOpacity style={styles.checkboxContainer} onPress={toggleEverydaySelection}>
            <View style={[styles.checkbox, everydaySelected && styles.checkboxSelected]} />
            <Text style={styles.checkboxLabel}>Everyday</Text>
          </TouchableOpacity>

          {daysOfWeek.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={styles.checkboxContainer}
              onPress={() => toggleDaySelection(day)}
            >
              <View
                style={[styles.checkbox, selectedDays.includes(day) && styles.checkboxSelected]}
              />
              <Text style={styles.checkboxLabel}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Reminder Time</Text>
        <Button title="Set Time" onPress={() => setShowPicker(true)} />
        {showPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
        <Text style={styles.timeText}>Selected Time: {time.toLocaleTimeString()}</Text>

        <Button title="Add Medicine" onPress={handleAddMedicine} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
    borderRadius: 10,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: '#00f',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  timeText: {
    marginVertical: 10,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AddReminderScreen;
