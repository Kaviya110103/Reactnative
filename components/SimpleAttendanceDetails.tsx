import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';

const SimpleAttendanceDetails = ({  }) => {
  const [attendanceDetails, setAttendanceDetails] = useState({
    attendanceStatus: 'Present',
    timeIn: '09:00 AM',
    timeOut: '06:00 PM',
    dateIn: '2025-03-24',
  });

  const [images, setImages] = useState({
    imageUrl1: 'https://via.placeholder.com/150', // Sample Image URL
    imageUrl2: 'https://via.placeholder.com/150', // Sample Image URL
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  const handleImageClick = (imageUrl: React.SetStateAction<string>) => {
    setSelectedImageUrl(imageUrl);
    setModalVisible(true);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.statusText}>Attendance Status: {attendanceDetails.attendanceStatus}</Text>

      <View style={styles.imageContainer}>
        {/* Left Side: Time In */}
        <View style={styles.column}>
          <Text style={styles.timeText}>TimeIn: {attendanceDetails.timeIn}</Text>
          <TouchableOpacity onPress={() => handleImageClick(images.imageUrl1)}>
            <Image source={{ uri: images.imageUrl1 }} style={styles.attendanceImage} />
          </TouchableOpacity>
          <Text style={styles.dateText}>Date: {attendanceDetails.dateIn}</Text>
        </View>

        {/* Right Side: Time Out */}
        <View style={styles.column}>
          <Text style={styles.timeText}>TimeOut: {attendanceDetails.timeOut}</Text>
          <TouchableOpacity onPress={() => handleImageClick(images.imageUrl2)}>
            <Image source={{ uri: images.imageUrl2 }} style={styles.attendanceImage} />
          </TouchableOpacity>
          <Text style={styles.dateText}>Date: {attendanceDetails.dateIn}</Text>
        </View>
      </View>

      {/* Modal to show enlarged image */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedImageUrl }} style={styles.modalImage} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Sample Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Start Day" onPress={() => {}} color="#4CAF50" />
        <Button title="Time In" onPress={() => {}} color="#FF9800" />
        <Button title="Time Out" onPress={() => {}} color="#2196F3" />
        <Button title="Close Day" onPress={() => {}} color="#F44336" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    width: '95%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    alignItems: 'center',
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0e7490',
    marginBottom: 5,
  },
  attendanceImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
  },
  dateText: {
    fontSize: 14,
    color: '#555',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default SimpleAttendanceDetails;
