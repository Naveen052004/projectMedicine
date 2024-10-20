import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [medications, setMedications] = useState([]);

  const fetchMedications = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('reminders');
      const reminders = storedReminders ? JSON.parse(storedReminders) : [];
      setMedications(reminders);
    } catch (error) {
      console.error('Failed to load medications', error);
    }
  };

  const deleteMedicine = async (index) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this medicine?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const updatedMeds = medications.filter((_, i) => i !== index);
            setMedications(updatedMeds);
            await AsyncStorage.setItem('reminders', JSON.stringify(updatedMeds));
          },
        },
      ]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMedications();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Medications</Text>

      {medications.length === 0 ? (
        <Text style={styles.noMedsText}>No medications for today!</Text>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.medicationItem}>
              <Text style={styles.medText}>{`${item.medicineName} - ${item.dosage}`}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('EditReminder', { item, index })}>
                  <Text style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteMedicine(index)}>
                  <Text style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddReminder')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.fab, styles.scheduleButton]}
        onPress={() => navigation.navigate('Schedule')}
      >
        <Text style={styles.fabText}>📅</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  noMedsText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  medText: {
    fontSize: 18,
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9c2ff',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    color: 'blue',
    marginRight: 10,
  },
  deleteButton: {
    color: 'red',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  scheduleButton: {
    bottom: 100, // Position the schedule button above the add button
  },
  fabText: {
    color: 'white',
    fontSize: 24,
  },
});

export default HomeScreen;
