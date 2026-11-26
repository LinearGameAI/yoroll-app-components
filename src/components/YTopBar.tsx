import React from 'react';
import { View, Text, Pressable, StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconBackward } from '@yoroll/rn-icon';
import { typography } from '../typography';
import { useTheme } from '../theme';

export interface YTopBarProps {
  title?: string;
  titleNumberOfLines?: number;
  titleStyle?: StyleProp<TextStyle>;
  /** 标题位置的自定义内容，优先于 title。 */
  titleSlot?: React.ReactNode;
  contentColor?: string;
  onBack?: () => void;
  backLabel?: string;
  rightSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function YTopBar({ title, titleNumberOfLines = 1, titleStyle, titleSlot, contentColor, onBack, backLabel = 'Back', rightSlot, leftSlot, style }: YTopBarProps) {
  const { tokens, fontWeights, layout } = useTheme();
  const insets = useSafeAreaInsets();

  const barPadX = layout.gutter - 12; // icon outer pad; 40×40 tap area aligns to gutter

  return (
    <View
      style={[
        styles.root,
        {
          height: layout.topBarH + insets.top,
          paddingTop: insets.top,
          paddingHorizontal: barPadX,
          backgroundColor: tokens.bgPrimary,
        },
        style,
      ]}
    >
      {leftSlot != null ? (
        leftSlot
      ) : onBack ? (
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [styles.tapBtn, { opacity: pressed ? 0.6 : 1 }]}
          accessibilityLabel={backLabel}
          accessibilityRole="button"
        >
          <IconBackward size={24} color={contentColor ?? tokens.textPrimary} />
        </Pressable>
      ) : (
        <View pointerEvents="none" style={{ width: 40 }} />
      )}

      {titleSlot != null ? (
        <View style={styles.titleSlot}>{titleSlot}</View>
      ) : title ? (
        <Text
          numberOfLines={titleNumberOfLines}
          style={[
            styles.title,
            {
              fontFamily: fontWeights.dispMedium,
              color: contentColor ?? tokens.textPrimary,
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
      ) : (
        <View pointerEvents="none" style={{ flex: 1 }} />
      )}

      {rightSlot != null ? rightSlot : <View pointerEvents="none" style={{ width: 40 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  tapBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...typography.navigationTitle,
  },
  titleSlot: { flex: 1, minWidth: 0 },
});
