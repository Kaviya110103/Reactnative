import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";

const TimeOut = ({ latestAttendanceId, fetchAttendanceData }) => {
  const handleTimeOut = async () => {
    try {
      if (!latestAttendanceId) {
        Alert.alert("Error", "Attendance ID is missing.");
        return;
      }

      await axios.post(
        `http://192.168.1.24:8080/api/attendance/time-out/${latestAttendanceId}`
      );

      Alert.alert("Success", "Time Out recorded successfully.");

      // ✅ Call fetchAttendanceData after successful Time Out
      if (fetchAttendanceData) {
        fetchAttendanceData();
      } else {
        console.error("fetchAttendanceData is undefined!");
      }
    } catch (error) {
      console.error("Error during Time Out:", error);
      Alert.alert("Error", "Failed to record Time Out.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleTimeOut}>
        <Text style={styles.buttonText}>Time Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    maxWidth: 400,
    alignSelf: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TimeOut;
