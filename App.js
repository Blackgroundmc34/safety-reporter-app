import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './screens/AuthScreen';
import MainTabs from './MainTabs'; // For Employees
import TechnicianTabs from './TechnicianTabs'; // For Technicians
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          {/* --- ROLE-BASED NAVIGATION --- */}
          {user.role === 'technician' ? (
            <Stack.Screen name="TechnicianApp" component={TechnicianTabs} />
          ) : (
            <Stack.Screen name="MainApp" component={MainTabs} />
          )}
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000'
    }
});

