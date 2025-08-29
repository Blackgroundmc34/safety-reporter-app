import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './screens/AuthScreen';
import MainTabs from './MainTabs'; // We will move the Tab Navigator to a new file
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // We haven't finished checking for the user yet
    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#000' }}>
            <ActivityIndicator size="large" />
        </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // User is signed in, show the main app
        <Stack.Screen name="MainApp" component={MainTabs} />
      ) : (
        // No user is signed in, show the login/register screen
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