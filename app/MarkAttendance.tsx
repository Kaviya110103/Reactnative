import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import EmployeeDetails from '@/components/EmployeeDetails';
import LiveClock from '@/components/LiveClock';
import SimpleAttendanceDetails from '@/components/SimpleAttendanceDetails';
import AttendanceDetailsView from '@/components/AttendanceDetailsView';
import TimeIn from '@/components/TimeIn';
import UploadImageTimein from '@/components/UploadImageTimein';
import Camerapg from './';
// import CameraComponent from '@/components/CameraComponent';

const MarkAttendance = () => {
  const route = useRoute<{ params: { employee: any } }>();
  const { employee } = route.params;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
        <EmployeeDetails 
            employeeId={employee.id} 
            name={`${employee.firstName} ${employee.lastName}`} 
            position={employee.position} 
          />
          <LiveClock />
          {/* <CameraComponent /> */}
        </View>

       {/* <UploadImageTimein /> */}
        {/* Attendance Details */}
        {/* <SimpleAttendanceDetails employeeId={employee.id} /> */}
<AttendanceDetailsView employeeId={employee.id} />
        {/* Employee Info Section */}
        <View style={styles.container}>
          <Text style={styles.title}>Mark Attendance</Text>
          <Text style={styles.detail}>Employee ID: {employee.id}</Text>
          <Text style={styles.detail}>Name: {employee.firstName} {employee.lastName}</Text>
          <Text style={styles.detail}>Position: {employee.position}</Text>
          <Text style={styles.detail}>Branch: {employee.branch}</Text>
          <Text style={styles.detail}>Email: {employee.email}</Text>
          <Text style={styles.detail}>Mobile: {employee.mobile}</Text>
          <Text style={styles.detail}>Gender: {employee.gender}</Text>
          <Text style={styles.detail}>Date of Birth: {employee.dob}</Text>
          <Text style={styles.detail}>Address: {employee.address}</Text>
          <Text style={styles.detail}>Joining Date: {employee.dateOfJoining}</Text>
          <Text style={styles.detail}>Salary: {employee.salary ? `$${employee.salary}` : 'N/A'}</Text>
          <Text style={styles.detail}>Week Off: {employee.weekOff || 'N/A'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0e7490',
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
    color: '#334155',
  },
});

export default MarkAttendance;
