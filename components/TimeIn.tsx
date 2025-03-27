import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import TimeOut from "./TimeOut";

const TimeIn = ({ employeeId }) => {
  const [selectedStatus, setSelectedStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [absentLoading, setAbsentLoading] = useState(false);
  const [latestAttendanceId, setLatestAttendanceId] = useState(null);

  // Function to fetch the latest attendance ID
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.13:8080/api/attendance/employee/${employeeId}`
      );
      if (response.data?.length) {
        const lastAttendance = response.data[response.data.length - 1];
        setLatestAttendanceId(lastAttendance.id);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  // Fetch latest attendance ID when the component mounts
  useEffect(() => {
    fetchAttendanceData();
  }, []);

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
        "http://192.168.1.13:8080/api/attendance/time-in",
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

      Alert.alert("Success", "Time In recorded successfully.");

      // Fetch latest attendance ID after marking Time In
      fetchAttendanceData();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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

      {/* Time Out Component with latestAttendanceId */}
      {latestAttendanceId && <TimeOut latestAttendanceId={latestAttendanceId} />}
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
  buttonText: {
    fontSize: 16,
    color: "#FFF",
  },
});

export default TimeIn;
