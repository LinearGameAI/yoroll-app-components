import { darkTokens } from './tokens';

export const layout = {
  gutter: 12,
  topBarH: 48,
  tapTarget: 44,
  shareActionSize: 60,
} as const;

export const sheetMetrics = {
  radius: 18,
  modelPickerRadius: 20,
  dragZoneH: 22,
  minBottomInset: 14,
  closeIcon: 20,
  closeInset: layout.gutter / 2,
  closeTarget: layout.tapTarget,
  backdrop: darkTokens.mask,
  modelPickerBackdrop: 'rgba(0,0,0,0.48)',
  background: darkTokens.bgSecondary,
} as const;

export function bottomSheetBottomPadding(safeAreaBottom: number) {
  return Math.max(safeAreaBottom, sheetMetrics.minBottomInset) + layout.gutter;
}

export const dialogMetrics = {
  centered: {
    maxWidth: 400,
    borderRadius: 20,
    padding: 20,
    gap: 16,
    backdrop: 'rgba(0,0,0,0.6)',
  },
  notice: {
    maxWidth: 360,
    borderRadius: 24,
    artworkRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 20,
    buttonMinHeight: 48,
    buttonRadius: 999,
    titleSize: 20,
    titleLineHeight: 28,
    bodySize: 14,
    bodyLineHeight: 24,
    background: '#19191C',
    surfaceColors: ['#2B2528', '#19191C', '#171719'],
    backdrop: 'rgba(0,0,0,0.68)',
  },
} as const;

export const inputMetrics = {
  borderRadius: 12,
  paddingHorizontal: 14,
  minHeight: 52,
  fontSize: 15,
  paddingVertical: 14,
  helperFontSize: 12,
} as const;

export const buttonMetrics = {
  borderRadius: 8,
  sizes: {
    sm: { paddingH: 14, paddingV: 10, fontSize: 13, minHeight: 40 },
    md: { paddingH: 16, paddingV: 12, fontSize: 14, minHeight: 44 },
    lg: { paddingH: 18, paddingV: 14, fontSize: 15, minHeight: 48 },
    xl: { paddingH: 22, paddingV: 16, fontSize: 16, minHeight: 56 },
    icon: { paddingH: 0, paddingV: 0, fontSize: 14, minHeight: 40, width: 40 },
  },
} as const;

export const tabMetrics = {
  textMinHeight: 44,
  contentGap: 24,
  segmentRadius: 10,
  segmentPadding: 3,
  indicatorWidth: 24,
  indicatorHeight: 2,
} as const;

export const systemFonts = {
  ios: { sans: 'System', medium: 'System', mono: 'System' },
  android: { sans: 'sans-serif', medium: 'sans-serif-medium', mono: 'monospace' },
  web: { sans: 'system-ui', medium: 'system-ui', mono: 'monospace' },
} as const;

export const customFontNames = {
  bebas: 'BebasNeue',
  geologicaSemibold: 'GeologicaSemiBold',
} as const;

export const TREAT_GRADIENT = [darkTokens.orange, darkTokens.orange7] as const;
export const TREAT_TEXT_GRADIENT = [TREAT_GRADIENT[1], TREAT_GRADIENT[0]] as const;

export const shadowPresets = {
  soft: {
    ios: { shadowColor: 'rgba(61,59,70,1)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.05, shadowRadius: 50 },
    android: { elevation: 6 },
    web: '0 0 50px rgba(61,59,70,0.05)',
  },
  card: {
    ios: { shadowColor: '#000000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.08, shadowRadius: 20 },
    android: { elevation: 4 },
    web: '0 0 20px rgba(0,0,0,0.08)',
  },
  btn: {
    ios: { shadowColor: 'rgba(154,154,151,1)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 10 },
    android: { elevation: 2 },
    web: '0 0 10px rgba(154,154,151,0.2)',
  },
} as const;

export const controlMetrics = {
  iconButton: { target: layout.tapTarget, icon: 20 },
  bottomNav: { defaultHeight: 56, androidHeight: 60, defaultTop: 8, androidInset: 6, icon: 24 },
  composer: { control: 44, maxInputHeight: 120, lineHeight: 20, verticalPadding: 12 },
  settingsRow: { minHeight: 52, groupRadius: 12 },
  inboxRow: { avatar: 52, rowGap: 12, avatarMargin: 14, unreadDot: 8 },
  creatorChip: { radius: 22, paddingHorizontal: 14, paddingVertical: 9 },
  upload: { width: 75, height: 95, radius: 12 },
} as const;

export const cardMetrics = {
  game: { radius: 16, heights: { sm: 140, md: 180, lg: 240 } },
  channel: { radius: 8, width: 128, height: 72 },
  cover: { radius: 8, discoverAspect: 3 / 5, characterAspect: 202 / 316, chatAspect: 9 / 16, profileAspect: 3 / 4 },
  persona: { detailMinHeight: 112, actionMinHeight: 52 },
  plan: { radius: 16, padding: 16 },
  pack: { radius: 12, minHeight: 144, padding: 12, badgeHeight: 20 },
  balance: { radius: 16, paddingH: 20, paddingV: 16, valueMinHeight: 48 },
  model: { radius: 16, paddingH: 21, paddingV: 15 },
  task: { radius: 18, buttonMinHeight: 36, dayMinHeight: 99 },
} as const;
