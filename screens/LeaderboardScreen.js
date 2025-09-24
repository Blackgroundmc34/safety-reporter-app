import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'https://www.masilelamc.co.za/safety_api'; 

const getRankStyle = (rank) => {
  if (rank === 1) return { color: '#FFD700', icon: 'trophy-variant' };
  if (rank === 2) return { color: '#C0C0C0', icon: 'trophy-variant' };
  if (rank === 3) return { color: '#CD7F32', icon: 'trophy-variant' };
  return { color: '#8E8E93', icon: 'medal' };
};

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { user } = useAuth();

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchLeaderboard = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/get_leaderboard.php`);
          if (response.data.success) {
            const data = response.data.leaderboard;
            setLeaderboardData(data);
            
            const userIndex = data.findIndex(item => item.id === user.id);
            if (userIndex !== -1) {
              setCurrentUserRank({rank: userIndex + 1, points: data[userIndex].safety_points});
            }
          }
        } catch (error) {
          console.error("Failed to fetch leaderboard data:", error);
        }
        setIsLoading(false);
      };

      fetchLeaderboard();
    }, [user.id])
  );

  const renderItem = ({ item, index }) => {
    const rank = index + 1;
    const rankStyle = getRankStyle(rank);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.rankContainer}>
          <MaterialCommunityIcons name={rankStyle.icon} size={28} color={rankStyle.color} />
          <Text style={[styles.rankText, { color: rankStyle.color }]}>{rank}</Text>
        </View>
        <Text style={styles.itemName}>{item.full_name}</Text>
        <Text style={styles.itemPoints}>{item.safety_points} pts</Text>
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <FlatList
        data={leaderboardData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
      />
      
      {currentUserRank && (
        <View style={styles.footer}>
          <View style={styles.itemContainer}>
              <View style={styles.rankContainer}>
                  <MaterialCommunityIcons name="account-star" size={28} color={theme.primary} />
                  <Text style={[styles.rankText, { color: theme.primary }]}>{currentUserRank.rank}</Text>
              </View>
              <Text style={styles.itemName}>{user.full_name} (You)</Text>
              <Text style={styles.itemPoints}>{currentUserRank.points} pts</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, backgroundColor: theme.card, marginBottom: 10 },
  rankContainer: { flexDirection: 'row', alignItems: 'center', width: 60 },
  rankText: { fontSize: 18, fontWeight: 'bold', marginLeft: 8 },
  itemName: { flex: 1, fontSize: 17, fontWeight: '600', color: theme.text },
  itemPoints: { fontSize: 17, fontWeight: 'bold', color: theme.text },
  footer: { padding: 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: theme.border, backgroundColor: theme.background },
});
