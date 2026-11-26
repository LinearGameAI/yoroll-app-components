import type { ReactNode } from 'react';
import { IconModelMemberFilled } from '@yoroll/rn-icon';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { membershipAppearance, membershipBackgroundStyles, membershipOfferStyles as s, treatBackgroundStyles } from '../appStyles';
import { useTheme } from '../theme';
import { MembershipSurface, type MembershipSurfaceAppearance } from './membershipSurface';
import { SkeletonBlock } from './SkeletonBlock';
import { TreatText } from './TreatText';

type Tier = keyof typeof membershipAppearance;
export interface YPlanBenefit { label: string; value: string; artwork?: ImageSource | string }
export interface YPlanCardProps {
  title: string;
  price?: string;
  referencePrice?: string;
  period?: string;
  badge?: ReactNode;
  features?: readonly string[];
  benefits?: readonly YPlanBenefit[];
  selected?: boolean;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'benefits' | 'cycle';
  tier?: Tier;
  current?: string;
  offer?: { label: string; countdown?: string };
  onSelect?: () => void;
  style?: StyleProp<ViewStyle>;
}

function benefitSurface(tier: Tier, selected: boolean | undefined): MembershipSurfaceAppearance {
  const appearance = membershipAppearance[tier];
  const strength = selected ? 1 : 0.36;
  const [top, center, end, bottom] = appearance.cardGradient;
  return {
    cardGradient: [
      { ...top, opacity: top.opacity * strength },
      { ...center, opacity: selected ? 0.76 : 0.48 * strength },
      { ...end, opacity: selected ? 0.16 : 0.06 * strength },
      bottom,
    ],
    cardLight: { ...appearance.cardLight, opacity: selected ? 0.22 : appearance.cardLight.opacity * strength },
    cardBorder: selected ? { ...appearance.cardBorder, opacity: 0.86 } : undefined,
  };
}

const divider = ['rgba(255,255,255,0)', 'rgba(255,255,255,0.26)', 'rgba(255,255,255,0)'] as const;
const cycleIdle = ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)'] as const;

export function YPlanCard({
  title, price, referencePrice, period, badge, features = [], benefits, selected, loading, disabled,
  variant = 'benefits', tier = 'basic', current, offer, onSelect, style,
}: YPlanCardProps) {
  const { fonts, tokens } = useTheme();
  const appearance = membershipAppearance[tier];
  const control = {
    accessibilityRole: onSelect ? 'radio' as const : undefined,
    accessibilityState: { checked: selected, disabled, busy: loading },
    'aria-checked': onSelect ? Boolean(selected) : undefined,
    accessibilityLabel: [title, current, price, period].filter(Boolean).join(', '),
    onPress: onSelect,
    disabled,
  };
  if (variant === 'cycle') return (
    <Pressable {...control} style={({ pressed }) => [
      s.cycleChoice, selected && { backgroundColor: appearance.accent }, (disabled || pressed) && { opacity: disabled ? 0.5 : 0.92 }, style,
    ]}>
      <View style={s.cycleFace}>
        <LinearGradient colors={selected ? appearance.backgroundTint : cycleIdle}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      </View>
      {(offer || badge) && <View style={s.cardBadgeAnchor}>{offer ?
        <LinearGradient colors={appearance.badgeGradient} start={{ x: 0, y: 0.42 }} end={{ x: 1, y: 0.58 }} style={styles.offer}>
          <Text numberOfLines={1} style={[styles.offerLabel, { color: tokens.dark }]}>{offer.label}</Text>
          {offer.countdown && <Text numberOfLines={1} style={[styles.timer, { backgroundColor: appearance.cardGradient[1].color }]}>{offer.countdown}</Text>}
        </LinearGradient> : badge}</View>}
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} style={[s.cycleTitle, { fontFamily: fonts.sans }]}>{title}</Text>
      {loading && !price ? <SkeletonBlock style={s.priceSkeleton} /> : <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}
        style={s.choicePrice}>{[price ?? '—', period].filter(Boolean).join(' ')}</Text>}
      {referencePrice && <Text numberOfLines={1} style={s.referencePrice}>{referencePrice}</Text>}
    </Pressable>
  );

  const rows: readonly YPlanBenefit[] = benefits ?? [
    ...(price ? [{ label: period ?? 'Treats', value: price }] : []),
    ...features.map((label) => ({ label, value: '✓' })),
  ];
  return (
    <Pressable {...control} style={({ pressed }) => [
      styles.column, !selected && { opacity: 0.66 }, pressed && { opacity: 0.92 }, style,
    ]}>
      <View style={s.tierChoice}>
        <View style={s.cardTitleRow}>
          <IconModelMemberFilled size={21} color={appearance.badgeGradient[0]} />
          <TreatText gradientColors={appearance.badgeGradient} style={[styles.wordmark, { fontFamily: fonts.bebas }]}>{title}</TreatText>
        </View>
        {current && <Text style={[s.statusBadge, { color: appearance.badgeGradient[1] }]}>{current}</Text>}
      </View>
      <View style={s.benefitCard}>
        <MembershipSurface appearance={benefitSurface(tier, selected)} baseColor="transparent" cornerRadius={18} />
        {badge && <View style={[s.cardBadgeAnchor, styles.benefitBadge]}>{badge}</View>}
        <View style={s.benefitList}>
          {rows.map(({ label, value, artwork }, index) => <View key={label + index}>
            {index > 0 && <LinearGradient colors={divider} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={s.benefitDivider} />}
            <View style={s.benefitRow}>
              <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75} style={s.benefitLabel}>{label}</Text>
              <View style={s.benefitValueRow}>
                {artwork && <Image source={artwork} contentFit="contain" style={s.benefitArtwork} />}
                <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72} style={[s.benefitValue, { flexShrink: 1 }]}>{value}</Text>
              </View>
            </View>
          </View>)}
        </View>
      </View>
    </Pressable>
  );
}

