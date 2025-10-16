import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors | typeof darkColors;
};

const lightColors = {
  background: '#F5F5F7',
  cardBackground: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  primary: '#578FFF',
  success: '#34C759',
  warning: '#FFD700',
  danger: '#FF4D4D',
  border: '#E5E5EA',
  shadow: '#000000',
  inputBackground: '#F2F2F7',
  inputBorder: '#D1D1D6',
  headerBackground: '#FFFFFF',
};

const darkColors = {
  background: '#1A1A1A',
  cardBackground: '#2C2C2C',
  text: '#E0E0E0',
  textSecondary: '#B0B0B0',
  primary: '#578FFF',
  success: '#34C759',
  warning: '#FFD700',
  danger: '#FF4D4D',
  border: '#3A3A3C',
  shadow: '#000000',
  inputBackground: '#2C2C2C',
  inputBorder: '#3A3A3C',
  headerBackground: '#2C2C2C',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = '@LifeBridge:Theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  if (isLoading) {
    return null; // or a loading screen
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
