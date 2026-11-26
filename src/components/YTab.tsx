import React from 'react';
import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { tabLabelTypography } from '../typography';
import { useTheme } from '../theme';
import { homePillStyles } from '../appStyles';
import { tabMetrics } from '../foundations';

export interface YTabItem {
  key: string;
  label: string;
  accessibilityHint?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export type YTabVariant = 'underline' | 'segment' | 'text' | 'pill';

const CONTENT_TAB_GAP = tabMetrics.contentGap;
const CONTENT_TAB_HIT_SLOP = { left: CONTENT_TAB_GAP / 2, right: CONTENT_TAB_GAP / 2 };

export interface YTabProps {
  items: readonly YTabItem[];
  active: string;
  onChange: (key: string) => void;
  variant?: YTabVariant;
  textLayout?: 'equal' | 'content';
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function YTab({ items, active, onChange, variant = 'underline', textLayout = 'equal', disabled = false, testID, style }: YTabProps) {
  const { tokens, fontWeights, fonts, mode } = useTheme();
  const isSeg = variant === 'segment';
  const isText = variant === 'text';
  const isPill = variant === 'pill';
  const isContentWidth = isText && textLayout === 'content';

  return (
    <View
      testID={testID}
      accessibilityRole="tablist"
      style={[
        styles.row,
        {
          gap: isContentWidth ? CONTENT_TAB_GAP : isSeg || isText ? 0 : isPill ? 8 : 16,
          backgroundColor: isSeg ? `${tokens.bgSecondary}CC` : 'transparent',
          padding: isSeg ? tabMetrics.segmentPadding : 0,
          borderRadius: isSeg ? tabMetrics.segmentRadius : 0,
          borderBottomWidth: isSeg || isText || isPill ? 0 : 1,
          borderBottomColor: isSeg ? 'transparent' : tokens.cardStroke,
        },
        style,
      ]}
    >
      {items.map((t) => {
        const isActive = t.key === active;
        const blocked = disabled || t.disabled;
        return (
          <Pressable
            key={t.key}
            disabled={blocked}
            hitSlop={isContentWidth ? CONTENT_TAB_HIT_SLOP : undefined}
            accessibilityRole="tab"
            accessibilityLabel={t.label}
            accessibilityHint={t.accessibilityHint}
            accessibilityState={{ selected: isActive, disabled: blocked }}
            aria-selected={isActive}
            onPress={() => onChange(t.key)}
            style={({ pressed }) => [
              isSeg
                ? {
                    flex: 1,
                    minWidth: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isActive ? mode === 'dark' ? tokens.bgTertiary : tokens.bgPrimary : 'transparent',
                    padding: 8,
                    borderRadius: 8,
                  }
                : isPill ? [homePillStyles.tabPill, isActive ? homePillStyles.tabPillActive : homePillStyles.tabPillIdle] : isText ? [styles.textTab, isContentWidth ? styles.contentTextTab : styles.equalTextTab] : {
                    paddingVertical: 10,
                    paddingHorizontal: 2,
                    borderBottomWidth: 2,
                    borderBottomColor: isActive ? tokens.textPrimary : 'transparent',
                  },
              isSeg && isActive && styles.segmentActive,
              { opacity: blocked ? 0.45 : pressed ? 0.7 : 1 },
            ]}
          >
            {t.icon}
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={isText}
              minimumFontScale={isText ? 0.8 : undefined}
              style={{
                fontFamily: isSeg || isText ? fonts.sans : isActive ? fontWeights.sansBold : fontWeights.sansMedium,
                ...tabLabelTypography(variant, isActive),
                color: isActive ? tokens.textPrimary : tokens.textTertiary,
              }}
            >
              {t.label}
            </Text>
            {isText && isActive && <View pointerEvents="none" accessible={false}
              style={[styles.shortLine, { backgroundColor: tokens.textPrimary }]} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  textTab: { minWidth: 0, minHeight: tabMetrics.textMinHeight, paddingHorizontal: 8, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  equalTextTab: { flex: 1 },
  contentTextTab: { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', paddingHorizontal: 0 },
  shortLine: { position: 'absolute', bottom: 0, width: tabMetrics.indicatorWidth, height: tabMetrics.indicatorHeight, borderRadius: 1 },
  segmentActive: { shadowColor: '#000', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
