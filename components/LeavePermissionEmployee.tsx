import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";

const LeavePermissionEmployee = ({ employeeId }) => {
  const [newRequest, setNewRequest] = useState({
    employeeId: employeeId,
    type: "Leave", // Default to Leave
    leaveType: "",
    startDate: "", // Changed to string for manual entry
    endDate: "", // Changed to string for manual entry
    reason: "",
  });

  const [approvalMessage, setApprovalMessage] = useState("");
  const [lastRequest, setLastRequest] = useState(null);

  useEffect(() => {
    getLastRequest();
  }, [employeeId]);

  const getLastRequest = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.24:8080/api/leave-permissions/employee/${employeeId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch last request");
      }
      const requests = await response.json();
      if (requests.length > 0) {
        setLastRequest(requests[requests.length - 1]);
      }
    } catch (error) {
      console.error("Error fetching previous requests:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setNewRequest({ ...newRequest, [field]: value });
  };

  const handleSubmit = async () => {
    if (
      lastRequest &&
      new Date(lastRequest.startDate).toDateString() === new Date().toDateString()
    ) {
      Alert.alert("Error", "Your request has already been submitted today.");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.1.24:8080/api/leave-permissions/${employeeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRequest),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create leave permission");
      }

      const newLeavePermission = await response.json();
      Alert.alert("Success", "Request created successfully!");

      if (newLeavePermission.status === "Approved") {
        setApprovalMessage("Your leave/permission has been approved!");
      }

      getLastRequest();
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Leave/Permission Request</Text>

      <View style={styles.inputGroup}>
        <Icon name="list" size={20} color="#007BFF" style={styles.icon} />
        <Picker
          selectedValue={newRequest.type}
          style={styles.picker}
          onValueChange={(itemValue) => handleInputChange("type", itemValue)}
        >
          <Picker.Item label="Select Type" value="" />
          <Picker.Item label="Leave" value="Leave" />
          <Picker.Item label="Permission" value="Permission" />
        </Picker>
      </View>

      {newRequest.type === "Leave" && (
        <View style={styles.inputGroup}>
          <Icon name="align-left" size={20} color="#007BFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Leave Type"
            value={newRequest.leaveType}
            onChangeText={(text) => handleInputChange("leaveType", text)}
          />
        </View>
      )}

      <View style={styles.inputGroup}>
        <Icon name="calendar" size={20} color="#007BFF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Start Date (YYYY-MM-DD)"
          value={newRequest.startDate}
          onChangeText={(text) => handleInputChange("startDate", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Icon name="calendar" size={20} color="#007BFF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="End Date (YYYY-MM-DD)"
          value={newRequest.endDate}
          onChangeText={(text) => handleInputChange("endDate", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Icon name="align-left" size={20} color="#007BFF" style={styles.icon} />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Reason for Leave/Permission"
          value={newRequest.reason}
          onChangeText={(text) => handleInputChange("reason", text)}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Request</Text>
      </TouchableOpacity>

      {approvalMessage ? (
        <Text style={styles.successMessage}>{approvalMessage}</Text>
      ) : null}

      {lastRequest && (
        <View style={styles.lastRequest}>
          <Text style={styles.requestText}>
            Last Request ID: {lastRequest.id}
          </Text>
          <Text style={styles.requestText}>Status: {lastRequest.status}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#007BFF" },
  inputGroup: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 8, padding: 10, marginBottom: 10, elevation: 3 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  picker: { flex: 1, fontSize: 16, color: "#000" }, // Added picker style
  button: { backgroundColor: "#007BFF", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16 },
  successMessage: { color: "green", textAlign: "center", marginTop: 10 },
  lastRequest: { marginTop: 15, padding: 10, backgroundColor: "#e9ecef", borderRadius: 8 },
  requestText: { fontSize: 16 },
});

export default LeavePermissionEmployee;
