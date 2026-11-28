import { useContext, useState } from 'react';
import { IconBackward, IconMoreHorizontal, IconPhonecall } from '@yoroll/rn-icon';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  YAvatar, YComposer, YIconButton, YMessageBubble, YSheet, chatHeaderStyles, darkTokens,
} from '@yoroll/app-components';
import { ModelPart } from './screenOverlays';
import { partRenderers } from './screenParts';
import { sectionContext, useScreenArtwork } from './sectionContext';
import type { ScreenPart } from './screenModel';

const layoutStyles = StyleSheet.create({
  background: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0B0B0D' },
  top: { position: 'relative', paddingBottom: 5, backgroundColor: 'rgba(11,11,13,0.46)' },
  body: { flex: 1, minHeight: 0 },
  list: { flex: 1, minHeight: 0 },
  listContent: { flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: 12, paddingTop: 56, paddingBottom: 10, gap: 12 },
  composer: { paddingHorizontal: 12, paddingTop: 8, gap: 6 },
  notice: { textAlign: 'center', fontSize: 10, lineHeight: 15, color: 'rgba(245,245,243,0.52)' },
});

export function ChatBackdrop() {
  const art = useScreenArtwork();
  return <View style={layoutStyles.background} pointerEvents="none">
    <Image source={art('night')} contentFit="cover" contentPosition="top" style={StyleSheet.absoluteFill} />
    <LinearGradient colors={['rgba(11,11,13,0.48)', 'rgba(11,11,13,0.40)', 'rgba(11,11,13,0.96)']}
      locations={[0, 0.42, 1]} style={StyleSheet.absoluteFill} />
  </View>;
}

export function ChatHeader({ model, onBack }: { model: ScreenPart; onBack?: () => void }) {
  const art = useScreenArtwork();
  const { top } = useSafeAreaInsets();
  const { announce } = useContext(sectionContext);
  return <View style={[chatHeaderStyles.topBar, layoutStyles.top, { minHeight: top + 54, paddingTop: top + 5 }]}>
    <YIconButton icon={IconBackward} label="返回页面索引" iconSize={22} size={40} color={darkTokens.textPrimary} onPress={onBack ?? (() => {})} />
    <View style={chatHeaderStyles.titleWrap}>
      <YAvatar name="月光旅人" src={art('night')} size={34} />
      <Text numberOfLines={1} style={[chatHeaderStyles.title, { color: darkTokens.textPrimary, flexShrink: 1 }]}>月光旅人</Text>
    </View>
    <ModelPart part={model} compact />
    <YIconButton icon={IconPhonecall} label="语音通话" iconSize={18} size={40} color={darkTokens.textPrimary}
      onPress={() => announce('打开语音通话')} />
  </View>;
}

export function ChatConversation({ message, layers }: { message: ScreenPart; layers: readonly ScreenPart[] }) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const { announce } = useContext(sectionContext);
  const art = useScreenArtwork();
  const { bottom } = useSafeAreaInsets();
  return <View style={layoutStyles.body}>
    <ScrollView style={layoutStyles.list} contentContainerStyle={layoutStyles.listContent} keyboardShouldPersistTaps="handled">
      <YMessageBubble variant="narration" onPhoto text={message.detail ?? '夜色里的灯塔忽明忽暗。'} />
      <YMessageBubble onPhoto text={message.items?.[0] ?? '你也在等那班船吗？'} leading={<YAvatar name="月光旅人" src={art('night')} size={28} />} />
      <YMessageBubble variant="thought" onPhoto text="也许下一班船会带来一封新信。" />
      {messages.map((text, index) => <YMessageBubble key={index} variant="user" onPhoto text={text} />)}
    </ScrollView>
    <View style={[layoutStyles.composer, { paddingBottom: bottom + 12 }]}>
      <YComposer value={draft} onChangeText={setDraft} placeholder="输入消息" sendLabel="发送" voiceLabel="语音输入"
        addLabel="聊天操作" onAdd={() => setOpen(true)} onVoice={() => announce('语音输入')}
        onSend={(text) => { setMessages((previous) => [...previous, text]); setDraft(''); }} onPhoto />
      <Text style={layoutStyles.notice}>内容由 AI 生成</Text>
    </View>
    <YSheet visible={open} title="聊天操作" closeLabel="关闭聊天操作" onClose={() => setOpen(false)} maxWidth={480}>
      {layers.map((part, index) => {
        const Part = partRenderers[part.kind];
        return <Part key={part.kind + index} part={part} />;
      })}
    </YSheet>
  </View>;
}
