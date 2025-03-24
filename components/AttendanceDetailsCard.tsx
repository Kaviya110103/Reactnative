import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Avatar, Badge } from 'react-native-paper';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const AttendanceDetailsCard = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const employee = {
    id: "EMP12345",
    firstName: "John",
    lastName: "Doe",
    position: "Senior Developer",
    profileImage: null,
    department: "Engineering",
    branch: "New York",
    email: "john.doe@example.com",
    mobile: "+1 (555) 123-4567",
    gender: "Male",
    dob: "15/06/1988",
    address: "123 Tech Street, Silicon Valley",
    dateOfJoining: "01/03/2020",
    salary: 85000,
    weekOff: "Saturday, Sunday"
  };

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const imageUrl = employee.profileImage 
    ? `http://localhost:8080/${employee.profileImage}` 
    : "https://bootdey.com/img/Content/avatar/avatar1.png";

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Avatar.Image size={80} source={{ uri: imageUrl }} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.position}>{employee.position}</Text>
        </View>
      </View>

      {/* Employee Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <MaterialIcons name="email" size={18} color="gray" />
          <Text style={styles.detailText}>{employee.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="call" size={18} color="gray" />
          <Text style={styles.detailText}>{employee.mobile}</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome5 name="user" size={18} color="gray" />
          <Text style={styles.detailText}>Gender: {employee.gender}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="calendar-today" size={18} color="gray" />
          <Text style={styles.detailText}>DOB: {employee.dob}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={18} color="gray" />
          <Text style={styles.detailText}>Address: {employee.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="work" size={18} color="gray" />
          <Text style={styles.detailText}>Branch: {employee.branch}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="attach-money" size={18} color="gray" />
          <Text style={styles.detailText}>Salary: ${employee.salary}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={18} color="gray" />
          <Text style={styles.detailText}>Week Off: {employee.weekOff}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoContainer: {
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  position: {
    fontSize: 14,
    color: "#777",
  },
  detailsContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#555",
  },
});

export default AttendanceDetailsCard;
