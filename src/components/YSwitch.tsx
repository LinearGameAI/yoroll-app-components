import { Switch } from 'react-native';
import { useTheme } from '../theme';

export interface YSwitchProps {
  value: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function YSwitch({ value, onChange, label, disabled }: YSwitchProps) {
  const { tokens } = useTheme();
  return (
    <Switch accessibilityLabel={label} value={value} disabled={disabled} onValueChange={onChange}
      trackColor={{ false: tokens.bgFourth, true: tokens.orange }} ios_backgroundColor={tokens.bgFourth}
      thumbColor="#FFFFFF" />
  );
}
