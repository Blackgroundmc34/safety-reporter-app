import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import EmergencyContactsScreen from './EmergencyContactsScreen'; 
// The SERVICES array remains the same
const SERVICES = [
  { id: '1', title: 'Report Incident', subtitle: 'Log a new hazard or event', icon: 'alert-circle-outline', action: 'navigate', target: 'ReportIncident' },
  { id: '2', title: 'Safety Procedures', subtitle: 'Review official guidelines', icon: 'clipboard-text-search-outline', action: 'navigate', target: 'Procedures' },
  { id: '3', title: 'Safety Leaderboard', subtitle: 'View top safety reporters', icon: 'trophy-outline', action: 'navigate', target: 'Leaderboard' },
    { id: '4', title: 'Emergency Contacts', subtitle: 'Quick access to numbers', icon: 'card-account-phone-outline', action: 'navigate', target: 'EmergencyContacts' }, 
  { id: '5', title: 'Start Compliance Audit', subtitle: 'Conduct a site audit', icon: 'clipboard-check-outline', action: 'navigate', target: 'Audit' },
  { id: '6', title: 'Predictive Maintenance', subtitle: 'Check equipment status', icon: 'chart-box-outline', action: 'navigate', target: 'Maintenance' },
];

// The ServiceTile component remains the same
const ServiceTile = ({ item, onPress, theme }) => {
  const styles = createStyles(theme);
  return (
    <TouchableOpacity style={styles.tile} onPress={onPress}>
      <MaterialCommunityIcons name={item.icon} size={36} color={theme.primary} />
      <Text style={styles.tileTitle}>{item.title}</Text>
      <Text style={styles.tileSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // --- NEW: State to hold the current date and time ---
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- NEW: useEffect to update the time every second ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update the state every second

    // This is a cleanup function that stops the timer when the component is removed
    return () => {
      clearInterval(timer);
    };
  }, []); // The empty array [] ensures this effect runs only once when the component mounts

  // --- NEW: Formatting options for date and time ---
  const timeString = currentDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const dateString = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });


  const handleTilePress = (item) => {
    if (item.action === 'navigate' && item.target) {
      navigation.navigate(item.target);
    } else {
      Alert.alert("Coming Soon!", "This feature is under development.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerGreeting}>MineSafe Reporter</Text>
        <Text style={styles.headerTime}>Let's make today a safe day</Text>

        {/* --- NEW: Display for Time and Date --- */}
        <View style={styles.dateTimeContainer}>
            <Text style={styles.timeText}>{timeString}</Text>
            <Text style={styles.dateText}>{dateString}</Text>
        </View>
      </View>

      <FlatList
        data={SERVICES}
        renderItem={({ item }) => (
            <ServiceTile item={item} onPress={() => handleTilePress(item)} theme={theme} />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        // Making the FlatList header the header view to ensure smooth scrolling
        // This is an alternative to placing the header outside
        // For this design, keeping it separate is fine as the list itself scrolls.
      />
    </SafeAreaView>
  );
}

// The stylesheet is updated with new styles for the date and time
const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerGreeting: {
    fontSize: 34,
    fontWeight: 'bold',
    color: theme.text,
  },
  headerTime: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.textSecondary,
    marginTop: 8,
  },
  // --- NEW STYLES ---
  dateTimeContainer: {
    marginTop: 25,
    marginBottom: 10,
  },
  timeText: {
    color: theme.text,
    fontSize: 48,
    fontWeight: 'bold',
  },
  dateText: {
    color: theme.textSecondary,
    fontSize: 18,
    fontWeight: '500',
  },
  // --- END NEW STYLES ---
  listContainer: {
    paddingHorizontal: 15,
  },
  row: {
    justifyContent: 'space-between',
  },
  tile: {
    backgroundColor: theme.card,
    width: '48%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    aspectRatio: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tileTitle: {
    color: theme.text,
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
  },
  tileSubtitle: {
    color: theme.textSecondary,
    fontSize: 13,
  },
});