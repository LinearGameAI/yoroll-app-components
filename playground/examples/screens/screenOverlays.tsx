import { useContext, useState } from 'react';
import {
  IconAngleright, IconCopy, IconModelClaudeFilled, IconModelklingFilled, IconModelNanobananaLogoNomoFilled,
  IconModelswitch, IconModelYorollFilled, IconMoreHorizontal, IconShare, IconSocialX, IconTreatsFilled,
} from '@yoroll/rn-icon';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  TreatText, YActionBar, YBadge, YButton, YChoiceGroup, YCommentRow, YComposer, YDialog,
  YFullscreenOverlay, YIconButton, YModelCard, YSheet, chatHeaderStyles, darkTokens, modelPickerStyles,
  sharePreviewStyles, shareSheetStyles, useTheme,
} from '@yoroll/app-components';
import { sectionContext, useScreenArtwork } from './sectionContext';
import type { ScreenPart } from './screenModel';

const choicesFor = (items: readonly string[]) => items.map((label, index) => ({ key: String(index), label }));

export function ConfirmPart({ part }: { part: ScreenPart }) {
  const [open, setOpen] = useState(false);
  const { announce } = useContext(sectionContext);
  const danger = part.variant === 'danger';
  const close = () => setOpen(false);
  return <View>
    <YButton label={part.label} size="sm" variant={danger ? 'danger' : 'outline'} onPress={() => setOpen(true)} />
    <YDialog visible={open} title={part.label} variant={danger ? 'alert' : 'confirm'} description={part.detail}
      onClose={close} closeLabel="关闭确认框"
      primary={{ label: part.items?.[0] ?? '确定', variant: danger ? 'danger' : 'primary',
        onPress: () => { close(); announce('已确认'); } }}
      secondary={{ label: part.items?.[1] ?? '取消', onPress: close }} />
  </View>;
}

export function NoticeDialogPart({ part }: { part: ScreenPart }) {
  const [open, setOpen] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const { announce } = useContext(sectionContext);
  const asset = useScreenArtwork();
  const reward = part.variant === 'reward';
  if (part.variant === 'paywall') return <View>
    <YButton label={part.label} variant="secondary" size="sm" onPress={() => setOpen(true)} />
    <YSheet visible={open} variant="drama" title="解锁会员剧集" titleAlign="center"
      titleStyle={{ fontSize: 24, lineHeight: 32 }} onClose={() => setOpen(false)} closeLabel="关闭会员解锁"
      maxWidth={520} footer={<YButton label={part.items?.[0] ?? '查看会员权益'} size="lg" fullWidth
        style={{ borderRadius: 12, minHeight: 52 }} onPress={() => { setOpen(false); announce('查看会员权益'); }} />}>
      {part.detail && <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 20, textAlign: 'center' }}>{part.detail}</Text>}
      <Image source={asset('gate')} contentFit="contain" style={{ alignSelf: 'center', width: 220, height: 141 }} />
    </YSheet>
  </View>;
  const action = part.items?.[0] ?? (reward ? '领取' : '我知道了');
  return <View>
    <YButton label={part.label} variant="secondary" size="sm" onPress={() => setOpen(true)} />
    <YDialog visible={open} title={part.label} description={part.detail} variant={reward ? 'reward' : 'notice'}
      onClose={() => setOpen(false)} closeLabel="关闭公告"
      artwork={reward ? <View style={styles.rewardArtwork} pointerEvents="none">
        <Image source={asset('treat')} contentFit="contain" style={styles.rewardAccent} />
        <Image source={asset('rewardTreats')} contentFit="contain" style={styles.rewardTreats} />
      </View> : <Image source={asset('event')} contentFit="cover"
        style={{ width: '100%', aspectRatio: 1.62 }} />}
      primary={{ label: reward && claimed ? '已领取' : action, onPress: () => {
        setClaimed(true); setOpen(false); announce(reward ? '领取完成' : '已关闭公告');
      } }}>
      {reward && <View style={styles.rewardAmount}>
        <IconTreatsFilled size={24} color="#FF9CD5" /><TreatText style={styles.rewardValue}>{part.items?.[1] ?? '+30'}</TreatText>
      </View>}
    </YDialog>
  </View>;
}

export function SheetPart({ part }: { part: ScreenPart }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('0');
  const [applied, setApplied] = useState('');
  const items = part.items ?? ['默认设置', '自定义'];
  return <View>
    <YButton label={applied ? part.label + ' · ' + applied : part.label} size="sm" variant="secondary" onPress={() => setOpen(true)} />
    <YSheet visible={open} title={part.label} subtitle={part.detail} variant={part.variant === 'drama' ? 'drama' : part.variant === 'model' ? 'model' : 'standard'}
      closeLabel="关闭弹层" maxWidth={560} onClose={() => setOpen(false)}
      footer={<YButton label="应用" fullWidth onPress={() => { setApplied(items[Number(selected)]); setOpen(false); }} />}>
        <YChoiceGroup label={part.label} value={selected} onChange={setSelected} items={choicesFor(items)} />
    </YSheet>
  </View>;
}

