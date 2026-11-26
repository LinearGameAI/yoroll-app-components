import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { typography } from '../typography';

export interface YFieldProps {
  label: string;
  detail?: string;
  counter?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function YField({ label, detail, counter, error, required, children }: YFieldProps) {
  const { tokens } = useTheme();
  return (
    <View style={styles.field}>
      <View style={styles.heading}>
        <Text style={[styles.label, typography.profileLabel, { color: tokens.textPrimary }]}>
          {label}{required && <Text style={{ color: tokens.textWrong }}> *</Text>}
        </Text>
        {counter && <Text style={[typography.inputHelper, { color: tokens.textSecondary }]}>{counter}</Text>}
      </View>
      {children}
      {(detail || error) && <Text accessibilityLiveRegion={error ? 'polite' : 'none'}
        style={[typography.inputHelper, { color: error ? tokens.textWrong : tokens.textSecondary }]}>{error ?? detail}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 7 },
  heading: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' },
  label: { flexShrink: 1 },
});
