import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Dummy data inspired by the Predictive Maintenance idea in the project document.
// The risk levels are determined by simplified rules, as suggested for the hackathon.
const DUMMY_EQUIPMENT = [
  { 
    id: 'EQUIP-001', 
    name: 'Pump 1', 
    location: 'Zone 1', 
    status: 'Running', 
    risk: 'Low', // e.g., Vibration < 6.0
    lastReading: '2025-06-08T22:10:00Z',
    details: 'Vibration: 4.2 mm/s, Temp: 55°C',
  },
  { 
    id: 'EQUIP-002', 
    name: 'Pump 3', 
    location: 'Zone 5', 
    status: 'Alert', 
    risk: 'High', // e.g., Vibration > 7.0
    lastReading: '2025-06-08T23:05:00Z',
    details: 'Vibration: 7.5 mm/s, Temp: 72°C',
  },
  { 
    id: 'EQUIP-003', 
    name: 'Crusher A', 
    location: 'Crusher Area', 
    status: 'Warning', 
    risk: 'Medium', // e.g., Temp > 65°C
    lastReading: '2025-06-08T21:45:00Z',
    details: 'Vibration: 5.8 mm/s, Temp: 68°C',
  },
  { 
    id: 'EQUIP-004', 
    name: 'Conveyor Belt 2', 
    location: 'Processing', 
    status: 'Maintenance', 
    risk: 'N/A', 
    lastReading: '2025-06-07T14:00:00Z',
    details: 'Currently offline for scheduled maintenance.',
  },
  { 
    id: 'EQUIP-005', 
    name: 'Generator B', 
    location: 'Power House', 
    status: 'Running', 
    risk: 'Low', 
    lastReading: '2025-06-08T22:50:00Z',
    details: 'Vibration: 3.8 mm/s, Temp: 60°C',
  },
];

// This function returns a specific color based on the risk level
const getRiskColor = (risk) => {
  switch (risk) {
    case 'High':
      return '#FF6347'; // Red/Tomato
    case 'Medium':
      return '#FFD700'; // Yellow/Gold
    case 'Low':
      return '#34C759'; // Green
    default:
      return '#8E8E93'; // Grey for N/A
  }
};

export default function PredictiveMaintenanceScreen({ navigation }) {

  const EquipmentItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => Alert.alert(item.name, item.details)}>
      <View style={[styles.riskIndicator, { backgroundColor: getRiskColor(item.risk) }]} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemSubtitle}>{item.location} - Status: {item.status}</Text>
      </View>
      <View style={styles.riskLabelContainer}>
        <Text style={[styles.riskLabel, { color: getRiskColor(item.risk) }]}>{item.risk}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>5</Text>
            <Text style={styles.summaryLabel}>Monitored</Text>
        </View>
        <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, {color: getRiskColor('High')}]}>1</Text>
            <Text style={styles.summaryLabel}>Alerts</Text>
        </View>
        <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, {color: getRiskColor('Low')}]}>2</Text>
            <Text style={styles.summaryLabel}>Nominal</Text>
        </View>
      </View>

      <FlatList
        data={DUMMY_EQUIPMENT}
        renderItem={EquipmentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  summaryCard: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 12,
    marginTop: 15,
  },
  riskIndicator: {
    width: 8,
    height: '100%',
    borderRadius: 4,
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  itemSubtitle: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 4,
  },
  riskLabelContainer: {
    paddingHorizontal: 10,
  },
  riskLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});