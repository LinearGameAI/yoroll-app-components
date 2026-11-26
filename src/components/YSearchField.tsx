import { IconClose, IconSearch } from '@yoroll/rn-icon';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { nativeSearchStyles } from '../appStyles';
import { useTheme } from '../theme';

export interface YSearchFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  label: string;
  clearLabel?: string;
  autoFocus?: boolean;
  variant?: 'input' | 'entry';
}

export function YSearchField({ value, onChangeText, onSubmit, placeholder, label, clearLabel = 'Clear search', autoFocus,
  variant = 'input',
}: YSearchFieldProps) {
  const { tokens, fonts } = useTheme();
  return (
    <View style={[nativeSearchStyles.searchInputWrap, styles.width, { backgroundColor: tokens.bgSecondary, borderColor: tokens.cardStroke }]}>
      {variant === 'entry' && <IconSearch size={16} color={tokens.textTertiary} />}
      <TextInput accessibilityLabel={label} autoFocus={autoFocus} value={value} onChangeText={onChangeText} autoCorrect={false}
        returnKeyType="search" placeholder={placeholder ?? label} placeholderTextColor={tokens.textTertiary}
        onSubmitEditing={({ nativeEvent }) => onSubmit?.(nativeEvent.text)}
        style={[nativeSearchStyles.searchInput, { color: tokens.textPrimary, fontFamily: fonts.sans }]} />
      {value.length > 0 && <Pressable accessibilityRole="button" accessibilityLabel={clearLabel} hitSlop={8}
        onPress={() => onChangeText('')} style={({ pressed }) => [styles.clear, pressed && { opacity: 0.6 }]}>
        <IconClose size={16} color={tokens.textTertiary} />
      </Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  width: { width: '100%', minWidth: 0, flexGrow: 0, flexShrink: 0, gap: 7 },
  clear: { width: 28, height: 40, marginRight: -6, alignItems: 'center', justifyContent: 'center' },
});
