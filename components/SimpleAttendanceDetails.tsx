import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const SimpleAttendanceDetails = ({ employeeId }) => {
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [images, setImages] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`http://192.168.1.24:8080/api/attendance/employee/12`);
        if (response.data?.length) {
          const lastAttendance = response.data[response.data.length - 1];
          setAttendanceDetails(lastAttendance);
          fetchImagesByAttendanceId(lastAttendance.id);
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    const fetchImagesByAttendanceId = async (attendanceId) => {
      try {
        const response = await axios.get(`http://192.168.1.24:8080/api/images/displayImagesByAttendanceId/304`);
        if (response.data) {
          setImages(response.data);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (employeeId) {
      fetchAttendanceData();
    }
  }, [employeeId]);

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setModalVisible(true);
  };

  if (!attendanceDetails || !images) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.statusText}>Attendance Status: {attendanceDetails.attendanceStatus || 'Not Available'}</Text>

      <View style={styles.imageContainer}>
        {/* Left Side: Time In */}
        <View style={styles.column}>
          <Text style={styles.timeText}>Time In: {attendanceDetails.timeIn || 'Not Available'}</Text>
          <TouchableOpacity onPress={() => handleImageClick(images.imageUrl1)}>
            <Image source={{ uri: images.imageUrl1 }} style={styles.attendanceImage} />
          </TouchableOpacity>
          <Text style={styles.dateText}>Date: {attendanceDetails.dateIn || 'Not Available'}</Text>
        </View>

        {/* Right Side: Time Out */}
        <View style={styles.column}>
          <Text style={styles.timeText}>Time Out: {attendanceDetails.timeOut || 'Not Available'}</Text>
          <TouchableOpacity onPress={() => handleImageClick(images.imageUrl2)}>
            <Image source={{ uri: images.imageUrl2 }} style={styles.attendanceImage} />
          </TouchableOpacity>
          <Text style={styles.dateText}>Date: {attendanceDetails.dateIn || 'Not Available'}</Text>
        </View>
      </View>

      {/* Modal to show enlarged image */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedImageUrl }} style={styles.modalImage} />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#0e7490',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  column: {
    alignItems: 'center',
    flex: 1,
    padding: 10,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0e7490',
    marginBottom: 8,
  },
  attendanceImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
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
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  modalImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#0e7490',
    padding: 10,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#777',
  },
});

export default SimpleAttendanceDetails;
