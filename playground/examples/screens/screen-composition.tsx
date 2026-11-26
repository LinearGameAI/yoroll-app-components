import { useState } from 'react';
import {
  IconAppfeed, IconAppfeedFilled, IconGenerate, IconGenerateFilled, IconHomepage, IconHomepageFilled, IconMe,
  IconMeFilled, IconMessage, IconMessageFilled,
} from '@yoroll/rn-icon';
import { ScrollView, StyleSheet, View } from 'react-native';
import { YActionBar, YBottomNav, YScreenLayout, YState, YTab, YToast, type YBottomNavItem } from '@yoroll/app-components';
import { partRenderers } from './screenParts';
import { publicArtworkBase, sectionContext } from './sectionContext';
import type { ScreenRecipe, ScreenState } from './screenModel';

const tabItems: readonly YBottomNavItem[] = [
  { key: 'home', label: '首页', icon: IconHomepage, activeIcon: IconHomepageFilled },
  { key: 'discover', label: '发现', icon: IconGenerate, activeIcon: IconGenerateFilled },
  { key: 'featured', label: '精选', icon: IconAppfeed, activeIcon: IconAppfeedFilled },
  { key: 'messages', label: '消息', icon: IconMessage, activeIcon: IconMessageFilled, unread: true },
  { key: 'me', label: '我的', icon: IconMe, activeIcon: IconMeFilled },
];

export interface ScreenCompositionProps {
  recipe: ScreenRecipe;
  state?: ScreenState;
  artworkBase?: string;
  onBack?: () => void;
  onNavigateTab?: (tab: string) => void;
  onReset?: () => void;
}

export function ScreenComposition({ recipe, state = 'ready', artworkBase = publicArtworkBase, onBack, onNavigateTab, onReset }: ScreenCompositionProps) {
  const [active, setActive] = useState(recipe.activeTab ?? 'home');
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState('0');
  const [message, setMessage] = useState('');
  const announce = (value: string) => setMessage(value);
  const ready = state === 'ready';
  const isLastStep = !recipe.steps || step === recipe.steps.length - 1;
  const submitLabel = isLastStep ? recipe.completeLabel ?? recipe.footer : recipe.footer;
  const back = recipe.steps && step > 0 ? () => setStep(step - 1) : onBack;
  const footer = recipe.shell === 'tab' ? (
    <YBottomNav items={tabItems} active={active} onChange={(key) => { setActive(key); onNavigateTab?.(key); }} />
  ) : recipe.footer && ready ? (
    <YActionBar primary={{ label: submitLabel ?? recipe.footer, onPress: () => {
      if (isLastStep) announce('已选择' + (submitLabel ?? recipe.footer));
      else setStep(step + 1);
    } }} secondary={step > 0 ? { label: '上一步', onPress: () => setStep(step - 1) }
      : recipe.secondary ? { label: recipe.secondary, onPress: () => announce('已选择' + recipe.secondary) } : undefined} />
  ) : undefined;

  const feedback = { loading: '正在加载' + recipe.title, empty: '暂无相关内容', error: '加载失败，请重试' };
  return (
    <sectionContext.Provider value={{ artworkBase, announce, tab, setTab }}>
      <View style={styles.frame}>
        <YScreenLayout title={recipe.shell === 'full' ? undefined : recipe.title} onBack={back} backLabel={step > 0 ? '上一步' : '返回页面索引'} footer={footer}>
          {ready && recipe.steps && <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stepBar}>
            <YTab variant="pill" active={String(step)} onChange={(key) => setStep(Number(key))}
              items={recipe.steps.map((label, index) => ({ key: String(index), label }))} />
          </ScrollView>}
          {ready ? recipe.parts.map((part, index) => {
            const Part = partRenderers[part.kind];
            const hidden = part.step !== undefined && part.step !== step;
            return <View key={part.kind + index} style={hidden && styles.hidden}><Part part={part} /></View>;
          }) : <YState state={state} title={feedback[state]} action={onReset && state !== 'loading' ? {
            label: state === 'error' ? '重试' : '恢复预览', onPress: onReset,
          } : undefined} />}
        </YScreenLayout>
        {message && <View pointerEvents="none" style={styles.toast}>
          <YToast message={message} onHidden={() => setMessage('')} />
        </View>}
      </View>
    </sectionContext.Provider>
  );
}
const styles = StyleSheet.create({
  frame: { flex: 1, minHeight: 0, minWidth: 0 },
  stepBar: { flexGrow: 0, flexShrink: 0 },
  hidden: { display: 'none' },
  toast: { position: 'absolute', bottom: 72, left: 12, right: 12 },
});
