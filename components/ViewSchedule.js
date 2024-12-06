import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const ViewSchedule = ({ navigation }) => {
  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [selectedDay, setSelectedDay] = useState(''); // Default: No Filter

  const daysOfWeek = [
    '',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Fetch the schedule from AsyncStorage
  const fetchSchedule = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('reminders');
      const reminders = storedReminders ? JSON.parse(storedReminders) : [];
      setSchedule(reminders);
      setFilteredSchedule(reminders); // Initially, show all reminders
    } catch (error) {
      console.error('Failed to fetch schedule', error);
    }
  };

  // Apply filter based on selected day
  const applyDayFilter = (day) => {
    setSelectedDay(day);

    if (day === '') {
      setFilteredSchedule(schedule); // Show all reminders if "No Filter"
    } else {
      const filtered = schedule.filter((item) => item.days.includes(day));
      setFilteredSchedule(filtered);
    }
  };

  // Delete medication logic
  const deleteScheduleItem = async (index) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this schedule?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          const updatedSchedule = filteredSchedule.filter((_, i) => i !== index);
          setFilteredSchedule(updatedSchedule);

          const updatedOriginalSchedule = schedule.filter((_, i) => i !== index);
          setSchedule(updatedOriginalSchedule);

          await AsyncStorage.setItem('reminders', JSON.stringify(updatedOriginalSchedule));
        },
      },
    ]);
  };

  // Handle editing a schedule item
  const editScheduleItem = (item, index) => {
    navigation.navigate('EditReminder', { item, index, schedule, setSchedule });
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>View Schedule</Text>

      {/* Day Filter Dropdown */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Day:</Text>
        <Picker
          selectedValue={selectedDay}
          onValueChange={(value) => applyDayFilter(value)}
          style={styles.picker}
        >
          {daysOfWeek.map((day, index) => (
            <Picker.Item key={index} label={day === '' ? 'No Filter' : day} value={day} />
          ))}
        </Picker>
      </View>

      {/* Schedules List */}
      {filteredSchedule.length === 0 ? (
        <Text style={styles.noItemsText}>No schedules found.</Text>
      ) : (
        <FlatList
          data={filteredSchedule}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleText}>
                  <Text style={styles.bold}>Medicine: </Text>{item.medicineName}
                </Text>
                {item.dosageInstructions && (
                  <Text style={styles.scheduleText}>
                    <Text style={styles.bold}>Dosage Instructions: </Text>{item.dosageInstructions}
                  </Text>
                )}
                <Text style={styles.scheduleText}>
                  <Text style={styles.bold}>Time: </Text>{item.time}
                </Text>
                <Text style={styles.scheduleText}>
                  <Text style={styles.bold}>Days: </Text>{item.days.join(', ')}
                </Text>
                {item.notes && (
                  <Text style={styles.scheduleText}>
                    <Text style={styles.bold}>Notes: </Text>{item.notes}
                  </Text>
                )}
                {item.startDate && item.endDate && (
                  <Text style={styles.scheduleText}>
                    <Text style={styles.bold}>Duration: </Text>{item.startDate} - {item.endDate}
                  </Text>
                )}
              </View>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => editScheduleItem(item, index)}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteScheduleItem(index)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  noItemsText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 50,
  },
  scheduleItem: {
    backgroundColor: '#f9c2ff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  scheduleDetails: {
    marginBottom: 10,
  },
  scheduleText: {
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    color: 'blue',
  },
  deleteButton: {
    color: 'red',
  },
});

export default ViewSchedule;
