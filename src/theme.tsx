import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { Platform, type ViewStyle } from 'react-native';
import { customFontNames, layout, shadowPresets, systemFonts } from './foundations';
import { darkTokens, lightTokens } from './tokens';

export { darkTokens, lightTokens } from './tokens';
export type { ThemeTokens } from './tokens';
export type ThemeMode = 'dark' | 'light';

const platformFont = Platform.select<{ sans: string; medium: string; mono: string }>({
  ...systemFonts, default: systemFonts.ios,
});
const fonts = {
  sans: platformFont.sans, disp: platformFont.sans, libre: platformFont.sans, mono: platformFont.mono,
  ...customFontNames,
};
const fontWeights = {
  sansRegular: platformFont.sans, sansMedium: platformFont.medium, sansBold: platformFont.sans,
  dispRegular: platformFont.sans, dispMedium: platformFont.medium, dispBold: platformFont.sans,
  monoRegular: platformFont.mono, libreRegular: platformFont.sans, libreBold: platformFont.sans,
};
const shadows = {
  soft: Platform.select<ViewStyle>({ ios: shadowPresets.soft.ios, android: shadowPresets.soft.android, default: {} }),
  card: Platform.select<ViewStyle>({ ios: shadowPresets.card.ios, android: shadowPresets.card.android, default: {} }),
  btn: Platform.select<ViewStyle>({ ios: shadowPresets.btn.ios, android: shadowPresets.btn.android, default: {} }),
};
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
    shadows,
  }), [mode]);
}
