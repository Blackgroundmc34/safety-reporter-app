import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// IMPORTANT: Use your computer's IP address here
const API_BASE_URL = 'http://192.168.6.152/safety_api';

export default function ChangePasswordScreen({ navigation }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
    }
    if (newPassword !== confirmPassword) {
        Alert.alert("Error", "New passwords do not match.");
        return;
    }
    
    setIsSubmitting(true);
    try {
        const response = await axios.post(`${API_BASE_URL}/change_password.php`, {
            user_id: user.id,
            old_password: oldPassword,
            new_password: newPassword,
        });

        if (response.data.success) {
            Alert.alert("Success", "Your password has been changed.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert("Error", response.data.message);
        }
    } catch (error) {
        Alert.alert("Error", "An unexpected error occurred.");
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.formContainer}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput style={styles.input} secureTextEntry value={oldPassword} onChangeText={setOldPassword} />

        <Text style={styles.label}>New Password</Text>
        <TextInput style={styles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

        <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={isSubmitting}>
            <Text style={styles.buttonText}>{isSubmitting ? "Saving..." : "Change Password"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#8E8E93', marginBottom: 8, marginLeft: 5 },
  input: { backgroundColor: '#1C1C1E', color: '#fff', paddingHorizontal: 15, paddingVertical: 15, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});