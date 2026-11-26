import type { ReactNode } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { OverlayHost, useOverlayMotion } from './overlayHost';
import { YScreenLayout } from './YScreenLayout';

export interface YFullscreenOverlayProps {
  visible: boolean;
  title: string;
  onClose?: () => void;
  closeLabel?: string;
  footer?: ReactNode;
  children: ReactNode;
}
export function YFullscreenOverlay({ visible, title, onClose, closeLabel = 'Back', children, footer }: YFullscreenOverlayProps) {
  const motion = useOverlayMotion(visible);
  return (
    <OverlayHost {...motion} visible={visible} onClose={onClose}>
      <Animated.View style={[styles.screen, { opacity: motion.progress }]}>
        <YScreenLayout title={title} onBack={onClose} backLabel={closeLabel} footer={footer}>{children}</YScreenLayout>
      </Animated.View>
    </OverlayHost>
  );
}
const styles = StyleSheet.create({ screen: { flex: 1 } });
