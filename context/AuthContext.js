import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Using axios for cleaner API calls

const AuthContext = createContext();

// IMPORTANT: Use your computer's IP address here
const API_BASE_URL = 'http://172.20.10.3/safety_api'; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for a saved user session when the app loads
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load user from storage", e);
      }
      setIsLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login.php`, { email, password });
      if (response.data.success) {
        const loggedInUser = response.data.user;
        setUser(loggedInUser);
        await AsyncStorage.setItem('@user', JSON.stringify(loggedInUser));
        return { success: true };
      }
      return response.data; // { success: false, message: '...' }
    } catch (error) {
      return { success: false, message: 'An error occurred during login.' };
    }
  };
  
  const register = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register.php`, userData);
        return response.data; // { success: true/false, message: '...' }
    } catch (error) {
        return { success: false, message: 'An error occurred during registration.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
    } catch (e) {
      console.error("Failed to logout", e);
    }
  };

  // --- NEW FUNCTION TO HANDLE PROFILE UPDATES ---
  const updateProfile = async (userData) => {
    try {
      // Call the new API endpoint we created
      const response = await axios.post(`${API_BASE_URL}/update_profile.php`, userData);
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        // Update the user state globally throughout the app
        setUser(updatedUser); 
        // Update the user data stored on the device so it persists
        await AsyncStorage.setItem('@user', JSON.stringify(updatedUser)); 
      }
      
      return response.data; // Return the full response { success, message, user }
    } catch (error) {
      return { success: false, message: 'An error occurred while updating.' };
    }
  };

  return (
    // Add 'updateProfile' to the context value to make it available to other screens
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);