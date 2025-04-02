
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  TextInput,
  Platform,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  Button
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';


interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  gender: string;
  position: string;
  branch: string;
  username: string;
  password: string;
  dob: string;
  email: string;
  profileImage: string | null;
  address: string;
  alternativeMobile: string;
  dateOfJoining: string;
  resetToken: string | null;
  salary: number | null;
  weekOff: string | null;
}





const EmployeeProfile = () => {
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // const [employee, setEmployee] = useState(mockEmployeeData);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const route = useRoute();
  const { employeeId } = route.params;

  useEffect(() => {
    setMounted(true);
  }, []);

 

  const handleEditToggle = () => {
    if (isEditing) {
      // Save logic would go here
      console.log('Saving profile changes:', employee);
    }
    setIsEditing(!isEditing);
    setMenuVisible(false);
  };

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(`http://192.168.1.24:8080/api/emp/${employeeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch employee details');
        }
        const data: Employee = await response.json();
        setEmployee(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, []);

  const handleMarkAttendance = () => {
    if (employee) {
      navigation.push('MarkAttendance', { employee });
    }
  };


  

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0891b2" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!employee) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No employee data available.</Text>
      </SafeAreaView>
    );
  }


  // Profile section component
  const ProfileSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  // Info row component for display mode
  const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLabel}>
        {icon}
        <Text style={styles.infoLabelText}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  // Editable info row component for edit mode
  const EditableInfoRow: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    field: string; 
    value: string | number; 
    keyboardType?: string; 
  }> = ({ icon, label, field, value, keyboardType = 'default' }) => (
    <View style={styles.editableInfoRow}>
      <View style={styles.infoLabel}>
        {icon}
        <Text style={styles.infoLabelText}>{label}</Text>
      </View>
      <TextInput
        style={styles.editInput}
        value={String(value)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ecfeff', '#cffafe', '#a5f3fc']}
        style={styles.background}
      >
        {/* Header with menu */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Employee Profile</Text>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <Ionicons name="menu" size={24} color="#0891b2" />
          </TouchableOpacity>

        </View>

        {/* Mobile Menu Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Menu</Text>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleEditToggle}
              >
                <Ionicons 
                  name={isEditing ? "close-circle-outline" : "create-outline"} 
                  size={24} 
                  color="#0891b2" 
                />
                <Text style={styles.menuItemText}>
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.menuItem, styles.logoutMenuItem]}
              
              >
                <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                  <TouchableOpacity 
                    style={[styles.menuItem, styles.logoutMenuItem]} 
                    onPress={() => router.push('/login')}
                  >
                    <Text style={[styles.menuItemText, styles.logoutText]}>Back to Login</Text>
                  </TouchableOpacity>
                <Text style={[styles.menuItemText, styles.logoutText]} onPress={() => router.push('/login')} >Logout</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.menuItem, styles.logoutMenuItem]}
                
              
              >
                <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                  <TouchableOpacity 
                    style={[styles.menuItem, styles.logoutMenuItem]} 
                    onPress={() => router.push('/Camerapg')}
                  >
                    <Text style={[styles.menuItemText, styles.logoutText]}>Back to Login</Text>
                  </TouchableOpacity>
                <Text style={[styles.menuItemText, styles.logoutText]} onPress={() => router.push('/Camerapg')} >cam</Text>
              </TouchableOpacity>
              <TouchableOpacity 
            style={styles.attendanceButton}
            onPress={handleMarkAttendance}
          >
            <Text style={styles.attendanceButtonText}>Mark Attendance</Text>
          </TouchableOpacity>

       
              <TouchableOpacity 
                style={[styles.menuItem, styles.closeMenuItem]}
                onPress={() => setMenuVisible(false)}
              >
                <Text style={styles.closeText}>Close Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Image Section */}
          <View style={styles.profileImageSection}>
            <Image 
              source={{ uri: employee.profileImage ?? `http://192.168.1.24:8080/${employee.profileImage}`}}
              style={styles.profileImage}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.employeeName}>
                {employee.firstName} {employee.lastName}
              </Text>
              <Text style={styles.employeePosition}>{employee.position}</Text>
            </View>
          </View>

          {/* Personal Information */}
          <ProfileSection title="Personal Information">
            {isEditing ? (
              <>
                <EditableInfoRow 
                  icon={<Ionicons name="person" size={20} color="#0891b2" />}
                  label="First Name"
                  field="firstName"
                  value={employee.firstName}
                />
                <EditableInfoRow 
                  icon={<Ionicons name="person" size={20} color="#0891b2" />}
                  label="Last Name"
                  field="lastName"
                  value={employee.lastName}
                />
                <EditableInfoRow 
                  icon={<Ionicons name="mail" size={20} color="#0891b2" />}
                  label="Email"
                  field="email"
                  value={employee.email}
                  keyboardType="email-address"
                />
                <EditableInfoRow 
                  icon={<Ionicons name="call" size={20} color="#0891b2" />}
                  label="Mobile"
                  field="mobile"
                  value={employee.mobile}
                  keyboardType="phone-pad"
                />
                <EditableInfoRow 
                  icon={<Ionicons name="call" size={20} color="#0891b2" />}
                  label="Alternative Mobile"
                  field="alternativeMobile"
                  value={employee.alternativeMobile}
                  keyboardType="phone-pad"
                />
                <EditableInfoRow 
                  icon={<Ionicons name="calendar" size={20} color="#0891b2" />}
                  label="Date of Birth"
                  field="dob"
                  value={employee.dob}
                />
                <EditableInfoRow 
                  icon={<Ionicons name="male-female" size={20} color="#0891b2" />}
                  label="Gender"
                  field="gender"
                  value={employee.gender}
                />
                <EditableInfoRow 
                  icon={<Ionicons name="home" size={20} color="#0891b2" />}
                  label="Address"
                  field="address"
                  value={employee.address}
                />
              </>
            ) : (
              <>
                <InfoRow 
                  icon={<Ionicons name="mail" size={20} color="#0891b2" />}
                  label="Email"
                  value={employee.email}
                />
                <InfoRow 
                  icon={<Ionicons name="call" size={20} color="#0891b2" />}
                  label="Mobile"
                  value={employee.mobile}
                />
                <InfoRow 
                  icon={<Ionicons name="call" size={20} color="#0891b2" />}
                  label="Alternative Mobile"
                  value={employee.alternativeMobile}
                />
                <InfoRow 
                  icon={<Ionicons name="calendar" size={20} color="#0891b2" />}
                  label="Date of Birth"
                  value={employee.dob}
                />
                <InfoRow 
                  icon={<Ionicons name="male-female" size={20} color="#0891b2" />}
                  label="Gender"
                  value={employee.gender}
                />
                <InfoRow 
                  icon={<Ionicons name="home" size={20} color="#0891b2" />}
                  label="Address"
                  value={employee.address}
                />
              </>
            )}
          </ProfileSection>

          {/* Employment Information */}
          <ProfileSection title="Employment Information">
            {isEditing ? (
              <>
                <EditableInfoRow 
                  icon={<FontAwesome5 name="building" size={18} color="#0891b2" />}
                  label="Branch"
                  field="branch"
                  value={employee.branch}
                />
                <EditableInfoRow 
                  icon={<MaterialIcons name="work" size={20} color="#0891b2" />}
                  label="Position"
                  field="position"
                  value={employee.position}
                />
                <EditableInfoRow 
                  icon={<Ionicons name="calendar" size={20} color="#0891b2" />}
                  label="Joining Date"
                  field="dateOfJoining"
                  value={employee.dateOfJoining}
                />
                <EditableInfoRow 
                  icon={<MaterialIcons name="attach-money" size={20} color="#0891b2" />}
                  label="Salary"
                  field="salary"
                  value={employee.salary ?? ''}
                  keyboardType="numeric"
                />
                <EditableInfoRow 
                  icon={<FontAwesome5 name="calendar-day" size={18} color="#0891b2" />}
                  label="Week Off"
                  field="weekOff"
                  value={employee.weekOff ?? ''}
                />
              </>
            ) : (
              <>
                <InfoRow 
                  icon={<FontAwesome5 name="building" size={18} color="#0891b2" />}
                  label="Branch"
                  value={employee.branch}
                />
                <InfoRow 
                  icon={<MaterialIcons name="work" size={20} color="#0891b2" />}
                  label="Position"
                  value={employee.position}
                />
                <InfoRow 
                  icon={<Ionicons name="calendar" size={20} color="#0891b2" />}
                  label="Joining Date"
                  value={employee.dateOfJoining}
                />
                <InfoRow 
                  icon={<MaterialIcons name="attach-money" size={20} color="#0891b2" />}
                  label="Salary"
                  value={`$${(employee.salary ?? 0).toLocaleString()}`}
                />
                <InfoRow 
                  icon={<FontAwesome5 name="calendar-day" size={18} color="#0891b2" />}
                  label="Week Off"
                  value={employee.weekOff ?? ''}
                />
              </>
            )}
          </ProfileSection>

          {/* Save button when in edit mode */}
          {isEditing && (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleEditToggle}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>



  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 10,
  },
  attendanceButton: {
    backgroundColor: '#0891b2',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  attendanceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0e7490',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0e7490',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#0e7490',
  },
  logoutMenuItem: {
    marginTop: 10,
  },
  logoutText: {
    color: '#ef4444',
  },
  closeMenuItem: {
    justifyContent: 'center',
    marginTop: 20,
    borderBottomWidth: 0,
  },
  closeText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#0891b2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileImageSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  nameContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  employeeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0e7490',
  },
  employeePosition: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0e7490',
    marginBottom: 15,
  },
  sectionContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
  },
  infoLabelText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 15,
    color: '#334155',
    textAlign: 'right',
    flex: 1,
  },
  editableInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  editInput: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    backgroundColor: '#f8fafc',
  },
  saveButton: {
    backgroundColor: '#0891b2',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmployeeProfile;