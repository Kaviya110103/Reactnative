import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Screen</Text>
      <Button title="Back to Login" onPress={() => router.push('/login')} />
      <Button title="Go to Home" onPress={() => router.push('/')} />
        <Button title="Go to footer" onPress={() => router.push('/footer')} />
            {/* <Button title="Go to addemployee" onPress={() => router.push('/addemployee')} /> */}
         <Button title="Go to EmployeeProfile" onPress={() => router.push('/EmployeeProfile')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
