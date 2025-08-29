import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function EditProfileScreen({ navigation }) {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();

  // Pre-fill the form with the current user's data
  const [fullName, setFullName] = useState(user.full_name);
  const [employeeId, setEmployeeId] = useState(user.employee_id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    if (!fullName || !employeeId) {
        Alert.alert("Error", "Fields cannot be empty.");
        return;
    }
    setIsSubmitting(true);
    const result = await updateProfile({ 
        user_id: user.id, 
        full_name: fullName, 
        employee_id: employeeId 
    });

    if (result.success) {
        Alert.alert("Success", "Your profile has been updated.", [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    } else {
        Alert.alert("Update Failed", result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.formContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

        <Text style={styles.label}>Employee ID</Text>
        <TextInput style={styles.input} value={employeeId} onChangeText={setEmployeeId} />

        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={isSubmitting}>
            <Text style={styles.buttonText}>{isSubmitting ? "Saving..." : "Save Changes"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Re-using styles from other screens for consistency
const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: { padding: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#8E8E93', marginBottom: 8, marginLeft: 5 },
  input: { backgroundColor: '#1C1C1E', color: '#fff', paddingHorizontal: 15, paddingVertical: 15, borderRadius: 12, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});