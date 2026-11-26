import type { ReactNode } from 'react';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import {
  creditCreditsLayout, creditPackStyles as s, creditPriceStyles, creditTextStyles, rewardBannerAppearance, treatStoreAppearance,
} from '../appStyles';
import { useTheme } from '../theme';
import { MembershipSurface } from './membershipSurface';

export interface YCreditPackCardProps {
  amount: string;
  price?: string;
  bonus?: string;
  badge?: string;
  badgeTone?: keyof typeof treatStoreAppearance.cardBadgeGradients;
  artwork?: ReactNode;
  artworkSource?: ImageSource | string;
  loadingPrice?: boolean;
  disabled?: boolean;
  retryLabel?: string;
  onPurchase?: () => void;
  onRetry?: () => void;
}

export function YCreditPackCard({ amount, price, bonus, badge, badgeTone = 'firstChargeOffer', artwork, artworkSource,
  loadingPrice, disabled, retryLabel = 'Retry price', onPurchase, onRetry }: YCreditPackCardProps) {
  const { fonts } = useTheme();
  const action = price ? onPurchase : onRetry;
  const blocked = Boolean(disabled || loadingPrice || !action);
  const label = price ?? (onRetry ? retryLabel : '—');
  const colors = treatStoreAppearance;
  return (
    <Pressable accessibilityRole={action ? 'button' : undefined} accessibilityState={{ disabled: blocked, busy: loadingPrice }}
      disabled={blocked} onPress={action} style={({ pressed }) => [s.card, pressed && { opacity: 0.88 }]}>
      <MembershipSurface appearance={colors.cardSurface} cornerRadius={s.card.borderRadius} baseColor={colors.cardBackground} />
      {badge && <LinearGradient colors={colors.cardBadgeGradients[badgeTone]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.packBadge}>
        <Text numberOfLines={1} style={[s.packBadgeText, { color: colors.buttonText, fontFamily: fonts.sans }]}>{badge}</Text>
      </LinearGradient>}
      <View style={s.contentRow}>
        <View style={creditCreditsLayout.group}>
          <View style={creditCreditsLayout.amountRow}>
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}
              style={[creditTextStyles.creditsText, { fontFamily: fonts.geologicaSemibold, fontWeight: '600' }]}>{amount}</Text>
          </View>
          <View style={creditCreditsLayout.bonusRow}>
            {bonus && <Text numberOfLines={2} style={creditTextStyles.bonusCreditsText}>{bonus}</Text>}
          </View>
        </View>
        {artworkSource ? <Image source={artworkSource} contentFit="contain" style={s.creditArtwork} /> : artwork}
      </View>
      <View style={[creditPriceStyles.priceButton, disabled && { opacity: 0.45 }]}>
        <LinearGradient colors={colors.buttonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={creditPriceStyles.buttonSurface} />
        <LinearGradient {...rewardBannerAppearance.buttonHighlight} style={creditPriceStyles.buttonSurface} />
        {loadingPrice ? <ActivityIndicator size="small" color={colors.buttonText} style={creditPriceStyles.buttonContent} /> :
          <Text numberOfLines={1} style={[creditPriceStyles.priceText, { color: colors.buttonText, fontFamily: fonts.sans }]}>{label}</Text>}
      </View>
    </Pressable>
  );
}
