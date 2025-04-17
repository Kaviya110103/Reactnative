import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ActivityIndicator, Image, Button } from "react-native";
import TimeIn from "@/components/TimeIn"; // Import the TimeIn component

const DayCloseModal = ({fetchAttendanceData, latestAttendanceId, employeeId, timeIn, timeOut, imageUrl1, imageUrl2 }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDayClosed, setIsDayClosed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDayStarted, setIsDayStarted] = useState(false);

  
  const [attendanceData, setAttendanceData] = useState({
    id: "Fetching...",
    dateIn: "Fetching...",
    dayStatus: "Fetching...",
    statusMessage: "Checking...",
  });

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const response = await fetch(
          `http://192.168.1.14:8080/api/attendance/employee/${employeeId}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const lastAttendance = data[data.length - 1];
          const todayDate = new Date().toISOString().split("T")[0];

          let statusMessage = "Attendance is recorded";

          if (
            lastAttendance.dateIn === todayDate &&
            lastAttendance.dayStatus === "Completed"
          ) {
            statusMessage = "Attendance was recorded";

            setIsDayClosed(true);
          }

          setAttendanceData({
            id: lastAttendance.id,
            dateIn: lastAttendance.dateIn,
            dayStatus: lastAttendance.dayStatus,
            statusMessage,
          });
        } else {

          setAttendanceData({
            id: "No data",
            dateIn: "No data",
            dayStatus: "No data",
            statusMessage: "No attendance data available",
          });
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setAttendanceData({
          id: "Error fetching data",
          dateIn: "Error fetching data",
          dayStatus: "Error fetching data",
          statusMessage: "Error fetching data",
        });
      }
    }

    fetchAttendance();
  }, [employeeId]);

  const handleDayClose = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `http://192.168.1.14:8080/api/attendance/updateDayStatus/${latestAttendanceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dayStatus: "Completed",
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Day status updated successfully!");
        setIsDayClosed(true);
        setIsModalVisible(false); // Close the modal
      } else {
        Alert.alert("Error", "Failed to update day status.");
      }
    } catch (error) {
      console.error("Error updating day status:", error);
      Alert.alert("Error", "An error occurred while updating day status.");
    } finally {
      setIsUpdating(false);
    }
  };
  

  const formatTime = (timeString) => {
    if (!timeString) return "Not available";
    const date = new Date(`1970-01-01T${timeString}`);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const calculateTotalHours = () => {
    if (!timeIn || !timeOut) return "Not available";
    const inTime = new Date(`1970-01-01T${timeIn}`);
    const outTime = new Date(`1970-01-01T${timeOut}`);
    const diff = outTime - inTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours} hours, ${minutes} minutes`;
  };

  return (
    <View style={styles.container}>
      {!isDayClosed && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.closeButtonText}>Day Close</Text>
        </TouchableOpacity>
      )}
{attendanceData.dayStatus === "Completed" && !isDayStarted && (
  <Button
    title="Day Start"
    onPress={() => setIsDayStarted(true)}
  />
)}
{isDayStarted && <TimeIn employeeId={employeeId}
          fetchAttendanceData={fetchAttendanceData}
          latestAttendanceId={latestAttendanceId}/>}


      {isDayClosed && (
        <View style={styles.detailsContainer}>
          <Text style={styles.statusText}>{attendanceData.statusMessage}</Text>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Day Close Details</Text>
            <Text style={styles.detailText}>Attendance ID: {latestAttendanceId}</Text>
            <Text style={styles.detailText}>Employee ID: {employeeId}</Text>
            <Text style={styles.detailText}>Time In: {formatTime(timeIn)}</Text>
            <Text style={styles.detailText}>Time Out: {formatTime(timeOut)}</Text>
            <Text style={styles.detailText}>Total Hours: {calculateTotalHours()}</Text>

            {/* Display Images */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUrl1 }} style={styles.image} />
              <Image source={{ uri: imageUrl2 }} style={styles.image} />
            </View>

            {isUpdating ? (
  <ActivityIndicator size="large" color="#0e7490" />
) : (
  <TouchableOpacity style={styles.confirmButton} onPress={handleDayClose}>
    <Text style={styles.confirmButtonText}>Confirm Day Close</Text>
  </TouchableOpacity>
)}


            {/* Conditionally render the Cancel button */}
            {!isDayClosed && (
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: "#DC3545" }]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.confirmButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0e7490",
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#111827",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginHorizontal: 10,
    backgroundColor: "#f0f0f0",
  },
  closeButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  detailsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    color: "#0e7490",
  },
});

export default DayCloseModal;