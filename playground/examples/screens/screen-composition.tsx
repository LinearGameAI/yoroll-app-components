import { useState, type ReactNode } from 'react';
import {
  IconAppfeed, IconAppfeedFilled, IconBill, IconCommentreport, IconGenerate, IconGenerateFilled, IconHomepage, IconHomepageFilled, IconMe,
  IconMeFilled, IconMessage, IconMessageFilled, IconSearch, IconSetting, IconTreatsFilled,
} from '@yoroll/rn-icon';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TreatText, YActionBar, YBottomNav, YButton, YIconButton, YPurchaseBackdrop, YScreenLayout, YSearchField, YState, YTab, YToast, YTopBar,
  layout, messageEmptyStyles, subscriptionButtonGradients, subscriptionButtonHighlight, subscriptionDockStyles, useTheme, type YBottomNavItem,
} from '@yoroll/app-components';
import { ChatBackdrop, ChatConversation, ChatHeader } from './screenChat';
import { LoginBackdrop, LoginMethods } from './screenLogin';
import { Plans, partRenderers } from './screenParts';
import { artworkPaths, publicArtworkBase, publicUiBase, sectionContext, type PreviewTier } from './sectionContext';
import type { ScreenPart, ScreenRecipe, ScreenState } from './screenModel';

const tabItems: readonly YBottomNavItem[] = [
  { key: 'home', label: '首页', icon: IconHomepage, activeIcon: IconHomepageFilled },
  { key: 'discover', label: '发现', icon: IconGenerate, activeIcon: IconGenerateFilled, iconSize: 21 },
  { key: 'featured', label: '精选', icon: IconAppfeed, activeIcon: IconAppfeedFilled },
  { key: 'messages', label: '消息', icon: IconMessage, activeIcon: IconMessageFilled, iconSize: 21 },
  { key: 'me', label: '我的', icon: IconMe, activeIcon: IconMeFilled },
];

export interface ScreenCompositionProps {
  recipe: ScreenRecipe;
  state?: ScreenState;
  artworkBase?: string;
  uiBase?: string;
  onBack?: () => void;
  onNavigateTab?: (tab: string) => void;
  onReset?: () => void;
}

function PurchaseDock({ cycle, title, tier, announce }: { cycle: ScreenPart; title: string; tier: PreviewTier; announce: (message: string) => void }) {
  const { bottom } = useSafeAreaInsets();
  const s = subscriptionDockStyles;
  return <View style={[s.purchaseDock, styles.purchaseDock, { paddingBottom: bottom + 6 }]}>
    <Plans part={cycle} />
    <YButton label={title} size="xl" fullWidth style={s.purchaseButton} textStyle={s.purchaseButtonText}
      backgroundGradient={subscriptionButtonGradients[tier]} backgroundHighlightGradient={subscriptionButtonHighlight}
      onPress={() => announce('已选择' + title)} />
    <View style={s.legalRow}>
      {['恢复购买', '服务条款', '隐私政策'].map((label) => <Pressable key={label} accessibilityRole="button" style={s.legalAction}
        onPress={() => announce(label)}><Text style={s.legalLink}>{label}</Text></Pressable>)}
    </View>
  </View>;
}

