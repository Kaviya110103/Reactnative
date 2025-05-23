import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import TimeIn from '@/components/TimeIn';
import { Upload } from 'lucide-react';
import LeavePermissionEmployee from './LeavePermissionEmployee';
import EmployeeCalendar from './EmployeeCalendar';
import UploadImageTimein from './UploadImageTimein';
import { router } from 'expo-router';
import TimeOut from './TimeOut';
import UploadImageTimeout from '@/app/UploadImageTimeout';
import DayCloseModal from './DayCloseModal';
// import CameraComponent from './CameraComponent';

const SimpleAttendanceDetails = ({ employeeId }) => {
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [latestAttendanceId, setLatestAttendanceId] = useState(null);
  const [loading, setLoading] = useState(true);
  

  // ✅ Define the function
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(`http://192.168.1.14:8080/api/attendance/employee/${employeeId}`);
      if (response.data?.length) {
        const lastAttendance = response.data[response.data.length - 1];
        setAttendanceDetails(lastAttendance);
        setLatestAttendanceId(lastAttendance.id);
        fetchImagesByAttendanceId(lastAttendance.id);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const fetchImagesByAttendanceId = async (latestAttendanceId) => {
    setLoading(true);
    
    try {
      const response = await axios.get(`http://192.168.1.14:8080/api/images/displayImagesByAttendanceId/${latestAttendanceId}`);
      setImageData(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchAttendanceData();
    }
  }, [employeeId]);

  useEffect(() => {
    if (latestAttendanceId) {
      fetchImagesByAttendanceId(latestAttendanceId);
    }
  }, [latestAttendanceId]);

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImageUrl('');
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (!attendanceDetails) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* <CameraComponent /> */}

        <Text style={styles.statusText}>Attendance Status2: {attendanceDetails.attendanceStatus || 'Not Available'}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0e7490" style={styles.loader} />
        ) : !imageData ? (
          <Text style={styles.errorText}>No images found</Text>
        ) : (
          <View style={styles.imageContainer}>
            <View style={styles.column}>
              <Text style={styles.timeText}>Time In: {formatTime(attendanceDetails.timeIn)}</Text>
              {imageData.imageUrl1 && (
                <TouchableOpacity onPress={() => handleImageClick(imageData.imageUrl1)}>
                  <Text>{imageData.imageId}</Text>
                  <Image source={{ uri: imageData.imageUrl1.replace('localhost', '192.168.1.114') }} style={styles.attendanceImage} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.column}>
              <Text style={styles.timeText}>Time Out: {formatTime(attendanceDetails.timeOut)}</Text>
              {imageData.imageUrl2 && (
                <TouchableOpacity onPress={() => handleImageClick(imageData.imageUrl2)}>
                  <Image source={{ uri: imageData.imageUrl2.replace('localhost', '192.168.1.114') }} style={styles.attendanceImage} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>

      {/* ✅ Pass fetchAttendanceData as a prop */}
      <View style={styles.container}>

      <View style={styles.container}>
  {attendanceDetails.timeIn && imageData?.imageUrl1 && attendanceDetails.timeOut ? (
    // Show "Hello World" if all conditions are met
    <TouchableOpacity
    style={styles.uploadButton}
    onPress={() =>
      router.push({
        pathname: "/Image2Capture",
        params: {
          latestAttendanceId: latestAttendanceId,
          employeeId: employeeId,
          imageId: imageData.imageId, // Pass imageId
          timeIn: attendanceDetails.timeIn,
          timeOut: attendanceDetails.timeOut,
        },
      })
    }
  >
    <Text style={styles.uploadbutton}>Upload Time Out Image</Text>
  </TouchableOpacity>    
  ) : (
    // Fallback content if conditions are not met
    <Text style={styles.statusText}>Required data is missing</Text>
  )}
</View>


        
  {attendanceDetails.timeIn && imageData?.imageUrl1 && attendanceDetails.timeOut ? (
    // Show button to navigate to UploadImageTimeout if all conditions are met
  <Text style={styles.statusText}>
    Upload Time Out Image
  </Text>
  ) : (
    // Show TimeIn or TimeOut components based on conditions
    <>
      {imageData?.imageUrl1 ? (
        <TimeOut
          employeeId={employeeId}
          latestAttendanceId={latestAttendanceId}
          fetchAttendanceData={fetchAttendanceData}
          imageId={imageData.imageId} // Pass imageId to TimeOut component
        />
      ) : (
        <TimeIn
          employeeId={employeeId}
          fetchAttendanceData={fetchAttendanceData}
          latestAttendanceId={latestAttendanceId}
        />
      )}
    </>
  )}
</View>

<View style={styles.container}>
  {attendanceDetails.timeIn && imageData?.imageUrl1 && attendanceDetails.timeOut && imageData?.imageUrl2 ? (
    // Show "Hello Inba" if all conditions are met
    <DayCloseModal
    fetchAttendanceData={fetchAttendanceData}

    latestAttendanceId={latestAttendanceId}
    employeeId={employeeId}
    timeIn={attendanceDetails.timeIn}
    timeOut={attendanceDetails.timeOut}
    imageUrl1={imageData.imageUrl1}
    imageUrl2={imageData.imageUrl2}
  /> ) : (
    // Fallback content if conditions are not met
    <Text style={styles.statusText}>Required data is missing</Text>
  )}
</View>

      <View>
        <LeavePermissionEmployee employeeId={employeeId} />
      
      </View>


      <View>
        <EmployeeCalendar employeeId={employeeId} />
      </View>

      <View style={styles.card}>
</View>
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalBackground} onPress={closeModal}>
          <Image source={{ uri: selectedImageUrl }} style={styles.modalImage} />
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8fafc' },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  statusText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  imageContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  column: { alignItems: 'center', flex: 1 },
  timeText: { fontSize: 16, fontWeight: 'bold', color: '#0e7490', marginBottom: 5 },
  attendanceImage: { width: 100, height: 100, borderRadius: 8, marginBottom: 5, backgroundColor: '#f0f0f0' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalImage: { width: 200, height: 200, borderRadius: 8, marginBottom: 10 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 10 },
  loadingText: { textAlign: 'center', fontSize: 16, color: '#777', marginTop: 20 },
  uploadButton: {
    backgroundColor: '#0e7490',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default SimpleAttendanceDetails;
