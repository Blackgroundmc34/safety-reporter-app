import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Switch, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth

// Reusable component for setting items, now supports onPress
const SettingsItem = ({ icon, text, onPress, children }) => (
    <TouchableOpacity style={styles.item} onPress={onPress} disabled={!onPress}>
        <MaterialCommunityIcons name={icon} size={22} color="#A0A0A0" style={styles.itemIcon} />
        <Text style={styles.itemText}>{text}</Text>
        <View>{children ? children : <MaterialCommunityIcons name="chevron-right" size={22} color="#8E8E93" />}</View>
    </TouchableOpacity>
);

export default function SettingsScreen({ navigation }) { // <-- Add navigation prop
  const { theme, themeName, setThemeName } = useTheme();
  const { user, logout } = useAuth(); // <-- Get user and logout function

  // States for our toggles
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [criticalNotifications, setCriticalNotifications] = useState(true);
  const [maintenanceNotifications, setMaintenanceNotifications] = useState(false);

  // Return a placeholder if user data isn't loaded yet
  if (!user) {
      return (
          <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} />
      );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        </View>
        
        {/* --- NEW: Account Section --- */}
        <Text style={styles.sectionHeader}>Account</Text>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
            <View style={styles.item}>
                <MaterialCommunityIcons name="account-circle-outline" size={22} color="#A0A0A0" style={styles.itemIcon} />
                <View>
                    <Text style={styles.itemText}>{user.full_name}</Text>
                    <Text style={styles.emailText}>{user.email}</Text>
                </View>
            </View>
        </View>

        {/* --- NEW: Profile Section --- */}
        <Text style={styles.sectionHeader}>Profile</Text>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
            <SettingsItem icon="account-edit-outline" text="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
            <View style={styles.divider} />
            <SettingsItem icon="lock-reset" text="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
        </View>

        {/* Appearance Section */}
        <Text style={styles.sectionHeader}>Appearance</Text>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
            <TouchableOpacity style={styles.themeItem} onPress={() => setThemeName('blue')}>
                <Text style={styles.itemText}>Default Blue</Text>
                {themeName === 'blue' && <MaterialCommunityIcons name="check-circle" size={24} color={themes.blue.primary} />}
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.themeItem} onPress={() => setThemeName('yellow')}>
                <Text style={styles.itemText}>High-Contrast Yellow</Text>
                {themeName === 'yellow' && <MaterialCommunityIcons name="check-circle" size={24} color={themes.yellow.primary} />}
            </TouchableOpacity>
        </View>

        {/* Notifications Section (now inside SettingsItem) */}
        <Text style={styles.sectionHeader}>Notifications</Text>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
            <SettingsItem icon="alert-outline" text="Critical Safety Alerts">
                <Switch value={criticalNotifications} onValueChange={setCriticalNotifications} trackColor={{ false: '#767577', true: theme.primary }} thumbColor={"#f4f3f4"} />
            </SettingsItem>
            <View style={styles.divider} />
            <SettingsItem icon="cog-outline" text="Maintenance Reminders">
                <Switch value={maintenanceNotifications} onValueChange={setMaintenanceNotifications} trackColor={{ false: '#767577', true: theme.primary }} thumbColor={"#f4f3f4"}/>
            </SettingsItem>
        </View>

        {/* Privacy & Security Section */}
        <Text style={styles.sectionHeader}>Privacy & Security</Text>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
            <SettingsItem icon="fingerprint" text="Enable Biometric Login">
                <Switch value={isBiometricEnabled} onValueChange={setIsBiometricEnabled} trackColor={{ false: '#767577', true: theme.primary }} thumbColor={"#f4f3f4"}/>
            </SettingsItem>
        </View>

        {/* --- NEW: Logout Button --- */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const themes = { blue: { primary: '#007AFF' }, yellow: { primary: '#FFD700' } };

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20 },
  headerTitle: { fontSize: 34, fontWeight: 'bold' },
  sectionHeader: { color: '#8E8E93', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', marginHorizontal: 20, marginBottom: 10, marginTop: 20 },
  section: { borderRadius: 12, marginHorizontal: 20, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#1C1C1E' },
  itemIcon: { marginRight: 15 },
  itemText: { flex: 1, color: '#fff', fontSize: 17 },
  emailText: { color: '#8E8E93', fontSize: 14, paddingTop: 2 },
  divider: { height: 1, backgroundColor: '#333', marginLeft: 52 },
  themeItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 18, backgroundColor: '#1C1C1E' },
  logoutButton: { margin: 20, padding: 15, alignItems: 'center', backgroundColor: '#2c1d1d', borderRadius: 12 },
  logoutButtonText: { color: '#FF6347', fontSize: 17, fontWeight: 'bold' },
});