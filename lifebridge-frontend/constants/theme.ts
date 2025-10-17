// ============================================
// 🎨 LIFEBRIDGE THEME SYSTEM
// ============================================
// Modern, accessible color palette with dark/light mode support
// Primary: Muted Sky Blue (#8EC5FC) - Clean, trustworthy, energetic
// Secondary: Pale Mint Green (#B8F1B0) - Fresh, comforting, balanced
// Base: Soft Neutral White (#F7F9FB) - Readable, light, inviting

import { Platform } from 'react-native';

export interface ThemeColors {
  // Primary Colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryRgba: (opacity: number) => string;
  
  // Secondary Colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  secondaryRgba: (opacity: number) => string;
  
  // Background Colors
  background: string;
  backgroundSecondary: string;
  backgroundCard: string;
  backgroundModal: string;
  
  // Text Colors
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  
  // Surface Colors
  surface: string;
  surfaceElevated: string;
  border: string;
  borderLight: string;
  
  // Status Colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Accent Colors
  accent: string;
  accentLight: string;
  
  // Shadow Colors
  shadow: string;
  shadowLight: string;
  
  // Tab Colors (for compatibility)
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

// Light Mode Theme
export const lightTheme: ThemeColors = {
  // Primary: Muted Sky Blue
  primary: '#8EC5FC',
  primaryLight: '#A8D3FD',
  primaryDark: '#6BB6FB',
  primaryRgba: (opacity: number) => `rgba(142, 197, 252, ${opacity})`,
  
  // Secondary: Pale Mint Green
  secondary: '#B8F1B0',
  secondaryLight: '#C8F5C0',
  secondaryDark: '#A1EC96',
  secondaryRgba: (opacity: number) => `rgba(184, 241, 176, ${opacity})`,
  
  // Backgrounds: Soft Neutral White
  background: '#F7F9FB',
  backgroundSecondary: '#FFFFFF',
  backgroundCard: '#FFFFFF',
  backgroundModal: '#FFFFFF',
  
  // Text Colors
  text: '#1A1D29',
  textSecondary: '#4A5568',
  textMuted: '#718096',
  textInverse: '#FFFFFF',
  
  // Surface Colors
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // Status Colors
  success: '#B8F1B0',
  warning: '#FBD38D',
  error: '#FEB2B2',
  info: '#8EC5FC',
  
  // Accent Colors
  accent: '#6BB6FB',
  accentLight: '#A8D3FD',
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  
  // Tab Colors
  tint: '#8EC5FC',
  icon: '#718096',
  tabIconDefault: '#718096',
  tabIconSelected: '#8EC5FC',
};

// Dark Mode Theme
export const darkTheme: ThemeColors = {
  // Primary: Muted Sky Blue (adjusted for dark backgrounds)
  primary: '#6BB6FB',
  primaryLight: '#8EC5FC',
  primaryDark: '#4A9AF9',
  primaryRgba: (opacity: number) => `rgba(107, 182, 251, ${opacity})`,
  
  // Secondary: Pale Mint Green (adjusted for dark backgrounds)
  secondary: '#A1EC96',
  secondaryLight: '#B8F1B0',
  secondaryDark: '#8AE87C',
  secondaryRgba: (opacity: number) => `rgba(161, 236, 150, ${opacity})`,
  
  // Backgrounds: Dark variants
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  backgroundCard: '#1E293B',
  backgroundModal: '#334155',
  
  // Text Colors
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textInverse: '#1A1D29',
  
  // Surface Colors
  surface: '#1E293B',
  surfaceElevated: '#334155',
  border: '#334155',
  borderLight: '#475569',
  
  // Status Colors
  success: '#A1EC96',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#6BB6FB',
  
  // Accent Colors
  accent: '#8EC5FC',
  accentLight: '#A8D3FD',
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.15)',
  
  // Tab Colors
  tint: '#8EC5FC',
  icon: '#94A3B8',
  tabIconDefault: '#94A3B8',
  tabIconSelected: '#8EC5FC',
};

// Legacy Colors object for backward compatibility
export const Colors = {
  light: {
    text: lightTheme.text,
    background: lightTheme.background,
    tint: lightTheme.tint,
    icon: lightTheme.icon,
    tabIconDefault: lightTheme.tabIconDefault,
    tabIconSelected: lightTheme.tabIconSelected,
  },
  dark: {
    text: darkTheme.text,
    background: darkTheme.background,
    tint: darkTheme.tint,
    icon: darkTheme.icon,
    tabIconDefault: darkTheme.tabIconDefault,
    tabIconSelected: darkTheme.tabIconSelected,
  },
};

// Common spacing and sizing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// Shadow presets
export const shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Animation durations
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export type Theme = 'light' | 'dark';

export const getTheme = (theme: Theme): ThemeColors => {
  return theme === 'dark' ? darkTheme : lightTheme;
};

// Font configuration (preserved from original)
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});