import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const daysOfWeek = ['All Days', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ViewSchedule = () => {
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

  const filteredReminders = selectedDay === 'All Days'
    ? reminders
    : reminders.filter(reminder => reminder.title === selectedDay);

  const renderReminderItem = ({ item }) => (
    <Text style={styles.reminderText}>{`${item.medicineName} - ${item.dosage} at ${item.time}`}</Text>
  );

  const renderEmptyReminder = () => (
    <Text style={styles.noRemindersText}>No reminders</Text>
  );

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  reminderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  noRemindersText: {
    fontSize: 16,
    color: '#555',
  },
});

export default ViewSchedule;
