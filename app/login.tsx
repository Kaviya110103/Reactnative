import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const EmployeeLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.13:8080/api/emp/authenticate', {
        username,
        password,
      });

      const employee = response.data;
      console.log('Login successful:');

      Alert.alert("Success", `Hello ${employee.username}!`);

      // Use push() instead of navigate()
      navigation.push('EmployeeProfile', { employeeId: employee.id });

    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials.');
      Alert.alert('Error', 'Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp' }}
        style={styles.image}
      />
      <Text style={styles.title}>Employee Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => setChecked(!checked)}
        />
        <Text style={styles.checkboxLabel}>Remember me</Text>
        <TouchableOpacity>
          <Text style={styles.link}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    elevation: 2,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  link: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    marginVertical: 10,
  },
});

export default EmployeeLogin;
