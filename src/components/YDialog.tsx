import type { ReactNode } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { IconClose } from '@yoroll/rn-icon';
import { dialogMetrics } from '../foundations';
import { useTheme } from '../theme';
import { typography } from '../typography';
import { OverlayHost, useOverlayMotion } from './overlayHost';
import { YButton, type YButtonProps } from './YButton';
import { YIconButton } from './YIconButton';

export interface YDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  variant?: 'confirm' | 'alert' | 'notice' | 'reward';
  artwork?: ReactNode;
  children?: ReactNode;
  primary?: YButtonProps & { label: string };
  secondary?: YButtonProps & { label: string };
  onClose?: () => void;
  closeLabel?: string;
  dismissOnBackdrop?: boolean;
}

export function YDialog({
  visible, title, description, variant = 'confirm', artwork, children, primary, secondary,
  onClose, closeLabel = 'Close dialog', dismissOnBackdrop = false,
}: YDialogProps) {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const motion = useOverlayMotion(visible);
  const featuresArtwork = variant === 'notice' || variant === 'reward';
  const centered = dialogMetrics.centered;
  const notice = dialogMetrics.notice;
  const bodyColor = featuresArtwork ? '#D8D8DC' : tokens.textSecondary;
  return (
    <OverlayHost {...motion} visible={visible} onClose={onClose} onBackdropPress={dismissOnBackdrop ? onClose : undefined}
      backdrop={featuresArtwork ? notice.backdrop : centered.backdrop}
      style={[styles.center, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
      <Animated.View style={[styles.card, {
        maxWidth: featuresArtwork ? notice.maxWidth : centered.maxWidth,
        borderRadius: featuresArtwork ? notice.borderRadius : centered.borderRadius,
        backgroundColor: featuresArtwork ? notice.background : tokens.bgSecondary,
        borderColor: featuresArtwork ? 'rgba(255,255,255,0.08)' : tokens.cardStroke,
        opacity: motion.progress,
      }]}>
        {featuresArtwork && <LinearGradient pointerEvents="none" colors={notice.surfaceColors} style={StyleSheet.absoluteFill} />}
        <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, featuresArtwork ? styles.noticeContent : styles.simpleContent]}>
          {!featuresArtwork && <View style={styles.heading}>
            <Text accessibilityRole="header" style={[typography.creatorHeading, styles.title, { color: tokens.textPrimary }]}>{title}</Text>
            {onClose && <YIconButton icon={IconClose} label={closeLabel} onPress={onClose}
              style={styles.simpleClose} color={tokens.textSecondary} />}
          </View>}
          {featuresArtwork && artwork && <View style={styles.art}>{artwork}</View>}
          {featuresArtwork && <Text accessibilityRole="header" style={[typography.noticeTitle, { color: '#F7F7F8', paddingHorizontal: 12 }]}>{title}</Text>}
          {description && <Text style={[featuresArtwork ? typography.noticeBody : typography.creatorBody, {
            color: bodyColor, textAlign: featuresArtwork ? 'center' : 'auto',
          }]}>{description}</Text>}
          {children}
          {(primary || secondary) && <View style={styles.actions}>
            {primary && <YButton fullWidth size="lg" variant={variant === 'alert' ? 'danger' : 'primary'} {...primary}
              style={[featuresArtwork && styles.noticeButton, primary.style]}
              textStyle={[featuresArtwork && styles.noticeLabel, primary.textStyle]} />}
            {secondary && <YButton fullWidth size="lg" variant="secondary" {...secondary} />}
          </View>}
        </ScrollView>
        {featuresArtwork && onClose && <YIconButton icon={IconClose} label={closeLabel} onPress={onClose}
          iconSize={16} color="rgba(255,255,255,0.65)" style={styles.noticeClose} />}
      </Animated.View>
    </OverlayHost>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  card: { width: '100%', maxHeight: '100%', flexShrink: 1, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  scroll: { flexGrow: 0, flexShrink: 1 },
  content: { gap: dialogMetrics.centered.gap },
  simpleContent: { padding: dialogMetrics.centered.padding },
  noticeContent: { paddingHorizontal: dialogMetrics.notice.paddingHorizontal, paddingTop: dialogMetrics.notice.paddingTop,
    paddingBottom: dialogMetrics.notice.paddingBottom },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1 },
  simpleClose: { marginVertical: -10, marginRight: -10 },
  noticeClose: { position: 'absolute', top: 2, right: 2 },
  art: { overflow: 'hidden', borderRadius: dialogMetrics.notice.artworkRadius },
  actions: { gap: 8 },
  noticeButton: { borderWidth: 0, backgroundColor: '#FFFFFF', borderRadius: dialogMetrics.notice.buttonRadius,
    minHeight: dialogMetrics.notice.buttonMinHeight },
  noticeLabel: { ...typography.noticeAction, color: '#1C1E22' },
});
