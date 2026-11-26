import { IconClose, IconSearch } from '@yoroll/rn-icon';
import { useTheme } from '../theme';
import { YIconButton } from './YIconButton';
import { YTextInput } from './YTextInput';

export interface YSearchFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  label: string;
  clearLabel?: string;
  autoFocus?: boolean;
}

export function YSearchField({ value, onChangeText, onSubmit, placeholder, label, clearLabel = 'Clear search', autoFocus }: YSearchFieldProps) {
  const { tokens } = useTheme();
  return (
    <YTextInput accessibilityLabel={label} autoFocus={autoFocus} value={value} onChangeText={onChangeText}
      placeholder={placeholder ?? label} autoCorrect={false} returnKeyType="search"
      onSubmitEditing={({ nativeEvent }) => onSubmit?.(nativeEvent.text)}
      leftIcon={<IconSearch size={20} color={tokens.textTertiary} />}
      rightSlot={value.length > 0 ? <YIconButton icon={IconClose} iconSize={16} label={clearLabel}
        onPress={() => onChangeText('')} /> : undefined} />
  );
}
