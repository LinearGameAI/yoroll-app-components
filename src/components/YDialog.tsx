import type { ReactNode } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { IconClose } from '@yoroll/rn-icon';
import { nativeConfirmStyles, nativeNoticeStyles, rewardBannerAppearance } from '../appStyles';
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
  const reward = variant === 'reward';
  const featuresArtwork = variant === 'notice' || variant === 'reward';
  const centered = dialogMetrics.centered;
  const notice = dialogMetrics.notice;
  const bodyColor = featuresArtwork ? '#D8D8DC' : tokens.textSecondary;
  return (
    <OverlayHost {...motion} visible={visible} onClose={onClose} onBackdropPress={dismissOnBackdrop ? onClose : undefined}
      backdrop={featuresArtwork ? notice.backdrop : centered.backdrop}
      style={[styles.center, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
      <Animated.View style={[styles.stack, {
        maxWidth: reward ? 320 : featuresArtwork ? notice.maxWidth : centered.maxWidth, opacity: motion.progress,
      }]}>
        <View style={[styles.card, reward && styles.rewardCard, {
          borderRadius: featuresArtwork ? notice.borderRadius : centered.borderRadius,
          backgroundColor: featuresArtwork ? notice.background : tokens.bgSecondary,
          borderColor: featuresArtwork ? 'rgba(255,255,255,0.08)' : tokens.cardStroke,
        }]}>
          {featuresArtwork && <LinearGradient pointerEvents="none" colors={reward ? ['#523942', '#221E23', '#19191C'] : notice.surfaceColors}
            style={[StyleSheet.absoluteFill, { borderRadius: notice.borderRadius }]} />}
          {reward && artwork && <View style={styles.rewardArtwork}>{artwork}</View>}
          <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, featuresArtwork ? nativeNoticeStyles.cardContent : styles.simpleContent, reward && styles.rewardContent]}>
            {!featuresArtwork && <View style={styles.heading}>
              <Text accessibilityRole="header" style={[typography.creatorHeading, styles.title, { color: tokens.textPrimary }]}>{title}</Text>
              {onClose && <YIconButton icon={IconClose} label={closeLabel} onPress={onClose}
                style={styles.simpleClose} color={tokens.textSecondary} />}
            </View>}
            {featuresArtwork && !reward && artwork && <View style={styles.art}>{artwork}</View>}
            {featuresArtwork && <Text accessibilityRole="header" style={[nativeNoticeStyles.title]}>{title}</Text>}
            {description && <Text style={[featuresArtwork ? typography.noticeBody : typography.creatorBody, {
              color: bodyColor, textAlign: featuresArtwork ? 'center' : 'auto',
            }]}>{description}</Text>}
            {children}
            {(primary || secondary) && <View style={styles.actions}>
              {primary && <YButton fullWidth size="lg" variant={variant === 'alert' ? 'danger' : 'primary'}
                backgroundGradient={reward ? rewardBannerAppearance.buttonGradient : undefined}
                backgroundHighlightGradient={reward ? rewardBannerAppearance.buttonHighlight : undefined} {...primary}
                style={[featuresArtwork && nativeNoticeStyles.primaryButton, reward && styles.rewardAction, primary.style]}
                textStyle={[featuresArtwork && nativeNoticeStyles.primaryButtonText, primary.textStyle]} />}
              {secondary && <YButton fullWidth size="lg" variant="secondary" {...secondary} />}
            </View>}
          </ScrollView>
          {featuresArtwork && !reward && onClose && <YIconButton icon={IconClose} label={closeLabel} onPress={onClose}
            iconSize={16} color="rgba(255,255,255,0.65)" style={styles.noticeClose} />}
        </View>
        {reward && onClose && <YIconButton icon={IconClose} label={closeLabel} onPress={onClose}
          color="rgba(255,255,255,0.9)" style={styles.rewardClose} />}
      </Animated.View>
    </OverlayHost>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  stack: { width: '100%', maxHeight: '100%', flexShrink: 1 },
  card: { width: '100%', maxHeight: '100%', flexShrink: 1, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth },
  rewardCard: { overflow: 'visible', borderWidth: 0 },
  rewardArtwork: { alignItems: 'center', marginTop: -39 },
  rewardContent: { paddingTop: 8 },
  rewardAction: { backgroundColor: 'transparent' },
  rewardClose: { alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.12)', marginTop: 12 },
  scroll: { flexGrow: 0, flexShrink: 1 },
  content: { gap: dialogMetrics.centered.gap },
  simpleContent: { padding: dialogMetrics.centered.padding },
  heading: nativeConfirmStyles.heading,
  title: { flex: 1 },
  simpleClose: { marginVertical: -10, marginRight: -10 },
  noticeClose: { position: 'absolute', top: 2, right: 2 },
  art: { overflow: 'hidden', borderRadius: dialogMetrics.notice.artworkRadius },
  actions: { gap: 8, alignSelf: 'stretch' },
});
