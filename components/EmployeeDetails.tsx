import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const EmployeeDetails = ({ employeeId, name, position }) => {
  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }}
          style={styles.logo}
        />
      
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{name}</Text>
          <Text style={styles.employeePosition}>{position}</Text>
        </View>
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <View style={styles.idContainer}>
          <Image 
            source={{ uri: 'https://img.icons8.com/ios-filled/50/0e7490/id-verified.png' }} 
            style={styles.icon} 
          />
          <Text style={styles.employeeId}>EMP{employeeId}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  employeeInfo: {
    justifyContent: 'center',
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e7490',
  },
  employeePosition: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e7490',
    marginLeft: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default EmployeeDetails;
