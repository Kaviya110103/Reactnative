import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const EmployeeDetails = () => {
  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }}
          style={styles.logo}
        />
      
      <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>John Doe</Text>
          <Text style={styles.employeePosition}>Software Engineer</Text>
        </View>
      </View>
     

      {/* Right Section */}
      <View style={styles.rightSection}>
        <Text style={styles.employeeId}>
          <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/0e7490/id-verified.png' }} style={styles.icon} />
          EMP1
        </Text>
      
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    margin: 0,

  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 0, // Adjust spacing between image & text
    backgroundColor: '#f0f0f0',
  },
  employeeInfo: {
    marginRight: 10, // Adjust spacing between image & text
    backgroundColor: '#f0f0f0',
    alignItems: 'flex-start', // Align text to start
  },
  employeeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0e7490',
  },
  employeePosition: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  employeeId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e7490',
  },
  employeeBranch: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});

export default EmployeeDetails;