const modelCategories = [
  { key: 'text', label: '文字' }, { key: 'image', label: '图片' }, { key: 'video', label: '视频' },
] as const;
const modelExamples = {
  text: [
    { label: 'Yoroll', icon: IconModelYorollFilled, description: '适合日常陪伴和互动剧情。', price: '2 / 轮' },
    { label: 'Claude Sonnet', icon: IconModelClaudeFilled, description: '长篇叙事、角色设定和多轮对话。', price: '8 / 轮' },
  ],
  image: [{ label: 'Nano Banana', icon: IconModelNanobananaLogoNomoFilled, description: '生成角色插画与对话场景。', price: '20 / 张' }],
  video: [{ label: 'Kling', icon: IconModelklingFilled, description: '让生成的角色图动起来。', price: '90 / 段' }],
};
type ModelCategory = typeof modelCategories[number]['key'];

export function ModelPart({ part, compact = false }: { part: ScreenPart; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<ModelCategory>('text');
  const [models, setModels] = useState<Record<ModelCategory, string>>({ text: 'Yoroll', image: 'Nano Banana', video: 'Kling' });
  const { announce } = useContext(sectionContext);
  const { tokens, fonts } = useTheme();
  return <View>
    {compact ? <Pressable accessibilityRole="button" accessibilityLabel={part.label + ' · ' + models.text}
      onPress={() => setOpen(true)} style={[chatHeaderStyles.modelSwitchPill, { backgroundColor: tokens.bgTertiary }]}>
      <IconModelswitch size={15} color={tokens.textPrimary} />
      <Text numberOfLines={1} style={[chatHeaderStyles.modelSwitchText, { color: tokens.textPrimary, maxWidth: 94 }]}>{models.text}</Text>
    </Pressable> : <YButton label={part.label + ' · ' + models.text} variant="secondary" size="sm" onPress={() => setOpen(true)} />}
    <YSheet visible={open} variant="model" title={part.label} showHandle
      closeLabel="关闭模型选择" onClose={() => setOpen(false)} maxWidth={500}>
      <View style={modelPickerStyles.modelPickerIntro}>
        <Pressable accessibilityRole="button" accessibilityLabel="Treats 余额 1,280，充值" style={modelPickerStyles.modelPiecesRow}
          onPress={() => { setOpen(false); announce('Treats 余额 1,280'); }}>
          <IconTreatsFilled size={16} color={darkTokens.orange7} />
          <View style={modelPickerStyles.modelPiecesContent}>
            <TreatText style={[modelPickerStyles.modelPiecesAmount, { fontFamily: fonts.geologicaSemibold }]}>1,280</TreatText>
            <Text style={[modelPickerStyles.modelPiecesText, { color: darkTokens.textTertiary }]}>·</Text>
            <View style={modelPickerStyles.modelRechargeLabel}>
              <Text style={[modelPickerStyles.modelPiecesText, { color: darkTokens.textPrimary }]}>充值</Text>
              <IconAngleright size={12} color={darkTokens.textPrimary} />
            </View>
          </View>
        </Pressable>
        <View style={[modelPickerStyles.modelTabs, { backgroundColor: darkTokens.bgCard }]} accessibilityRole="tablist">
          {modelCategories.map(({ key, label }) => <Pressable key={key} accessibilityRole="tab"
            accessibilityState={{ selected: category === key }} onPress={() => setCategory(key)}
            style={[modelPickerStyles.modelTab, { backgroundColor: category === key ? darkTokens.bgTertiary : 'transparent' }]}>
            <Text style={[modelPickerStyles.modelTabText, { color: category === key ? darkTokens.textPrimary : darkTokens.textTertiary }]}>{label}</Text>
          </Pressable>)}
        </View>
      </View>
      <View accessibilityRole="radiogroup">
        {modelExamples[category].map(({ label, icon: Icon, description, price }, index) => <YModelCard key={label}
          title={label} description={description} price={price} icon={<Icon size={20} color={darkTokens.textPrimary} />}
          selected={models[category] === label} onSelect={() => setModels((old) => ({ ...old, [category]: label }))}
          referencePrice={index ? '12 / 轮' : undefined} countdown={index ? '02:18:36' : undefined}
          badge={index ? <YBadge label="限时优惠" variant="brand" /> : undefined} />)}
      </View>
    </YSheet>
  </View>;
}

export function SharePart({ part }: { part: ScreenPart }) {
  const [open, setOpen] = useState(false);
  const { announce } = useContext(sectionContext);
  const asset = useScreenArtwork();
  const choose = (message: string) => { setOpen(false); announce(message); };
  return <View>
    <YIconButton icon={IconShare} label={part.label} onPress={() => setOpen(true)} variant="surface" />
    <YSheet visible={open} title="让故事遇见更多人" titleAlign="center" titleStyle={shareSheetStyles.companionTitle}
      closeLabel="关闭分享" onClose={() => setOpen(false)} maxWidth={480}>
      <View style={[sharePreviewStyles.characterCard, { backgroundColor: darkTokens.bgTertiary, marginTop: 8 }]}>
        <View style={[sharePreviewStyles.characterImage, { backgroundColor: darkTokens.bgSecondary }]}>
          <Image source={asset('forest')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" />
        </View>
        <View style={sharePreviewStyles.characterInfo}>
          <Text numberOfLines={2} style={[sharePreviewStyles.characterName, { color: darkTokens.textPrimary }]}>月光旅人</Text>
          <Text numberOfLines={2} style={[sharePreviewStyles.description, { color: darkTokens.textTertiary }]}>
            午夜书店的店主，总能找到一本适合你的书。
          </Text>
        </View>
      </View>
      <View style={[shareSheetStyles.linkRow, { backgroundColor: darkTokens.bgTertiary, marginTop: 12 }]}>
        <Text numberOfLines={1} style={[shareSheetStyles.linkText, { color: darkTokens.textTertiary }]}>https://example.com/yoroll-preview</Text>
        <YIconButton icon={IconCopy} label="复制链接" size={40} onPress={() => choose('已选择复制示例链接')} />
      </View>
      <View style={shareSheetStyles.targetsRow}>
        {[{ label: 'X', icon: IconSocialX }, { label: '更多', icon: IconMoreHorizontal }].map(({ label, icon }) =>
          <View key={label} style={shareSheetStyles.target}>
            <YIconButton icon={icon} size={60} iconSize={22} label={label} variant="surface" onPress={() => choose('已选择' + label)} />
            <Text style={{ fontSize: 12, color: darkTokens.textTertiary }}>{label}</Text>
          </View>)}
      </View>
    </YSheet>
  </View>;
}

export function FullscreenPart({ part }: { part: ScreenPart }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('0');
  const { announce } = useContext(sectionContext);
  return <View>
    <YButton label={part.label} variant="secondary" size="sm" onPress={() => setOpen(true)} />
    <YFullscreenOverlay visible={open} title={part.label} onClose={() => setOpen(false)} closeLabel="离开全屏页"
      footer={<YActionBar primary={{ label: '完成', onPress: () => { setOpen(false); announce('偏好已保存'); } }}
        secondary={{ label: '跳过', onPress: () => setOpen(false) }} />}>
      <YChoiceGroup label={part.detail ?? part.label} value={selected} onChange={setSelected}
        items={choicesFor(part.items ?? ['互动短剧', '互动游戏', '角色对话'])} />
    </YFullscreenOverlay>
  </View>;
}

export function CommentsPart({ part }: { part: ScreenPart }) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState(false);
  const [draft, setDraft] = useState('');
  const [comment, setComment] = useState<string[]>([]);
  return <View>
    <YButton label={part.label} variant="outline" size="sm" onPress={() => setOpen(true)} />
    <YSheet visible={open} title={part.label} maxWidth={560} closeLabel="关闭评论" onClose={() => setOpen(false)}
      footer={<YComposer value={draft} onChangeText={setDraft} placeholder="写下评论" sendLabel="发布"
        onSend={(text) => { setComment((previous) => [...previous, text]); setDraft(''); }} />}>
        <YCommentRow name="月光旅人" message={part.detail ?? '第二个结局很有意思。'} timestamp="2 分钟前"
          actions={<YButton label={reply ? '收起回复' : '展开回复'} variant="ghost" size="sm" onPress={() => setReply(!reply)} />}
          replies={reply ? <YCommentRow name="海风" message="下集还有新的分支。" /> : undefined} />
        {comment.map((message, index) => <YCommentRow key={index} name="我" message={message} timestamp="刚刚" />)}
    </YSheet>
  </View>;
}

const styles = StyleSheet.create({
  rewardArtwork: { position: 'relative', height: 108, width: 128 },
  rewardAccent: { position: 'absolute', left: 12, top: 0, width: 66, height: 55, transform: [{ rotate: '-22deg' }] },
  rewardTreats: { position: 'absolute', bottom: -9, width: 128, height: 95 },
  rewardAmount: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  rewardValue: { fontSize: 28, lineHeight: 36, fontFamily: 'GeologicaSemiBold', fontWeight: '600', fontVariant: ['tabular-nums'] },
});
