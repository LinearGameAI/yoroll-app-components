import { useContext, useMemo, useRef, type ReactNode } from 'react';
import { Animated, Easing, KeyboardAvoidingView, PanResponder, Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions, type StyleProp, type TextStyle } from 'react-native';
import { IconClose } from '@yoroll/rn-icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { modelSheetStyles } from '../appStyles';
import { bottomSheetBottomPadding, layout, sheetMetrics } from '../foundations';
import { motionTokens } from '../motion';
import { YorollThemeProvider } from '../theme';
import { darkTokens } from '../tokens';
import { typography } from '../typography';
import { OverlayHost, OverlayViewportContext, useOverlayMotion } from './overlayHost';
import { YIconButton } from './YIconButton';

export interface YSheetProps {
  visible: boolean;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  titleAlign?: 'left' | 'center';
  showHandle?: boolean;
  subtitle?: string;
  variant?: 'standard' | 'model' | 'drama';
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  closeLabel?: string;
  dismissible?: boolean;
  dismissOnBackdrop?: boolean;
  scroll?: boolean;
  maxHeight?: number;
  maxWidth?: number;
  bottomPadding?: number;
}
export function YSheet({
  visible, title, subtitle, titleStyle, titleAlign = 'left', showHandle, variant = 'standard', children, footer, onClose, closeLabel = 'Close sheet',
  dismissible = true, dismissOnBackdrop = dismissible, scroll = true, maxHeight, maxWidth, bottomPadding,
}: YSheetProps) {
  const { height: windowHeight } = useWindowDimensions();
  const height = useContext(OverlayViewportContext)?.height ?? windowHeight;
  const insets = useSafeAreaInsets();
  const isModel = variant === 'model';
  const isDrama = variant === 'drama';
  const motion = useOverlayMotion(visible, isModel ? motionTokens.modelPicker : motionTokens.bottomSheet);
  const dragY = useRef(new Animated.Value(0)).current;
  const drag = useMemo(() => {
    const snap = () => Animated.timing(dragY, { toValue: 0, duration: motionTokens.bottomSheet.snapBackMs,
      easing: Easing.out(Easing.ease), useNativeDriver: Platform.OS !== 'web' }).start();
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, state) => visible && dismissible && state.dy > 4 && state.dy > Math.abs(state.dx),
      onPanResponderMove: (_, state) => dragY.setValue(Math.max(0, state.dy)),
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > (isDrama ? 60 : motionTokens.bottomSheet.dismissDistance) || vy > (isDrama ? 0.8 : motionTokens.bottomSheet.dismissVelocity)) onClose();
        snap();
      },
      onPanResponderTerminate: snap,
    });
  }, [dismissible, dragY, isDrama, onClose, visible]);
  const available = Math.max(0, Math.min(height - insets.top - 24, maxHeight ?? height));
  const rise = motion.progress.interpolate({ inputRange: [0, 1], outputRange: [Math.max(height, 1), 0] });
  const radius = isModel ? sheetMetrics.modelPickerRadius : sheetMetrics.radius;
  const inset = isDrama ? 16 : layout.gutter;
  return (
    <OverlayHost {...motion} visible={visible} label={title ?? closeLabel} placement="bottom" onClose={dismissible ? onClose : undefined}
      onBackdropPress={dismissOnBackdrop ? onClose : undefined}
      backdrop={isModel ? sheetMetrics.modelPickerBackdrop : isDrama ? 'transparent' : sheetMetrics.backdrop}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.host} pointerEvents="box-none">
        <Animated.View style={[styles.panel, {
          maxHeight: available, maxWidth, paddingHorizontal: inset, paddingBottom: bottomPadding ?? bottomSheetBottomPadding(insets.bottom),
          backgroundColor: isDrama ? darkTokens.bgPrimary : sheetMetrics.background,
          borderTopLeftRadius: radius, borderTopRightRadius: radius, transform: [{ translateY: Animated.add(rise, dragY) }],
        }]}>
          {isDrama && <LinearGradient pointerEvents="none" colors={['#342832', darkTokens.bgPrimary]} style={styles.glow} />}
          <View collapsable={false} {...drag.panHandlers} style={styles.dragZone}>
            {(showHandle ?? isDrama) && <View style={isDrama ? styles.handle : modelSheetStyles.handle} />}
          </View>
          {title && <View style={[
            styles.heading, isModel && modelSheetStyles.heading, titleAlign === 'center' && styles.centerHeading,
          ]}>
            <Text accessibilityRole="header" style={[
              isModel ? modelSheetStyles.title : styles.standardTitle, styles.text, titleAlign === 'center' && styles.centerTitle, titleStyle,
            ]}>{title}</Text>
            {subtitle && <Text style={[typography.profileDetail, styles.secondary]}>{subtitle}</Text>}
          </View>}
          <YorollThemeProvider mode="dark">
            {scroll ? <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.body}>{children}</ScrollView> : <View style={styles.body}>{children}</View>}
            {footer && <View style={styles.footer}>{footer}</View>}
          </YorollThemeProvider>
          <YIconButton icon={IconClose} label={closeLabel} onPress={onClose} color={darkTokens.textSecondary}
            disabled={!dismissible} style={styles.close} />
        </Animated.View>
      </KeyboardAvoidingView>
    </OverlayHost>
  );
}
const styles = StyleSheet.create({
  host: { flex: 1, justifyContent: 'flex-end' },
  panel: { alignSelf: 'center', width: '100%', flexShrink: 1, overflow: 'hidden' },
  dragZone: { height: sheetMetrics.dragZoneH, alignItems: 'center', justifyContent: 'center' },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.1)' },
  glow: { position: 'absolute', left: 0, right: 0, top: 0, height: 160 },
  heading: { minHeight: 28, marginBottom: 10, marginLeft: 4, marginRight: layout.tapTarget, gap: 4 },
  centerHeading: { marginLeft: layout.tapTarget, alignItems: 'center' },
  centerTitle: { textAlign: 'center' },
  standardTitle: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
  text: { color: darkTokens.textPrimary },
  secondary: { color: darkTokens.textSecondary },
  body: { flexGrow: 0, flexShrink: 1, gap: 8 },
  scroll: { flexGrow: 0, flexShrink: 1 },
  footer: { paddingTop: 12 },
  close: { position: 'absolute', zIndex: 1, right: sheetMetrics.closeInset, top: sheetMetrics.closeInset },
});
