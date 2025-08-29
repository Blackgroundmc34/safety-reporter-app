import React, { createContext, useState, useContext } from 'react';

// Define the color schemes for our themes
const themes = {
  blue: {
    primary: '#007AFF', // Vibrant Blue
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#333',
  },
  yellow: {
    primary: '#FFD700', // High-Contrast Yellow
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#333',
  }
};

// Create the context
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('blue');
  const theme = themes[themeName];

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the theme context easily
export const useTheme = () => useContext(ThemeContext);