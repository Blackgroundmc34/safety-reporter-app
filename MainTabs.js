import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from './context/ThemeContext';

// Import all screens for the Employee user flow
import HomeScreen from './screens/HomeScreen';
import ReportScreen from './screens/ReportScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProceduresScreen from './screens/ProceduresScreen';
import ProcedureDetailScreen from './screens/ProcedureDetailScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import EmergencyContactsScreen from './screens/EmergencyContactsScreen';
import ComplianceAuditScreen from './screens/ComplianceAuditScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// This stack contains all screens reachable from the Home tab
function HomeStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ReportIncident" component={ReportScreen} options={{ title: 'Report Incident', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
      <Stack.Screen name="Procedures" component={ProceduresScreen} options={{ title: 'Safety Procedures', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Safety Leaderboard', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
      <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} options={{ title: 'Emergency Contacts', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
      <Stack.Screen name="Audit" component={ComplianceAuditScreen} options={{ title: 'Compliance Audit', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
      <Stack.Screen
        name="ProcedureDetail"
        component={ProcedureDetailScreen}
        options={({ route }) => ({
            title: route.params.title || 'Procedure Details',
            headerStyle: { backgroundColor: theme.card },
            headerTintColor: theme.text,
            headerBackTitle: ' ',
        })}
      />
    </Stack.Navigator>
  );
}

// Settings stack is shared between roles
function SettingsStack() {
    const { theme } = useTheme();
    return (
        <Stack.Navigator>
            <Stack.Screen name="SettingsMain" component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password', headerStyle: { backgroundColor: theme.card }, headerTintColor: theme.text, headerBackTitle: ' ' }} />
        </Stack.Navigator>
    )
}

// MainTabs defines the employee's main navigation
export default function MainTabs() {
    const { theme } = useTheme();
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
