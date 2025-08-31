import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, RefreshControl, StatusBar, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.6.152/safety_api';
const STORAGE_KEY = '@offline_reports';

export default function HistoryScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // This function now loads reports from BOTH the server and local storage
  const loadAllReports = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // --- Step 1: Fetch reports from the server ---
      let serverReports = [];
      const serverResponse = await axios.get(`${API_BASE_URL}/get_my_reports.php`, {
        params: { user_id: user.id }
      });
      if (serverResponse.data.success) {
        // Add a 'status' to each server report
        serverReports = serverResponse.data.reports.map(report => ({ ...report, status: 'Synced' }));
      }

      // --- Step 2: Fetch reports from local offline storage ---
      let localReports = [];
      const localData = await AsyncStorage.getItem(STORAGE_KEY);
      if (localData) {
        // Add a 'status' to each local report
        localReports = JSON.parse(localData).map(report => ({ ...report, status: 'Pending' }));
      }

      // --- Step 3: Merge and sort the reports ---
      // We combine both lists, then sort them by date to show the most recent first
      const combinedReports = [...localReports, ...serverReports];
      combinedReports.sort((a, b) => new Date(b.incident_time) - new Date(a.incident_time));

      setReports(combinedReports);

    } catch (error) {
      console.error("Failed to load reports.", error);
      // Even if server fails, try to load local reports
      try {
        const localData = await AsyncStorage.getItem(STORAGE_KEY);
        if (localData) setReports(JSON.parse(localData).map(r => ({...r, status: 'Pending'})));
      } catch (e) {}
    }
    setIsLoading(false);
  }, [user]);

  // useFocusEffect runs every time the screen comes into view
  useFocusEffect(
    useCallback(() => {
      loadAllReports();
    }, [loadAllReports])
  );
  
  // This is for the "pull-to-refresh" feature
  const onRefresh = useCallback(() => {
      loadAllReports();
  }, [loadAllReports]);

  // The ReportItem component is now smarter about displaying status
  const ReportItem = ({ item }) => {
    const isSynced = item.status === 'Synced';
    const statusColor = isSynced ? '#34C759' : '#FFD700';
    const statusIcon = isSynced ? 'cloud-check-outline' : 'upload-outline';
    
    return (
        <View style={[styles.itemContainer, { backgroundColor: theme.card }]}>
            <MaterialCommunityIcons name="file-chart-outline" size={28} color={theme.textSecondary} style={styles.itemIcon} />
            <View style={styles.itemTextContainer}>
                <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.itemSubtitle, { color: theme.textSecondary }]}>{item.location}</Text>
                <Text style={[styles.itemDate, { color: theme.textSecondary }]}>
                    {new Date(item.incident_time).toLocaleString()}
                </Text>
            </View>
            <View style={styles.statusContainer}>
                <MaterialCommunityIcons name={statusIcon} size={20} color={statusColor} />
                <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
            </View>
        </View>
    );
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Reports</Text>
      </View>
      <FlatList
        data={reports}
        renderItem={ReportItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={theme.text} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>You haven't submitted any reports yet.</Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary, opacity: 0.5 }]}>Pull down to refresh.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 34, fontWeight: 'bold' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, marginBottom: 10 },
  itemIcon: { marginRight: 15 },
  itemTextContainer: { flex: 1 },
  itemTitle: { fontSize: 17, fontWeight: '600' },
  itemSubtitle: { fontSize: 14, marginTop: 4 },
  itemDate: { fontSize: 12, marginTop: 6 },
  statusContainer: { alignItems: 'center', width: 60 },
  statusText: { fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  emptyContainer: { marginTop: 50, alignItems: 'center', paddingHorizontal: 20 },
  emptyText: { fontSize: 16, textAlign: 'center' },
  emptySubtext: { fontSize: 14, textAlign: 'center', marginTop: 8 },
});