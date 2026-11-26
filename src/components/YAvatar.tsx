import React from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Image, type ImageProps } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { avatarInitialTypography } from '../typography';
import { useTheme } from '../theme';

export interface YAvatarProps {
  size?: number;
  src?: string;
  name?: string;
  color?: string;
  gradientColors?: [string, string] | [string, string, ...string[]];
  ring?: string;
  contentPosition?: ImageProps['contentPosition'];
  style?: StyleProp<ViewStyle>;
}

export function YAvatar({ size = 40, src, name = 'A', color, gradientColors, ring, contentPosition, style }: YAvatarProps) {
  const { tokens, fontWeights } = useTheme();
  const bg = color ?? tokens.dark;
  const initial = name ? name[0]?.toUpperCase() : '';
  const imageUri = src?.trim();
  const avatarGradient = gradientColors ?? (!imageUri && !color ? [tokens.orange, tokens.orange7] as [string, string] : undefined);

  const ringStyle: ViewStyle | undefined = ring
    ? {
        shadowColor: ring,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 0,
        borderWidth: 2,
        borderColor: ring,
      }
    : undefined;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: avatarGradient ? 'transparent' : bg,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        },
        ringStyle,
        style,
      ]}
    >
      {avatarGradient ? (
        <LinearGradient
          colors={avatarGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          contentPosition={contentPosition}
          cachePolicy="memory-disk"
          transition={0}
        />
      ) : (
        <Text
          style={{
            color: '#fff',
            fontFamily: fontWeights.dispMedium,
            ...avatarInitialTypography(size),
          }}
        >
          {initial}
        </Text>
      )}
    </View>
  );
}
