import type { ReactNode } from 'react';
import { IconCheckedFilled, IconSingleunchecked, IconTreatsFilled } from '@yoroll/rn-icon';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { modelPickerStyles as s } from '../appStyles';
import { TREAT_TEXT_GRADIENT } from '../foundations';
import { useTheme } from '../theme';
import { TreatText } from './TreatText';

export interface YModelCardProps {
  title: string;
  description?: string;
  price?: string;
  referencePrice?: string;
  countdown?: string;
  badge?: ReactNode;
  icon?: ReactNode;
  selected?: boolean;
  saving?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export function YModelCard({
  title, description, price, referencePrice, countdown, badge, icon, selected, saving, disabled, onSelect,
}: YModelCardProps) {
  const { tokens, fonts } = useTheme();
  const blocked = saving || disabled;
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected, disabled: blocked, busy: saving }} aria-checked={Boolean(selected)}
      accessibilityLabel={[title, description, price].filter(Boolean).join(', ')}
      disabled={blocked} onPress={onSelect} style={({ pressed }) => [s.modelOptionCard, {
        backgroundColor: tokens.bgTertiary, opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
      }]}>
      {selected && <LinearGradient pointerEvents="none" colors={[tokens.orange7, tokens.orange3, tokens.orange]}
        locations={[0, 0.5, 1]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={s.modelOptionSurface}>
        <View style={[s.modelOptionInset, { backgroundColor: tokens.bgTertiary }]}>
          <LinearGradient colors={[tokens.orange7 + '33', tokens.orange3 + '14', tokens.orange + '00']}
            locations={[0, 0.4, 0.8]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
        </View>
      </LinearGradient>}
      <View style={s.modelOptionCardHeader}>
        {icon}
        <View style={s.modelOptionHeading}>
          <Text style={[s.modelOptionName, { color: tokens.textPrimary, fontFamily: fonts.disp }]}>{title}</Text>
          {badge}
        </View>
        {saving ? <ActivityIndicator color={tokens.orange} /> : selected
          ? <IconCheckedFilled size={20} color={tokens.orange} /> : <IconSingleunchecked size={20} color={tokens.textTertiary} style={{ opacity: 0.5 }} />}
      </View>
      {description && <Text style={[s.modelOptionDescription, { color: tokens.textSecondary, fontFamily: fonts.sans }]}>{description}</Text>}
      {(price || countdown) && <View style={s.modelPriceRow}>
        <View style={s.modelPriceAmounts}>
          {price && <><IconTreatsFilled size={14} color={TREAT_TEXT_GRADIENT[0]} />
            <TreatText numberOfLines={1} style={[s.modelOptionPrice, { fontFamily: fonts.geologicaSemibold }]}>{price}</TreatText></>}
          {referencePrice && <Text numberOfLines={1} style={[s.modelAuxiliaryText, s.modelOriginalPrice, { color: tokens.textTertiary }]}>{referencePrice}</Text>}
        </View>
        {countdown && <Text style={[s.modelAuxiliaryText, s.modelOfferCountdown, { color: tokens.textTertiary }]}>{countdown}</Text>}
      </View>}
    </Pressable>
  );
}
