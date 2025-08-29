import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- NEW: Reusable component for an input field with an icon ---
const InputWithIcon = ({ iconName, placeholder, value, onChangeText, secureTextEntry = false, keyboardType = 'default', autoCapitalize = 'sentences' }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.inputContainer}>
            <MaterialCommunityIcons name={iconName} size={22} color={theme.textSecondary} style={styles.icon} />
            <TextInput
                style={styles.textInput}
                placeholder={placeholder}
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
            />
        </View>
    );
};


export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  const { login, register } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleLogin = async () => {
      if (!email || !password) {
          Alert.alert("Error", "Please enter both email and password.");
          return;
      }
      const result = await login(email, password);
      if (!result.success) {
          Alert.alert("Login Failed", result.message);
      }
  };

  const handleRegister = async () => {
      if (!fullName || !employeeId || !email || !password) {
          Alert.alert("Error", "Please fill in all fields.");
          return;
      }
      const result = await register({ full_name: fullName, employee_id: employeeId, email, password });
      if (result.success) {
          Alert.alert("Success", "Registration successful! Please log in.", [
              { text: "OK", onPress: () => setIsLogin(true) }
          ]);
      } else {
          Alert.alert("Registration Failed", result.message);
      }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>MineSafe Reporter</Text>
        <Text style={styles.subtitle}>{isLogin ? 'Welcome Back' : 'Create an Account'}</Text>
      </View>

      <View style={styles.form}>
        {!isLogin && (
            <>
                <InputWithIcon iconName="account-outline" placeholder="Full Name" value={fullName} onChangeText={setFullName} />
                <InputWithIcon iconName="card-account-details-outline" placeholder="Employee ID" value={employeeId} onChangeText={setEmployeeId} />
            </>
        )}
        <InputWithIcon iconName="email-outline" placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <InputWithIcon iconName="lock-outline" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={isLogin ? handleLogin : handleRegister}>
          <Text style={styles.buttonText}>{isLogin ? 'Log In' : 'Register'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Log In'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { color: theme.text, fontSize: 32, fontWeight: 'bold' },
  subtitle: { color: theme.textSecondary, fontSize: 18, marginTop: 8 },
  form: { paddingHorizontal: 30 },
  // --- NEW STYLES ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  icon: {
      marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: theme.text,
    paddingVertical: 15,
    fontSize: 16,
  },
  // --- END NEW STYLES ---
  button: { backgroundColor: theme.primary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  switchText: { color: theme.textSecondary, textAlign: 'center', marginTop: 20, fontSize: 16 }
});