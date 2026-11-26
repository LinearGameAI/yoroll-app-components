import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';

type Shade = { color: string; opacity: number };
export interface MembershipSurfaceAppearance {
  cardGradient: readonly [Shade, Shade, Shade, Shade];
  cardLight: Shade;
  cardBorder?: Shade;
}

export function MembershipSurface({ appearance, cornerRadius, baseColor }: {
  appearance: MembershipSurfaceAppearance;
  cornerRadius: number;
  baseColor?: string;
}) {
  const id = useId().replace(/[^A-Za-z0-9-]/g, '');
  const fillId = 'membership-fill-' + id;
  const lightId = 'membership-light-' + id;
  const edgeId = 'membership-edge-' + id;
  const { cardGradient, cardLight, cardBorder } = appearance;
  return (
    <View pointerEvents="none" accessible={false} style={[styles.frame, { borderRadius: cornerRadius, backgroundColor: baseColor }]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} focusable={false}>
        <Defs>
          <LinearGradient id={fillId} x1="0%" y1="0%" x2="0%" y2="100%">
            {cardGradient.map(({ color, opacity }, index) => <Stop key={index} offset={[0, 0.34, 0.68, 0.96][index]}
              stopColor={color} stopOpacity={opacity} />)}
          </LinearGradient>
          <RadialGradient id={lightId} cx="0%" cy="0%" rx="105%" ry="75%">
            {[1, 0.75, 0.4, 0.12, 0].map((alpha, index) => <Stop key={index} offset={[0, 0.2, 0.45, 0.7, 1][index]}
              stopColor={cardLight.color} stopOpacity={alpha * cardLight.opacity} />)}
          </RadialGradient>
          {cardBorder && <LinearGradient id={edgeId} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset={0} stopColor={cardBorder.color} stopOpacity={cardBorder.opacity} />
            <Stop offset={0.38} stopColor="#FFFFFF" stopOpacity={0.09} />
            <Stop offset={0.64} stopColor="#FFFFFF" stopOpacity={0.02} />
            <Stop offset={0.88} stopColor="#FFFFFF" stopOpacity={0} />
          </LinearGradient>}
        </Defs>
        <Rect width="100%" height="100%" fill={'url(#' + fillId + ')'} />
        <Rect width="100%" height="100%" fill={'url(#' + lightId + ')'} />
        {cardBorder && <Rect width="100%" height="100%" rx={cornerRadius} fill="none" stroke={'url(#' + edgeId + ')'} strokeWidth={2} />}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({ frame: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' } });
