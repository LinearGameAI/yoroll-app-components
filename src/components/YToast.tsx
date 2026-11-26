import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { componentText } from '../typography';

export interface YToastProps {
  message?: string;
  duration?: number;
  onHidden?: () => void;
}

export function YToast({ message, duration = 2400, onHidden }: YToastProps) {
  const onHiddenRef = useRef(onHidden);
  onHiddenRef.current = onHidden;
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => onHiddenRef.current?.(), duration);
    return () => clearTimeout(timeout);
  }, [message, duration]);
  if (!message) return null;
  return (
    <View accessibilityLiveRegion="polite" pointerEvents="none" style={styles.toast}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: { alignSelf: 'center', backgroundColor: 'rgba(44,44,46,0.96)', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10 },
  text: { ...componentText.feedback, color: '#FFFFFF', fontWeight: '500', textAlign: 'center' },
});
