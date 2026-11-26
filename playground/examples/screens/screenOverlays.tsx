import { useContext, useState } from 'react';
import { IconCopy, IconShare, IconSharelink, IconTreatsFilled } from '@yoroll/rn-icon';
import { Image } from 'expo-image';
import { View } from 'react-native';
import {
  TreatText, YActionBar, YBadge, YButton, YChoiceGroup, YCommentRow, YComposer, YDialog,
  YFullscreenOverlay, YIconButton, YModelCard, YSheet, YTab, useTheme,
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
  const action = part.items?.[0] ?? (reward ? '领取' : '我知道了');
  return <View>
    <YButton label={part.label} variant="secondary" size="sm" onPress={() => setOpen(true)} />
    <YDialog visible={open} title={part.label} description={part.detail} variant={reward ? 'reward' : 'notice'}
      onClose={() => setOpen(false)} closeLabel="关闭公告"
      artwork={reward
        ? <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', minHeight: 62, gap: 6 }}>
          <IconTreatsFilled size={26} color="#FF9CD5" /><TreatText style={{ fontSize: 28 }}>{part.items?.[1] ?? '+30'}</TreatText>
        </View>
        : <Image source={asset(part.variant === 'paywall' ? 'gate' : 'event')} contentFit="cover" style={{ height: 120, width: '100%' }} />}
      primary={{ label: reward && claimed ? '已领取' : action, onPress: () => {
        setClaimed(true); setOpen(false); announce(reward ? '领取完成' : '已关闭公告');
      } }} />
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

export function ModelPart({ part }: { part: ScreenPart }) {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState('文字对话');
  const [category, setCategory] = useState('text');
  const audio = category === 'audio';
  return <View>
    <YButton label={part.label + ' · ' + model} variant="secondary" size="sm" onPress={() => setOpen(true)} />
    <YSheet visible={open} variant="model" title={part.label} subtitle="切换后应用于当前对话"
      closeLabel="关闭模型选择" onClose={() => setOpen(false)} maxWidth={500}>
        <View style={{ gap: 10 }} accessibilityRole="radiogroup">
          <YTab variant="segment" active={category} onChange={setCategory} items={[{ key: 'text', label: '文字' }, { key: 'audio', label: '语音' }]} />
          {(audio ? ['轻量语音', '沉浸语音'] : ['文字对话', '沉浸故事']).map((name, index) => <YModelCard key={name}
            title={name} description={index ? '适合沉浸式角色体验' : '适合日常对话'} price={index ? '8 / 轮' : '2 / 轮'}
            selected={model === name} onSelect={() => setModel(name)}
            referencePrice={index ? '12 / 轮' : undefined} countdown={index ? '02:18:36' : undefined}
            badge={index ? <YBadge label="限时价" variant="brand" /> : undefined} />)}
        </View>
    </YSheet>
  </View>;
}

export function SharePart({ part }: { part: ScreenPart }) {
  const [open, setOpen] = useState(false);
  const { announce } = useContext(sectionContext);
  const { tokens } = useTheme();
  const choose = (message: string) => { setOpen(false); announce(message); };
  return <View>
    <YIconButton icon={IconShare} label={part.label} onPress={() => setOpen(true)} variant="surface" color={tokens.textPrimary} />
    <YSheet visible={open} title={part.label} closeLabel="关闭分享" onClose={() => setOpen(false)} maxWidth={480}>
      <View style={{ flexDirection: 'row', gap: 12, paddingBottom: 8 }}>
        <YIconButton icon={IconCopy} iconSize={22} label="复制链接" variant="media" size={60} onPress={() => choose('已复制示例链接')} />
        <YIconButton icon={IconSharelink} iconSize={22} label="更多分享方式" variant="media" size={60} onPress={() => choose('已选择分享方式')} />
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
