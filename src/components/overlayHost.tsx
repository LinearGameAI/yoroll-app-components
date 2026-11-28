import { createContext, useContext, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, Modal, Platform, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

const durations = { enterMs: 180, exitMs: 150 };
const ease = Easing.inOut(Easing.ease);

export function useOverlayMotion(visible: boolean, timing = durations) {
  const progress = useRef(new Animated.Value(0)).current;
  const [present, setPresent] = useState(visible);
  const [reduceMotion, setReduceMotion] = useState(false);
  const observeMotion = visible || present;
  useEffect(() => {
    if (!observeMotion) return;
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => { if (active) setReduceMotion(value); }).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { active = false; subscription.remove(); };
  }, [observeMotion]);
  useEffect(() => {
    if (visible) setPresent(true);
    if (!visible && !present) return;
    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0, duration: reduceMotion ? 0 : visible ? timing.enterMs : timing.exitMs,
      easing: ease, useNativeDriver: Platform.OS !== 'web',
    });
    animation.start(({ finished }) => {
      if (finished && !visible) setPresent(false);
    });
    return () => animation.stop();
  }, [present, progress, reduceMotion, timing.enterMs, timing.exitMs, visible]);
  return { present, progress };
}

type OverlayPlacement = 'top' | 'center' | 'bottom';

export interface OverlayHostProps {
  present: boolean;
  visible: boolean;
  progress: Animated.Value;
  label?: string;
  placement?: OverlayPlacement;
  onClose?: () => void;
  onBackdropPress?: () => void;
  backdrop?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export interface OverlayLayerProps {
  children: ReactNode;
  label?: string;
  placement: OverlayPlacement;
  onRequestClose: () => void;
}

export const OverlayViewportContext = createContext<{
  height: number;
  Layer: ComponentType<OverlayLayerProps>;
} | null>(null);

export function OverlayHost({ present, visible, progress, label, placement = 'center', onClose, onBackdropPress, backdrop, style, children }: OverlayHostProps) {
  const viewport = useContext(OverlayViewportContext);
  const requestClose = () => { if (visible) onClose?.(); };
  if (!present) return null;
  const surface = (
    <View accessibilityViewIsModal style={[styles.root, style]} pointerEvents={visible ? 'auto' : 'none'}>
      {backdrop && <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: backdrop, opacity: progress }]} />}
      {onBackdropPress && <Pressable accessible={false} focusable={false}
        importantForAccessibility="no-hide-descendants" style={StyleSheet.absoluteFill} onPress={onBackdropPress} />}
      {children}
    </View>
  );
  if (viewport) {
    const { Layer } = viewport;
    return <Layer label={label} placement={placement} onRequestClose={requestClose}>{surface}</Layer>;
  }
  return (
    <Modal transparent visible animationType="none" onRequestClose={requestClose} statusBarTranslucent navigationBarTranslucent>
      {surface}
    </Modal>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
