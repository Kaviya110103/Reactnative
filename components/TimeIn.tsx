import React, { useState } from "react";
import axios from 'axios';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import TimeOut from "./TimeOut";
import { router } from "expo-router";

const TimeIn = ({ employeeId, fetchAttendanceData, latestAttendanceId }) => {
  const [selectedStatus, setSelectedStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [absentLoading, setAbsentLoading] = useState(false);
  const [timeInSuccess, setTimeInSuccess] = useState(false); // Track Time In success

  const handleTimeIn = async () => {
    if (!selectedStatus) {
      Alert.alert("Error", "Please select an attendance status.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        employeeId: employeeId,
        attendanceStatus: selectedStatus,
      };

      const response = await fetch(
        "http://192.168.1.14:8080/api/attendance/time-in",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to record Time In.");
      }

      const responseData = await response.json(); // ✅ Get latestAttendanceId from backend

      if (fetchAttendanceData) {
        fetchAttendanceData(); // ✅ Refresh parent component
      } else {
        console.error("fetchAttendanceData is undefined!");
      }

      setTimeInSuccess(true); // ✅ Mark Time In as successful
      Alert.alert("Success", "Time In recorded successfully.");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAbsent = async () => {
    setAbsentLoading(true);
    try {
      const response = await fetch(
        `http://192.168.1.14:8080/api/attendance/mark-absent?employeeId=${employeeId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark Absent.");
      }

      Alert.alert("Success", "Attendance marked as Absent successfully!");

      if (fetchAttendanceData) {
        fetchAttendanceData();
      } else {
        console.error("fetchAttendanceData is undefined!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to mark attendance as Absent.");
    } finally {
      setAbsentLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Show Radio Buttons and Time In Button only if Time In is not successful */}
      {!timeInSuccess && (
        <>
          {/* Radio Buttons */}
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                selectedStatus === "Present" && styles.selected,
              ]}
              onPress={() => setSelectedStatus("Present")}
            >
              <Text
                style={[
                  styles.radioText,
                  selectedStatus === "Present" && styles.selectedText,
                ]}
              >
                Present
              </Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={[
                styles.radioButton,
                selectedStatus === "Absent" && styles.selected,
              ]}
              onPress={() => setSelectedStatus("Absent")}
            >
              <Text
                style={[
                  styles.radioText,
                  selectedStatus === "Absent" && styles.selectedText,
                ]}
              >
                Absent
              </Text>
            </TouchableOpacity>
          </View>
  
          {/* Time In Button */}
          {selectedStatus === "Present" && (
            <TouchableOpacity style={styles.button} onPress={handleTimeIn}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Time In</Text>
              )}
            </TouchableOpacity>
          )}
  
          {/* Submit Absent Button */}
          {selectedStatus === "Absent" && (
            <TouchableOpacity
              style={styles.absentButton}
              onPress={handleMarkAbsent}
            >
              {absentLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Submit Absent</Text>
              )}
            </TouchableOpacity>
          )}
        </>
      )}
  
      {/* Show Navigate to Upload Image Button only if Time In is successful */}
      {timeInSuccess && (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() =>
            router.push({
              pathname: '/UploadImageTimein',
              params: {
                latestAttendanceId: latestAttendanceId,
                employeeId: employeeId,
                fetchAttendanceData
              },
            })
          }
        >
          <Text style={styles.buttonText}>Upload Time In Image</Text>
        </TouchableOpacity>
      )}
  
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  radioButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#007BFF",
    marginHorizontal: 10,
    minWidth: 100,
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#007BFF",
  },
  radioText: {
    fontSize: 16,
    color: "#007BFF",
  },
  selectedText: {
    color: "#FFF",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  absentButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
  },
});

export default TimeIn;