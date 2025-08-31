import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// IMPORTANT: Use your computer's IP address here
const API_BASE_URL = 'http://192.168.6.152/safety_api'; 

// This function returns a color and icon for the top 3 ranks
const getRankStyle = (rank) => {
  if (rank === 1) return { color: '#FFD700', icon: 'trophy-variant' }; // Gold
  if (rank === 2) return { color: '#C0C0C0', icon: 'trophy-variant' }; // Silver
  if (rank === 3) return { color: '#CD7F32', icon: 'trophy-variant' }; // Bronze
  return { color: '#8E8E93', icon: 'medal' };
};

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const { user } = useAuth(); // Get the currently logged-in user

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // useFocusEffect will run every time the user navigates to this screen
  useFocusEffect(
    useCallback(() => {
      const fetchLeaderboard = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/get_leaderboard.php`);
          if (response.data.success) {
            const data = response.data.leaderboard;
            setLeaderboardData(data);
            
            // Find the current user's rank in the fetched data
            const userIndex = data.findIndex(item => item.id === user.id);
            if (userIndex !== -1) {
              setCurrentUserRank(userIndex + 1);
            }
          }
        } catch (error) {
          console.error("Failed to fetch leaderboard data:", error);
        }
        setIsLoading(false);
      };

      fetchLeaderboard();
    }, [user.id]) // Dependency array ensures it refetches if the user changes
  );

  const renderItem = ({ item, index }) => {
    const rank = index + 1;
    const rankStyle = getRankStyle(rank);

    return (
      <View style={[styles.itemContainer, { backgroundColor: theme.card }]}>
        <View style={styles.rankContainer}>
          <MaterialCommunityIcons name={rankStyle.icon} size={28} color={rankStyle.color} />
          <Text style={[styles.rankText, { color: rankStyle.color }]}>{rank}</Text>
        </View>
        <Text style={[styles.itemName, { color: theme.text }]}>{item.full_name}</Text>
        <Text style={[styles.itemPoints, { color: theme.text }]}>{item.safety_points} pts</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Safety Leaderboard</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Top reporters contributing to our safety culture</Text>
      </View>

      <FlatList
        data={leaderboardData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />
      
      {/* Fixed footer showing the current user's rank */}
      {currentUserRank && (
        <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
          <View style={[styles.itemContainer, { backgroundColor: theme.card, marginTop: 0 }]}>
              <View style={styles.rankContainer}>
                  <MaterialCommunityIcons name="account-star" size={28} color={theme.primary} />
                  <Text style={[styles.rankText, { color: theme.primary }]}>{currentUserRank}</Text>
              </View>
              <Text style={[styles.itemName, { color: theme.text }]}>{user.full_name} (You)</Text>
              <Text style={[styles.itemPoints, { color: theme.text }]}>{user.safety_points} pts</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1C1C1E' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 15, marginTop: 5 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, marginTop: 15 },
  rankContainer: { flexDirection: 'row', alignItems: 'center', width: 60 },
  rankText: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  itemName: { flex: 1, fontSize: 17, fontWeight: '600' },
  itemPoints: { fontSize: 17, fontWeight: 'bold' },
  footer: { padding: 20, paddingTop: 10, borderTopWidth: 1 },
});