import { buttonMetrics, dialogMetrics, inputMetrics } from './foundations';

/** Typography roles verified against the corresponding App styles. */
export const typography = {
  navigationTitle: { fontSize: 17, fontWeight: '600', letterSpacing: 0.1 },
  inputText: { fontSize: inputMetrics.fontSize },
  inputHelper: { fontSize: inputMetrics.helperFontSize },
  profileLabel: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
  profileDetail: { fontSize: 13, lineHeight: 20 },
  creatorTitle: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
  creatorHeading: { fontSize: 14, lineHeight: 21, fontWeight: '600' },
  creatorBody: { fontSize: 14, lineHeight: 21, fontWeight: '400' },
  noticeTitle: { fontSize: dialogMetrics.notice.titleSize, lineHeight: dialogMetrics.notice.titleLineHeight, fontWeight: '700' },
  noticeBody: { fontSize: dialogMetrics.notice.bodySize, lineHeight: dialogMetrics.notice.bodyLineHeight },
  noticeAction: { fontSize: 15, lineHeight: 21, fontWeight: '600' },
  membershipPrice: { fontSize: 26, lineHeight: 32, fontWeight: '600' },
  treatBalance: { fontSize: 36, lineHeight: 44, letterSpacing: -0.8 },
  registrationReward: { fontSize: 28, lineHeight: 36 },
  chatGiftDiscount: { fontSize: 38, lineHeight: 40 },
  chatGiftDiscountCompact: { fontSize: 34, lineHeight: 36 },
} as const;

const buttonWeights = {
  primary: '500', secondary: '500', outline: '500', ghost: '500',
  danger: '500', brand: '700', orange: '600',
} as const;

export function buttonLabelTypography(
  size: keyof typeof buttonMetrics.sizes = 'md',
  variant: keyof typeof buttonWeights = 'primary',
) {
  const { fontSize } = buttonMetrics.sizes[size];
  return { fontSize, lineHeight: Math.round(fontSize * 1.4), fontWeight: buttonWeights[variant] };
}

export function tabLabelTypography(variant: 'underline' | 'segment' | 'text', active: boolean) {
  const fontWeight = active ? '600' as const : '500' as const;
  return variant === 'text' ? { fontSize: 16, lineHeight: 22, fontWeight } : { fontSize: 13, fontWeight };
}

export function avatarInitialTypography(diameter = 40) {
  return { fontSize: diameter * 0.42, fontWeight: '600' as const };
}

export function playPillLabelTypography(size: 'sm' | 'md' | 'lg' = 'md') {
  return { fontSize: { sm: 12, md: 13, lg: 17 }[size], fontWeight: '700' as const };
}

export const chatFontSize = { default: 15, min: 13, max: 22, step: 1 } as const;

export function chatMessageTypography(size: number = chatFontSize.default) {
  const { default: base, min, max, step } = chatFontSize;
  const selected = Number.isFinite(size) ? Math.min(max, Math.max(min, min + Math.round((size - min) / step) * step)) : base;
  const scale = selected / base;
  const text = (fontSize: number, lineHeight: number) => ({
    fontSize: Math.round(fontSize * scale * 10) / 10,
    lineHeight: Math.round(lineHeight * scale * 10) / 10,
  });
  return {
    user: text(15, 21), dialog: text(15, 23), narration: text(14.5, 23), thought: text(14, 22), description: text(14, 22),
    heading1: text(24, 30), heading2: text(21, 27), heading3: text(18, 25),
    heading4: text(16, 23), heading5: text(13, 23), heading6: text(11, 23),
  };
}
