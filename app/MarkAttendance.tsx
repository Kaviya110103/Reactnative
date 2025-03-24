import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { cn } from '@/lib/utils';
import { User, MapPin, Briefcase, Mail, Phone, Calendar, Clock, Home, Banknote, Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import LiveClock from '@/components/LiveClock';
import SimpleAttendanceDetails from '@/components/SimpleAttendanceDetails';
import EmployeeDetails from '@/components/EmployeeDetails';

const MarkAttendance = () => {
  const route = useRoute<{ params: { employee: any } }>();
  const { employee } = route.params;

  return (
    <>
    <SafeAreaView style={styles.container}>
      <EmployeeDetails />
    </SafeAreaView>
    <SafeAreaView style={styles.container}>
     < SimpleAttendanceDetails employeeId={employee.id} />
    </SafeAreaView>
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
      </View></>




  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
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