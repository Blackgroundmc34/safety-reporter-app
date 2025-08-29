import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

// Dummy data for our procedures list
const DUMMY_PROCEDURES = [
  { id: '1', title: 'Lockout/Tagout (LOTO)', category: 'Equipment Safety', icon: 'lock-check-outline' },
  { id: '2', title: 'Working at Heights', category: 'Personal Safety', icon: 'chart-gantt' },
  { id: '3', title: 'Confined Space Entry', category: 'Area Safety', icon: 'arrow-expand-all' },
  { id: '4', title: 'Hazardous Material Handling', category: 'Environmental', icon: 'barrel' },
  { id: '5', title: 'Emergency Evacuation Plan', category: 'Site Protocol', icon: 'exit-run' },
  { id: '6', title: 'Fire Extinguisher Use', category: 'Emergency', icon: 'fire-extinguisher' },
];

export default function ProceduresScreen({ navigation }) {
  const { theme } = useTheme(); // Get theme for styling
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProcedures = DUMMY_PROCEDURES.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProcedure = ({ item }) => (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate('ProcedureDetail', { procedureId: item.id, title: item.title })} // Navigate here!
    >
      <MaterialCommunityIcons name={item.icon} size={28} color={theme.primary} style={styles.itemIcon} />
      <View style={styles.itemTextContainer}>
        <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.itemCategory, { color: theme.textSecondary }]}>{item.category}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Safety Procedures</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <MaterialCommunityIcons name="magnify" size={22} color={theme.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search procedures..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredProcedures}
        renderItem={renderProcedure}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.textSecondary }]}>No procedures found.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Background color removed here as it's applied in SafeAreaView via theme
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Background color removed here as it's applied dynamically
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    // Color removed here as it's applied dynamically
    fontSize: 17,
    paddingVertical: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Background color removed here as it's applied dynamically
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
  itemTitle: {
    // Color removed here as it's applied dynamically
    fontSize: 17,
    fontWeight: '600',
  },
  itemCategory: {
    // Color removed here as it's applied dynamically
    fontSize: 14,
    marginTop: 2,
  },
  emptyText: {
      textAlign: 'center',
      // Color removed here as it's applied dynamically
      marginTop: 50,
  },
});