import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.6.152/safety_api';

export default function ChangePasswordScreen({ navigation }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const styles = createStyles(theme);
  
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.formContainer}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput style={styles.input} secureTextEntry value={oldPassword} onChangeText={setOldPassword} placeholderTextColor="#666" />

        <Text style={styles.label}>New Password</Text>
        <TextInput style={styles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} placeholderTextColor="#666" />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} placeholderTextColor="#666" />

        <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={isSubmitting}>
            <Text style={styles.buttonText}>{isSubmitting ? "Saving..." : "Change Password"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  formContainer: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: theme.textSecondary, marginBottom: 8, marginLeft: 5 },
  input: { backgroundColor: theme.card, color: theme.text, padding: 15, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: theme.primary, padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
