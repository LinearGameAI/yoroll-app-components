import { memo, useMemo } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { motionTokens } from '../motion';

/** Fade in an opaque theme background above the scrolling content. */
export const NavigationBarMaterial = memo(function NavigationBarMaterial({ testID, scrollY }: {
  testID: string; scrollY: Animated.Value;
}) {
  const { tokens } = useTheme();
  const opacity = useMemo(() => scrollY.interpolate({
    inputRange: [0, motionTokens.navigationBackground.scrollDistance], outputRange: [0, 1], extrapolate: 'clamp',
  }), [scrollY]);
  return (
    <Animated.View testID={testID} pointerEvents="none" accessible={false} accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[StyleSheet.absoluteFillObject, { backgroundColor: tokens.bgPrimary, opacity }]} />
  );
});
