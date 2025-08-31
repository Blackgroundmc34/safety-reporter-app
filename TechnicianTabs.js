import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from './context/ThemeContext';

// Import the screens required for the technician's workflow
import TechnicianTasksScreen from './screens/TechnicianTasksScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// A dedicated stack navigator for the Settings tab to handle sub-screens
function TechnicianSettingsStack() {
    const { theme } = useTheme();
    const screenOptions = {
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
        headerBackTitle: ' ',
    };
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="SettingsMain" component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
        </Stack.Navigator>
    )
}


// This is the main component for the technician's UI. 
// The "export default" is the key fix that makes it a valid component for the navigator.
export default function TechnicianTabs() {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, 
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'My Tasks') {
                        iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'cog' : 'cog-outline';
                    }
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarStyle: { 
                    backgroundColor: theme.card, 
                    borderTopColor: theme.border 
                },
                headerStyle: { backgroundColor: theme.card },
                headerTitleStyle: { color: theme.text },
            })}
        >
            <Tab.Screen 
                name="My Tasks" 
                component={TechnicianTasksScreen}
                // This makes the header visible for this specific tab
                options={{ headerShown: true, title: 'My Assigned Tasks' }}
            />
            <Tab.Screen 
                name="Settings" 
                component={TechnicianSettingsStack}
            />
        </Tab.Navigator>
    );
}

