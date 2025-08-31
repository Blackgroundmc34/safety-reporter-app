import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, StatusBar, Alert, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const EMERGENCY_CONTACTS = [
  { id: '1', name: 'Mine Rescue Team', role: 'Emergency Services', phone: '0112345678', icon: 'ambulance' },
  { id: '2', name: 'Site Supervisor', role: 'Management', phone: '0119876543', icon: 'account-hard-hat' },
  { id: '3', name: 'Medical Emergency', role: 'First Aid', phone: '0115551234', icon: 'medical-bag' },
  { id: '4', name: 'Security Control', role: 'Security', phone: '0117778899', icon: 'security' },
];

export default function EmergencyContactsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleCallPress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert("Error", "Could not open dialer.");
    });
  };

  const renderContact = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleCallPress(item.phone)}>
      <MaterialCommunityIcons name={item.icon} size={28} color={theme.primary} style={styles.itemIcon} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemRole}>{item.role}</Text>
      </View>
      <MaterialCommunityIcons name="phone" size={24} color={theme.primary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={EMERGENCY_CONTACTS}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No emergency contacts found.</Text>}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
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
    color: theme.text,
  },
  itemRole: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: theme.textSecondary,
  },
});
