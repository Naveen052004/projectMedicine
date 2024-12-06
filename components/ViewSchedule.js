import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

// Import your background image
const backgroundImage = require('../static/img/image.png'); // Adjust the path as necessary

const daysOfWeek = ['All Days', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ViewSchedule = ({ navigation }) => {
  const [reminders, setReminders] = useState([]);
  const [selectedDay, setSelectedDay] = useState('All Days');

  const fetchReminders = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('reminders');
      const reminders = storedReminders ? JSON.parse(storedReminders) : [];

      // Organize reminders by day of the week
      const organizedReminders = daysOfWeek.slice(1).map(day => ({
        title: day,
        data: reminders.filter(reminder => reminder.days.includes(day)),
      }));
      setReminders(organizedReminders);
    } catch (error) {
      console.error('Failed to load reminders', error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleDeleteMedicine = async (itemToDelete) => {
    Alert.alert(
      'Delete Medicine',
      'Are you sure you want to delete this medicine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              // Remove the item from AsyncStorage and the state
              const storedReminders = await AsyncStorage.getItem('reminders');
              const reminders = storedReminders ? JSON.parse(storedReminders) : [];
              const updatedReminders = reminders.filter(reminder => reminder !== itemToDelete);

              await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
              fetchReminders();  // Refresh the list
            } catch (error) {
              console.error('Failed to delete medicine', error);
            }
          },
        },
      ]
    );
  };

  const filteredReminders = selectedDay === 'All Days'
    ? reminders
    : reminders.filter(reminder => reminder.title === selectedDay);

  const renderReminderItem = ({ item }) => (
    <View style={styles.reminderItem}>
      <Text style={styles.reminderText}>{`${item.medicineName} - ${item.dosage} at ${item.time}`}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditReminder', { item })}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteMedicine(item)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyReminder = () => (
    <Text style={styles.noRemindersText}>No reminders</Text>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.container}>
      <View style={styles.innerContainer}>
        <Picker
          selectedValue={selectedDay}
          onValueChange={(itemValue) => setSelectedDay(itemValue)}
          style={styles.picker}
        >
          {daysOfWeek.map(day => (
            <Picker.Item key={day} label={day} value={day} />
          ))}
        </Picker>

        <SectionList
          sections={filteredReminders}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderReminderItem({ item })}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.dayTitle}>{title}</Text>
          )}
          ListEmptyComponent={renderEmptyReminder}
        />
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Adjust opacity for better visibility
    borderRadius: 10,
    margin: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000', // Set a text color for better visibility
    backgroundColor: 'transparent', // Make the background transparent
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#f9c2ff',
    borderRadius: 5,
  },
  reminderText: {
    fontSize: 16,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  editButton: {
    padding: 5,
    backgroundColor: 'blue',
    borderRadius: 5,
    marginRight: 10,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noRemindersText: {
    fontSize: 16,
    color: '#555',
  },
});

export default ViewSchedule;
