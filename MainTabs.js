import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from './context/ThemeContext'; // cite: ThemeContext.js

// Import ALL screens
import HomeScreen from './screens/HomeScreen'; // cite: HomeScreen.js
import ReportScreen from './screens/ReportScreen'; // cite: ReportScreen.js
import HistoryScreen from './screens/HistoryScreen'; // cite: HistoryScreen.js
import SettingsScreen from './screens/SettingsScreen'; // cite: SettingsScreen.js
import ProceduresScreen from './screens/ProceduresScreen'; // cite: ProceduresScreen.js
import PredictiveMaintenanceScreen from './screens/PredictiveMaintenanceScreen'; // cite: PredictiveMaintenanceScreen.js
import ComplianceAuditScreen from './screens/ComplianceAuditScreen'; // cite: ComplianceAuditScreen.js
import LeaderboardScreen from './screens/LeaderboardScreen'; // cite: LeaderboardScreen.js
import EditProfileScreen from './screens/EditProfileScreen'; // cite: EditProfileScreen.js
import ChangePasswordScreen from './screens/ChangePasswordScreen'; // cite: ChangePasswordScreen.js
import EmergencyContactsScreen from './screens/EmergencyContactsScreen'; // cite: EmergencyContactsScreen.js
import ProcedureDetailScreen from './screens/ProcedureDetailScreen'; // NEW: Import ProcedureDetailScreen

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// HomeStack definition
function HomeStack() {
  const { theme } = useTheme(); // cite: ThemeContext.js
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ReportIncident" component={ReportScreen} options={{ title: 'Report Incident', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
      <Stack.Screen name="Procedures" component={ProceduresScreen} options={{ title: 'Safety Procedures', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
      <Stack.Screen name="Maintenance" component={PredictiveMaintenanceScreen} options={{ title: 'Predictive Maintenance', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
      <Stack.Screen name="Audit" component={ComplianceAuditScreen} options={{ title: 'Compliance Audit', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Safety Leaderboard', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} options={{ title: 'Emergency Contacts', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
      {/* NEW: ProcedureDetailScreen added to HomeStack */}
      <Stack.Screen
        name="ProcedureDetail"
        component={ProcedureDetailScreen}
        options={({ route }) => ({
            title: route.params.title || 'Procedure Details', // Dynamically set title from passed params
            headerStyle: { backgroundColor: theme.card },
            headerTintColor: theme.text,
            headerBackTitle: ' ',
        })}
      />
    </Stack.Navigator>
  );
}

// SettingsStack definition
function SettingsStack() {
    const { theme } = useTheme(); // cite: ThemeContext.js
    return (
        <Stack.Navigator>
            <Stack.Screen name="SettingsMain" component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
        </Stack.Navigator>
    )
}

// MainTabs definition
export default function MainTabs() {
    const { theme } = useTheme(); // cite: ThemeContext.js
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'History') iconName = focused ? 'history' : 'history';
                    else if (route.name === 'Settings') iconName = focused ? 'cog' : 'cog-outline';
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Settings" component={SettingsStack} />
        </Tab.Navigator>
    );
}