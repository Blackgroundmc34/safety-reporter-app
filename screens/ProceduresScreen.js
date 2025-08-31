import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const DUMMY_PROCEDURES = [
  { id: '1', title: 'Lockout/Tagout (LOTO)', category: 'Equipment Safety', icon: 'lock-check-outline' },
  { id: '2', title: 'Working at Heights', category: 'Personal Safety', icon: 'chart-gantt' },
  { id: '3', title: 'Confined Space Entry', category: 'Area Safety', icon: 'arrow-expand-all' },
  { id: '4', title: 'Hazardous Material Handling', category: 'Environmental', icon: 'barrel' },
  { id: '5', title: 'Emergency Evacuation Plan', category: 'Site Protocol', icon: 'exit-run' },
  { id: '6', title: 'Fire Extinguisher Use', category: 'Emergency', icon: 'fire-extinguisher' },
];

export default function ProceduresScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProcedures = DUMMY_PROCEDURES.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProcedure = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ProcedureDetail', { procedureId: item.id, title: item.title })}
    >
      <MaterialCommunityIcons name={item.icon} size={28} color={theme.primary} style={styles.itemIcon} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={22} color={theme.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
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
        ListEmptyComponent={<Text style={styles.emptyText}>No procedures found.</Text>}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: theme.text,
    fontSize: 17,
    paddingVertical: 12,
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
  itemTitle: {
    color: theme.text,
    fontSize: 17,
    fontWeight: '600',
  },
  itemCategory: {
    color: theme.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  emptyText: {
      textAlign: 'center',
      color: theme.textSecondary,
      marginTop: 50,
  },
});
