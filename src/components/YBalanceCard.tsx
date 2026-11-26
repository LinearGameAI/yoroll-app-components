import type { ReactNode } from 'react';
import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';
import { balanceCandies, treatBalanceStyles as s, treatShadingStyles, treatStoreAppearance as colors } from '../appStyles';
import { useTheme } from '../theme';

export interface YBalanceCardProps {
  title: string;
  amount?: string;
  detail?: string;
  artwork?: ReactNode;
  candy?: ImageSource | string;
  valueStyle?: StyleProp<TextStyle>;
}

export function YBalanceCard({ title, amount, detail, artwork, candy, valueStyle }: YBalanceCardProps) {
  const { fonts } = useTheme();
  return (
    <View style={s.container}>
      <View style={[s.card, { backgroundColor: colors.balanceBackground }]}>
        <LinearGradient colors={colors.balanceGradient} locations={[0, 0.52, 1]}
          start={{ x: 0, y: 0.15 }} end={{ x: 1, y: 0.9 }} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={['rgba(255,245,235,0.46)', 'rgba(255,245,235,0.08)', 'rgba(255,245,235,0.10)']}
          locations={[0, 0.48, 1]} style={StyleSheet.absoluteFill} />
        {candy && balanceCandies.map(({ name, size, position, angle }) => <View key={name} pointerEvents="none" style={[s.candy, position, { width: size, height: size }]}>
          <Image source={candy} contentFit="contain" style={[s.artworkImage, { transform: [{ rotate: angle }] }]} />
        </View>)}
        {artwork && <View pointerEvents="none" style={styles.art}>{artwork}</View>}
        <LinearGradient pointerEvents="none" colors={['rgba(255,249,237,0.38)', 'rgba(255,249,237,0.13)', 'rgba(255,249,237,0)']}
          locations={[0, 0.46, 1]} style={treatShadingStyles.upperLight} />
        <LinearGradient pointerEvents="none" colors={['rgba(196,83,140,0)', 'rgba(196,83,140,0.08)', 'rgba(196,83,140,0.28)']}
          locations={[0, 0.55, 1]} style={treatShadingStyles.bottomShadow} />
        <LinearGradient pointerEvents="none" colors={['rgba(196,83,140,0)', 'rgba(196,83,140,0.14)']}
          start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={treatShadingStyles.rightShadow} />
        <Text style={[s.label, Boolean(candy || artwork) && s.textSpace, { color: colors.mutedText, fontFamily: fonts.sans }]}>{title}</Text>
        <View style={[s.valueRow, Boolean(candy || artwork) && s.textSpace]}>
          <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.65} style={[
            s.value, { color: colors.balanceText, fontFamily: amount === undefined ? fonts.sans : fonts.geologicaSemibold,
              fontWeight: amount === undefined ? '800' : '600' }, valueStyle,
          ]}>{amount ?? '—'}</Text>
        </View>
        {detail && <Text style={[s.note, !candy && !artwork && { marginRight: 0 }, { color: colors.balanceNoteText }]}>{detail}</Text>}
      </View>
      {candy && <View pointerEvents="none" style={s.overflowArtwork}>
        <Image source={candy} contentFit="contain" style={s.artworkImage} />
      </View>}
    </View>
  );
}
const styles = StyleSheet.create({
  art: { position: 'absolute', top: 0, right: 0, bottom: 0, width: 106 },
});
