import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, StatusBar, Alert, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; // Import useTheme for styling

// Dummy data for emergency contacts
const EMERGENCY_CONTACTS = [
  { id: '1', name: 'Mine Rescue Team', role: 'Emergency Services', phone: '0112345678', icon: 'ambulance' },
  { id: '2', name: 'Site Supervisor', role: 'Management', phone: '0119876543', icon: 'account-hard-hat' },
  { id: '3', name: 'Medical Emergency', role: 'First Aid', phone: '0115551234', icon: 'medical-bag' },
  { id: '4', name: 'Security Control', role: 'Security', phone: '0117778899', icon: 'security' },
  { id: '5', name: 'Environmental Officer', role: 'Safety Department', phone: '0113334455', icon: 'leaf' },
];

export default function EmergencyContactsScreen() {
  const { theme } = useTheme(); // Get the current theme

  const handleCallPress = (phoneNumber) => {
    // Use Linking to open the phone dialer
    Linking.openURL(`tel:${phoneNumber}`).catch(err => {
      console.error("Failed to open dialer:", err);
      Alert.alert("Error", "Could not open dialer. Please dial " + phoneNumber + " manually.");
    });
  };

  const renderContact = ({ item }) => (
    <TouchableOpacity style={[styles.itemContainer, { backgroundColor: theme.card }]} onPress={() => handleCallPress(item.phone)}>
      <MaterialCommunityIcons name={item.icon} size={28} color={theme.primary} style={styles.itemIcon} />
      <View style={styles.itemTextContainer}>
        <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.itemRole, { color: theme.textSecondary }]}>{item.role}</Text>
      </View>
      <MaterialCommunityIcons name="phone" size={24} color={theme.primary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Emergency Contacts</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Tap a contact to dial immediately.</Text>
      </View>

      <FlatList
        data={EMERGENCY_CONTACTS}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.textSecondary }]}>No emergency contacts found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 15,
    marginTop: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  itemIcon: {
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '600',
  },
  itemRole: {
    fontSize: 14,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
  },
});