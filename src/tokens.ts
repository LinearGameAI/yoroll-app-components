// Semantic colors from YorollApp/src/theme/tokens.ts.

export const darkTokens = {
  // Brand (unchanged)
  orange: '#FF8652',
  orange5: '#E65E2E',
  orange4: '#F26F3D',
  orange3: '#FFB08A',
  orange2: '#FFD9C7',
  orange1: '#3A2318',
  orange6: '#FFD15C',
  orange7: '#FF9CD5',
  dark: '#1C1E22',
  primary: '#FFFFFF',

  // Text — inverted
  textPrimary: '#F5F5F4',
  textSecondary: '#D6D6D4',
  textTertiary: '#6B6B68',
  textFourth: '#2A2A28',
  textWrong: '#FA6969',
  textLink: '#4D9BFF',
  textRight: '#15B174',
  textProblem: '#F8C24D',

  // Background — true dark, Apple-style
  bgHover: '#1C1C1E',
  bgPrimary: '#0B0B0D',
  bgSecondary: '#1C1C1E',
  bgTertiary: '#2A2A2C',
  bgFourth: '#48484A',
  bgFifth: '#8E8E93',
  bgCard: '#17171A',
  bgHighlight: 'rgba(255,134,82,0.16)',
  bgPicked: 'rgba(255,134,82,0.28)',
  bgWrong: 'rgba(250,105,105,0.16)',
  bgRight: 'rgba(21,177,116,0.16)',

  cardStroke: 'rgba(255,255,255,0.10)',
  mask: 'rgba(0,0,0,0.60)',
  shadow: 'rgba(0,0,0,0.4)',
  tabBarBg: '#111114',
  bottomGradientStop: 'rgba(11,11,13,1)',
  bottomGradientStart: 'rgba(11,11,13,0)',
};

export type ThemeTokens = typeof darkTokens;

export const lightTokens: ThemeTokens = {
  // Brand
  orange: '#FF8652',
  orange5: '#E65E2E',
  orange4: '#F26F3D',
  orange3: '#FFB08A',
  orange2: '#FFD9C7',
  orange1: '#FFF1EA',
  orange6: '#FFD15C',
  orange7: '#FF9CD5',
  dark: '#1C1E22',
  primary: '#21242C',

  // Text
  textPrimary: '#191919',
  textSecondary: '#2E2E2E',
  textTertiary: '#9A9A97',
  textFourth: '#E5E5E3',
  textWrong: '#FA6969',
  textLink: '#006AFF',
  textRight: '#15B174',
  textProblem: '#F8C24D',

  // Background
  bgHover: '#F7F7F7',
  bgPrimary: '#FAFAF9',
  bgSecondary: '#F1F1EF',
  bgTertiary: '#E3E3E0',
  bgFourth: '#A7A7A3',
  bgFifth: '#5E5E5B',
  bgCard: '#FFFFFF',
  bgHighlight: 'rgba(255,134,82,0.10)',
  bgPicked: 'rgba(255,134,82,0.20)',
  bgWrong: 'rgba(250,105,105,0.10)',
  bgRight: 'rgba(21,177,116,0.10)',

  cardStroke: 'rgba(0,0,0,0.10)',
  mask: 'rgba(0,0,0,0.50)',
  shadow: 'rgba(0,0,0,0.08)',
  tabBarBg: '#FFFFFF',
  bottomGradientStop: 'rgba(250,250,249,1)',
  bottomGradientStart: 'rgba(250,250,249,0)',
};
