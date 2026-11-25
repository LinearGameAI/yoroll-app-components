import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { motionTokens } from '../motion';

/** Shared with the game home Banner so both carousels use the same active transition. */
export const CarouselIndicatorDot = React.memo(function CarouselIndicatorDot({ active }: { active: boolean }) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: motionTokens.carouselDot.durationMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
      isInteraction: false,
    });
    animation.start();
    return () => animation.stop();
  }, [active, progress]);

  return <Animated.View style={[styles.dot, {
    width: progress.interpolate({ inputRange: [0, 1], outputRange: [motionTokens.carouselDot.width, motionTokens.carouselDot.activeWidth] }),
    backgroundColor: progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.8)'],
    }),
  }]} />;
});

const styles = StyleSheet.create({
  dot: { height: 3, borderRadius: 999 },
});