export function YPurchaseBackdrop({ tier = 'basic', cover, variant = 'membership' }: {
  tier?: Tier; cover?: ImageSource | string; variant?: 'membership' | 'treats';
}) {
  const { tokens } = useTheme();
  if (variant === 'treats') return <View pointerEvents="none" style={[treatBackgroundStyles.root, { backgroundColor: tokens.bgPrimary }]}>
    <LinearGradient colors={['rgba(255,176,138,0.16)', 'rgba(255,156,213,0.11)', 'rgba(190,154,255,0.14)']}
      locations={[0, 0.46, 1]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={treatBackgroundStyles.glow} />
    <LinearGradient colors={[tokens.bottomGradientStart, tokens.bgPrimary]} style={treatBackgroundStyles.glow} />
  </View>;
  return (
    <View pointerEvents="none" style={membershipBackgroundStyles.root}>
      <View style={membershipBackgroundStyles.scene}>
        {cover && <Image source={cover} contentFit="cover" style={membershipBackgroundStyles.image} transition={250} />}
        <LinearGradient colors={membershipAppearance[tier].backgroundTint} locations={[0, 0.5, 1]}
          start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      </View>
      <LinearGradient colors={['rgba(11,10,13,0.12)', 'rgba(11,10,13,0.24)', 'rgba(11,10,13,0.58)', '#0B0A0D']}
        locations={[0, 0.3, 0.72, 1]} style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  column: { minWidth: 0 },
  wordmark: { fontSize: 28, lineHeight: 30, letterSpacing: 0.3, transform: [{ skewX: '-9deg' }] },
  benefitBadge: { alignItems: 'flex-end' },
  offer: { alignSelf: 'flex-start', flexDirection: 'row', gap: 4, alignItems: 'center', paddingLeft: 8, paddingRight: 4,
    paddingVertical: 2, borderRadius: 10, minHeight: 21, maxWidth: '100%' },
  offerLabel: { fontSize: 11, lineHeight: 15, fontWeight: '700', flexShrink: 1, includeFontPadding: false },
  timer: { fontSize: 10, lineHeight: 15, fontWeight: '700', color: '#FFFFFF', borderRadius: 999, paddingHorizontal: 5,
    fontVariant: ['tabular-nums'], overflow: 'hidden' },
});
