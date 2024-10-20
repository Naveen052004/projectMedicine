// MedicineReminderModal.js
import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const MedicineReminderModal = ({ visible, onClose, medicine }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Time to Take Your Medicine!</Text>
          <Text style={styles.medicineText}>{medicine.medicineName}</Text>
          <Text style={styles.dosageText}>{medicine.dosage}</Text>
          <Button title="OK" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  medicineText: {
    fontSize: 18,
    marginBottom: 5,
  },
  dosageText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default MedicineReminderModal;
