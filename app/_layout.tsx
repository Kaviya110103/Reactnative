import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
      <Stack.Screen name="footer" options={{ title: 'Footer' }} />
      <Stack.Screen name="addemployee" options={{ title: 'AddEmployee' }} />
      <Stack.Screen name="EmployeeProfile" options={{ title: 'EmployeeProfile' }} />
      <Stack.Screen name="MarkAttendance" options={{ title: 'Mark Attendance'}} />
      <Stack.Screen name="EmployeeDetailCard" options={{ title: 'EmployeeDetailCard'}} />


    </Stack>
  );
}
