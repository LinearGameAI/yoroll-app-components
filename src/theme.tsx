import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { Platform } from 'react-native';

export type ThemeMode = 'dark' | 'light';

const brand = {
  orange: '#FF8652',
  orange4: '#F26F3D',
  orange7: '#FF9CD5',
  dark: '#1C1E22',
  textWrong: '#FA6969',
};

export const darkTokens = {
  ...brand,
  primary: '#FFFFFF',
  textPrimary: '#F5F5F4',
  textSecondary: '#D6D6D4',
  textTertiary: '#6B6B68',
  bgPrimary: '#0B0B0D',
  bgSecondary: '#1C1C1E',
  bgTertiary: '#2A2A2C',
  bgCard: '#17171A',
  bgPicked: 'rgba(255,134,82,0.28)',
  cardStroke: 'rgba(255,255,255,0.10)',
};

export type ThemeTokens = typeof darkTokens;

export const lightTokens: ThemeTokens = {
  ...brand,
  primary: '#21242C',
  textPrimary: '#191919',
  textSecondary: '#2E2E2E',
  textTertiary: '#9A9A97',
  bgPrimary: '#FAFAF9',
  bgSecondary: '#F1F1EF',
  bgTertiary: '#E3E3E0',
  bgCard: '#FFFFFF',
  bgPicked: 'rgba(255,134,82,0.20)',
  cardStroke: 'rgba(0,0,0,0.10)',
};

const family = Platform.select({ web: 'system-ui', android: 'sans-serif', default: 'System' });
const medium = Platform.select({ android: 'sans-serif-medium', default: family });
const fonts = { sans: family };
const fontWeights = { sansMedium: medium, sansBold: family, dispMedium: medium };
const layout = { gutter: 12, topBarH: 48 };
const ThemeContext = createContext<ThemeMode>('dark');

export function YorollThemeProvider({ mode = 'dark', children }: { mode?: ThemeMode; children: ReactNode }) {
  return <ThemeContext.Provider value={mode}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const mode = useContext(ThemeContext);
  return useMemo(() => ({
    mode,
    tokens: mode === 'dark' ? darkTokens : lightTokens,
    fonts,
    fontWeights,
    layout,
  }), [mode]);
}