export function ScreenComposition({
  recipe, state = 'ready', artworkBase = publicArtworkBase, uiBase = publicUiBase, onBack, onNavigateTab, onReset,
}: ScreenCompositionProps) {
  const [active, setActive] = useState(recipe.activeTab ?? 'home');
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState('0');
  const [tier, setTier] = useState<PreviewTier>('basic');
  const [discoverQuery, setDiscoverQuery] = useState('');
  const [message, setMessage] = useState('');
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const announce = (value: string) => setMessage(value);
  const ready = state === 'ready';
  const isLastStep = !recipe.steps || step === recipe.steps.length - 1;
  const submitLabel = isLastStep ? recipe.completeLabel ?? recipe.footer : recipe.footer;
  const back = recipe.steps && step > 0 ? () => setStep(step - 1) : onBack;
  const look = recipe.appearance;
  const cycle = look === 'membership' ? recipe.parts.find((part) => part.kind === 'plans' && part.variant === 'cycle') : undefined;
  const model = look === 'chat' ? recipe.parts.find((part) => part.kind === 'model') : undefined;
  const conversation = look === 'chat' ? recipe.parts.find((part) => part.kind === 'messages') : undefined;
  const chat = !!model && !!conversation;
  const profile = look === 'profile';
  const edgeToEdge = chat || profile || look === 'inbox' || look === 'drama';
  const title = recipe.shell === 'full' || look === 'inbox' ? undefined : recipe.title;

  let header: ReactNode;
  let background: ReactNode;
  if (look === 'home') header = <YTopBar leftSlot={<View style={styles.brand}>
    <Image source={uiBase + 'home/wordmark.webp'} style={styles.homeLogo} contentFit="contain" accessibilityLabel="Yoroll" />
  </View>} rightSlot={<YIconButton icon={IconSearch} label="搜索" iconSize={22} onPress={() => announce('打开搜索')} />} />;
  if (look === 'discover') header = <View style={[styles.discoverHeader, { minHeight: insets.top + layout.topBarH, paddingTop: insets.top }]}>
    <Pressable accessibilityRole="button" accessibilityLabel="Treats 余额 1,280" onPress={() => announce('查看 Treats 余额')} style={styles.treatsEntry}>
      <IconTreatsFilled size={15} color={tokens.orange7} /><TreatText style={{ fontSize: 13, fontFamily: 'GeologicaSemiBold' }}>1,280</TreatText>
    </Pressable>
    <View style={styles.discoverSearch}><YSearchField label="搜索角色" value={discoverQuery} onChangeText={setDiscoverQuery} variant="entry" /></View>
    <YIconButton icon={IconCommentreport} label="举报内容" iconSize={18} size={34} onPress={() => announce('举报内容')} />
  </View>;
  if (profile) header = <YTopBar rightSlot={<YIconButton icon={IconSetting} label="设置" onPress={() => announce('打开设置')} />}
    style={styles.profileHeader} />;
  if (look === 'membership' || look === 'treats' || look === 'tasks') {
    background = <YPurchaseBackdrop tier={tier} cover={artworkBase + artworkPaths[tier]} variant={cycle ? 'membership' : 'treats'} />;
    header = <YTopBar title={recipe.title} onBack={onBack} backLabel="返回页面索引" style={styles.clear}
      rightSlot={look === 'treats' || look === 'tasks'
        ? <YIconButton icon={IconBill} label="Treats 流水" onPress={() => announce('查看 Treats 流水')} /> : undefined} />;
  }
  if (look === 'login') background = <LoginBackdrop />;
  if (chat) {
    background = <ChatBackdrop />;
    header = <ChatHeader model={model} onBack={onBack} />;
  }

  const footer = recipe.shell === 'tab' ? (
    <YBottomNav items={tabItems} active={active} onChange={(key) => { setActive(key); onNavigateTab?.(key); }} />
  ) : cycle && ready ? <PurchaseDock cycle={cycle} title={recipe.footer ?? '继续订阅'} tier={tier} announce={announce} /> :
    recipe.footer && ready ? (
      <YActionBar primary={{ label: submitLabel ?? recipe.footer, onPress: () => {
        if (isLastStep) announce('已选择' + (submitLabel ?? recipe.footer));
        else setStep(step + 1);
      } }} secondary={step > 0 ? { label: '上一步', onPress: () => setStep(step - 1) }
        : recipe.secondary ? { label: recipe.secondary, onPress: () => announce('已选择' + recipe.secondary) } : undefined} />
    ) : undefined;
  const feedback = { loading: '正在加载' + recipe.title, empty: '暂无相关内容', error: '加载失败，请重试' };
  const contentPadding = edgeToEdge ? 0 : 16;
  const topPadding = look === 'inbox' ? 8 : look === 'login' ? 12 : contentPadding;
  const bottomPadding = look === 'login' ? 24 : look === 'membership' ? 20 : contentPadding;

  return (
    <sectionContext.Provider value={{ artworkBase, uiBase, announce, tab, setTab, tier, setTier }}>
      <View style={styles.frame}>
        <YScreenLayout title={title} header={header} background={background} onBack={back}
          backLabel={step > 0 ? '上一步' : '返回页面索引'} footer={footer} scroll={!chat}
          edgeToEdge={edgeToEdge}
          contentStyle={[
            look === 'membership' && styles.purchaseBody,
            look === 'login' && styles.loginContent,
            look === 'discover' && styles.discoverContent,
            !header && !title && { paddingTop: insets.top + topPadding },
            profile && !ready && { paddingTop: insets.top + layout.topBarH },
            !footer && (!chat || !ready) && { paddingBottom: insets.bottom + bottomPadding },
          ]}>
          {ready && recipe.steps && <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stepBar}>
            <YTab variant="pill" active={String(step)} onChange={(key) => setStep(Number(key))}
              items={recipe.steps.map((label, index) => ({ key: String(index), label }))} />
          </ScrollView>}
          {ready ? look === 'login' ? <LoginMethods /> : chat ? <ChatConversation message={conversation} layers={recipe.parts.filter((part) => part !== model && part !== conversation)} /> :
            recipe.parts.filter((part) => part !== cycle && !(look === 'membership' && part.kind === 'banner')).map((part, index) => {
              const Part = partRenderers[part.kind];
              const hidden = part.step !== undefined && part.step !== step;
              const inset = profile && part.kind !== 'account' && part.kind !== 'identity' || look === 'inbox' && part.kind !== 'inbox' || look === 'drama' && part.kind !== 'player';
              return <View key={part.kind + index} style={[inset && styles.inset, hidden && styles.hidden]}><Part part={part} /></View>;
            }) : state === 'empty' && look === 'inbox' ? (
              <View style={[messageEmptyStyles.container, styles.messageEmpty]}>
                <Image source={artworkBase + 'brand/me-empty-state.webp'} contentFit="contain" style={messageEmptyStyles.image} />
                <Text style={[messageEmptyStyles.message, { color: tokens.textTertiary }]}>暂无消息</Text>
              </View>
            ) : <YState state={state} title={feedback[state]} action={onReset && state !== 'loading' ? {
              label: state === 'error' ? '重试' : '恢复预览', onPress: onReset,
            } : undefined} />}
        </YScreenLayout>
        {message && <View pointerEvents="none" style={[styles.toast, { bottom: insets.bottom + (cycle ? 236 : 72) }]}>
          <YToast message={message} onHidden={() => setMessage('')} />
        </View>}
      </View>
    </sectionContext.Provider>
  );
}

const styles = StyleSheet.create({
  frame: { flex: 1, minHeight: 0, minWidth: 0 },
  brand: { paddingHorizontal: 12 },
  homeLogo: { width: 112, height: 26 },
  discoverHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12 },
  discoverSearch: { flex: 1, minWidth: 0 },
  treatsEntry: { flexDirection: 'row', alignItems: 'center', minHeight: 36, gap: 4 },
  discoverContent: { paddingTop: 4 },
  messageEmpty: { minHeight: 380 },
  loginContent: { flexGrow: 1, justifyContent: 'flex-end' },
  clear: { backgroundColor: 'transparent' },
  profileHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3, backgroundColor: 'transparent' },
  purchaseBody: { paddingTop: 8, paddingBottom: 20 },
  purchaseDock: { backgroundColor: 'rgba(11,10,13,0.90)' },
  stepBar: { flexGrow: 0, flexShrink: 0 },
  hidden: { display: 'none' },
  inset: { paddingHorizontal: 12 },
  toast: { position: 'absolute', left: 12, right: 12 },
});
