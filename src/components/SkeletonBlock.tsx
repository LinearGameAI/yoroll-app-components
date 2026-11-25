import React, { useEffect } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

/**
 * 骨架占位块 —— 底色 bgSecondary + 全局同步的微光脉冲(opacity 0.5↔1)。
 * 所有骨架块共用一个模块级 Animated.Value,只跑一个 loop(引用计数启停),
 * 保证跨组件/跨页同步呼吸、且不重复起循环。任何加载页拼几个 SkeletonBlock 即可。
 */
const pulse = new Animated.Value(0.5);
let refCount = 0;
let loop: Animated.CompositeAnimation | null = null;

function acquirePulse() {
  refCount += 1;
  if (refCount === 1) {
    pulse.setValue(0.5);
    loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 750, useNativeDriver: true }),
      ]),
    );
    loop.start();
  }
}

function releasePulse() {
  refCount -= 1;
  if (refCount <= 0) {
    refCount = 0;
    loop?.stop();
    loop = null;
  }
}

export interface SkeletonBlockProps {
  style?: StyleProp<ViewStyle>;
  /** 覆盖底色(默认 tokens.bgSecondary)。强制深色页可传固定深色,避免亮色主题下发白。 */
  color?: string;
}

export function SkeletonBlock({ style, color }: SkeletonBlockProps) {
  const { tokens } = useTheme();
  useEffect(() => {
    acquirePulse();
    return releasePulse;
  }, []);
  return (
    <Animated.View
      style={[{ backgroundColor: color ?? tokens.bgSecondary, opacity: pulse }, style]}
    />
  );
}
