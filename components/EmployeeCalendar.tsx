import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';

interface Attendance {
  id: number;
  dateIn: string;
  timeIn: string;
  timeOut: string;
  attendanceStatus: 'Present' | 'Absent' | string;
}

const { width } = Dimensions.get('window');

const EmployeeCalendar = ({ employeeId }: { employeeId: number }) => {
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const fetchAttendanceData = (month: number, year: number) => {
    if (!employeeId) return;

    axios
      .get(
        `http://192.168.1.14:8080/api/attendance/employee/${employeeId}?month=${
          month + 1
        }&year=${year}`
      )
      .then((response) => {
        console.log('Fetched attendance data:', response.data);
        setAttendanceList(response.data);
      })
      .catch((error) => console.error('Error fetching attendance data:', error));
  };

  useEffect(() => {
    fetchAttendanceData(currentMonth, currentYear);
  }, [currentMonth, currentYear, employeeId]);

  const formatTime = (timeString: string) => {
    return timeString ? timeString.split('.')[0] : 'Not Available';
  };

  const calculateTotalHours = () => {
    if (!selectedAttendance?.timeIn || !selectedAttendance?.timeOut)
      return 'Not Available';
    const timeIn = new Date(`1970-01-01T${selectedAttendance.timeIn}`);
    const timeOut = new Date(`1970-01-01T${selectedAttendance.timeOut}`);
    const diff = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60);
    return `${diff.toFixed(2)} hours`;
  };

  const openModal = (attendance: Attendance) => {
    if (!attendance) return;
    setSelectedAttendance(attendance);
    setIsModalOpen(true);
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  const getDatesInMonth = (month: number, year: number) => {
    const dates: (string | null)[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    for (let i = 0; i < firstDayOfMonth; i++) {
      dates.push(null);
    }

    for (let day = 2; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const formattedDate = moment(date).format('YYYY-MM-DD');
      dates.push(formattedDate);
    }

    return dates;
  };

  const dates = getDatesInMonth(currentMonth, currentYear);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', {
    month: 'long',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return styles.presentStatus;
      case 'Absent':
        return styles.absentStatus;
      default:
        return styles.noDataStatus;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Employee Attendance</Text>

      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <AntDesign name="leftcircleo" size={24} color="#0a58ca" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {monthName} {currentYear}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <AntDesign name="rightcircleo" size={24} color="#0a58ca" />
        </TouchableOpacity>
      </View>

      {/* Day Names Row */}
      <View style={styles.dayNamesContainer}>
        {dayNames.map((day, index) => (
          <View key={index} style={styles.dayName}>
            <Text style={styles.dayNameText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <ScrollView contentContainerStyle={styles.calendarGrid}>
        {dates.map((date, index) => {
          const attendance = attendanceList.find((item) => item.dateIn === date);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.calendarDay,
                !date && styles.emptyDay,
                attendance && styles.clickableDay,
              ]}
              onPress={() => attendance && openModal(attendance)}
              disabled={!attendance}
            >
              {date ? (
                <>
                  <Text style={styles.dayNumber}>{moment(date).date()}</Text>
                  <Text style={[styles.attendanceStatus, getStatusColor(attendance?.attendanceStatus || '')]}>
                    {attendance ? attendance.attendanceStatus : 'No Data'}
                  </Text>
                </>
              ) : (
                <Text> </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Attendance Details Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Attendance Details</Text>
            
            {selectedAttendance ? (
              <>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[
                    styles.detailValue,
                    selectedAttendance.attendanceStatus === 'Present' && styles.presentStatus,
                    selectedAttendance.attendanceStatus === 'Absent' && styles.absentStatus,
                  ]}>
                    {selectedAttendance.attendanceStatus}
                  </Text>
                </View>
                
                <View style={styles.modalDetailRow}>
                  <Text style={styles.detailLabel}>Time In:</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(selectedAttendance.timeIn)}
                  </Text>
                </View>
                
                <View style={styles.modalDetailRow}>
                  <Text style={styles.detailLabel}>Time Out:</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(selectedAttendance.timeOut)}
                  </Text>
                </View>
                
                <View style={styles.modalDetailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>
                    {selectedAttendance.dateIn}
                  </Text>
                </View>
                
                <View style={styles.modalDetailRow}>
                  <Text style={styles.detailLabel}>Total Hours:</Text>
                  <Text style={styles.detailValue}>
                    {calculateTotalHours()}
                  </Text>
                </View>

                {/* Display Images */}
                <View style={styles.imagesContainer}>
                  <Image
                    source={{
                      uri: `http://192.168.1.14:8080/api/images/displayImage1ByAttendanceId/${selectedAttendance.id}`,
                    }}
                    style={styles.attendanceImage}
                    resizeMode="cover"
                  />
                  <Image
                    source={{
                      uri: `http://192.168.1.14:8080/api/images/displayImage2ByAttendanceId/${selectedAttendance.id}`,
                    }}
                    style={styles.attendanceImage}
                    resizeMode="cover"
                  />
                </View>
              </>
            ) : (
              <Text style={styles.noDataText}>No attendance details available.</Text>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalOpen(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0a58ca',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  dayNamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dayName: {
    width: width / 7 - 10,
    alignItems: 'center',
  },
  dayNameText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: width / 7 - 10,
    height: width / 7 - 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 2,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  emptyDay: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  clickableDay: {
    backgroundColor: '#e3f2fd',
  },
  dayNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  attendanceStatus: {
    fontSize: 12,
    textAlign: 'center',
  },
  presentStatus: {
    color: 'green',
    fontWeight: 'bold',
  },
  absentStatus: {
    color: 'red',
    fontWeight: 'bold',
  },
  noDataStatus: {
    color: 'gray',
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width - 40,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  detailValue: {
    color: '#333',
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  attendanceImage: {
    width: width / 3,
    height: width / 3,
    borderRadius: 8,
  },
  noDataText: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EmployeeCalendar;