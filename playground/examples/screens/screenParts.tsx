import { useContext, useEffect, useState, type ComponentType } from 'react';
import {
  IconFavorite, IconFavoriteFilled, IconTreatsFilled,
} from '@yoroll/rn-icon';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  CarouselIndicatorDot, TreatText, YAvatar, YBadge, YBalanceCard, YBanner, YButton, YCallPanel, YCheckInCard, YChoiceGroup,
  YComposer, YCreditPackCard, YDetailHeader, YDialog, YEpisodeGrid, YField, YFilterChip, YIconButton,
  YInboxRow, YListGroup, YListRow, YMediaCard, YMessageBubble, YPersonaCard, YPlanCard, YPlayerControls, YPlayPill,
  YProfileHeader, YSearchField, YSectionHeader, YSlider, YState, YStoryChoices, YStoryEnding, YSwitch, YTab,
  YTaskRow, YTextInput, YUploadGrid, YVoiceCard,
  YWebCapsule, profileAccountStyles, useTheme, type YMediaCardVariant, type YTabVariant,
} from '@yoroll/app-components';
import { CommentsPart, ConfirmPart, FullscreenPart, ModelPart, NoticeDialogPart, SharePart, SheetPart } from './screenOverlays';
import { sectionContext, useScreenArtwork } from './sectionContext';
import type { ScreenPart, ScreenPartKind } from './screenModel';

type PartProps = { part: ScreenPart };
const names = ['雾岛来信', '月光旅人', '星砂纪事'];
const covers = ['coast', 'forest', 'night'] as const;

function Actions({ part }: PartProps) {
  const { announce } = useContext(sectionContext);
  return <View style={styles.group} accessibilityLabel={part.label}>
    {(part.items ?? [part.label]).map((label, index) => <YButton key={label} label={label} fullWidth
      variant={index === 0 ? 'primary' : index === 1 ? 'outline' : 'ghost'} onPress={() => announce('已选择' + label)} />)}
  </View>;
}

function Banner({ part }: PartProps) {
  const { announce } = useContext(sectionContext);
  const [clicked, setClicked] = useState(false);
  const artwork = useScreenArtwork();
  const variant = part.variant === 'warning' ? 'warning' : part.variant === 'reward' ? 'reward' : 'info';
  const actionLabel = part.items?.[0];
  return <YBanner title={part.label} detail={part.detail} variant={variant}
    artwork={variant === 'reward' ? <Image source={artwork('checkin')} style={StyleSheet.absoluteFill} contentFit="contain" /> : undefined}
    reward={variant === 'reward' && part.label.includes('签到') ? <TreatText style={{ fontSize: 14, fontWeight: '700' }}>+10</TreatText> : undefined}
    action={actionLabel ? { label: clicked ? '已完成' : actionLabel, disabled: clicked, onPress: () => { setClicked(true); announce('已选择' + actionLabel); } } : undefined} />;
}

function Balance({ part }: PartProps) {
  const artwork = useScreenArtwork();
  return <YBalanceCard title={part.label} amount={part.items?.[0] ?? '1,280'} detail={part.detail} candy={artwork('treat')} />;
}

function Account({ part }: PartProps) {
  const artwork = useScreenArtwork();
  const { announce } = useContext(sectionContext);
  const { tokens, fonts } = useTheme();
  const s = profileAccountStyles;
  const bg = { backgroundColor: 'rgba(255,255,255,0.07)' };
  return <View style={s.accountCards}>
    <Pressable accessibilityRole="button" style={[s.accountCard, bg]} onPress={() => announce('打开会员权益')}>
      <View style={[s.accountCardContent, s.membershipCardContent]}>
        <Text style={[s.accountCardLabel, { color: tokens.textTertiary }]}>会员权益</Text>
        <TreatText style={{ fontFamily: fonts.bebas, fontSize: 24, lineHeight: 25 }}>PLUS</TreatText>
      </View>
      <Image source={artwork('membershipCrown')} contentFit="contain" style={s.membershipCrown} />
    </Pressable>
    <View style={s.accountCardRow}>
      {(part.items ?? ['Treats 余额', '任务中心']).map((label, index) =>
        <Pressable accessibilityRole="button" key={label} style={[s.accountCard, styles.column, bg]} onPress={() => announce(label)}>
          <View style={s.accountCardContent}>
            <Text style={[s.accountCardLabel, { color: tokens.textTertiary }]}>{label}</Text>
            <View style={s.accountCardPrimaryRow}>{index
              ? <Text style={{ color: tokens.textSecondary, fontSize: 13, fontWeight: '600' }}>每日奖励</Text>
              : <TreatText style={{ fontSize: 20, fontFamily: fonts.geologicaSemibold }}>1,280</TreatText>}</View>
          </View>
          <Image source={artwork(index ? 'checkin' : 'treatPile')} contentFit="contain" style={s.creditToken} />
        </Pressable>)}
    </View>
  </View>;
}

function Cards({ part }: PartProps) {
  const artwork = useScreenArtwork();
  const { announce, tab } = useContext(sectionContext);
  const variant = (part.variant ?? 'profile') as YMediaCardVariant;
  const labels = part.items ?? names.slice(0, 2);
  const home = variant === 'home-feed';
  const stacked = variant === 'channel' || home;
  const images = home ? ['occult', 'royalty'] as const : variant === 'discover' || variant === 'character' || variant === 'chat'
    ? ['night', 'storyteller', 'avatar'] as const : covers;
  return <View style={stacked ? styles.group : styles.columns}>
    {labels.map((title, index) => <YMediaCard title={title} key={title} variant={variant} size="sm" cover={artwork(images[index % images.length])}
      subtitle={part.detail} badge={home && tab === '0' ? <YBadge label={index ? '互动游戏' : '互动短剧'} variant="media" /> :
        !home && index === 0 ? <YBadge label={variant === 'discover' ? '12.8K' : part.label} variant="media" /> : undefined}
      tags={variant === 'discover' ? ['奇幻', '剧情'] : undefined} style={stacked ? undefined : styles.column}
      coverAction={home ? <YPlayPill label="游玩" onPress={() => announce('已选择' + title)} /> : undefined}
      onPress={() => announce('已打开' + title)} />)}
  </View>;
}

function Checkin({ part }: PartProps) {
  const [claimed, setClaimed] = useState(false);
  const amounts = part.items ?? ['+10', '+20', '+30', '+40', '+50', '+60', '+70'];
  return <YCheckInCard title={part.label} detail={part.detail} reward={amounts[2]} status={claimed ? 'complete' : 'claimable'}
    actionLabel={claimed ? '已领取' : '签到'} onAction={() => setClaimed(true)}
    days={amounts.map((amount, index) => ({ id: String(index), amount, label: index === 2 ? '今天' : String(index + 1) + ' 日',
      status: index < 2 || index === 2 && claimed ? 'claimed' : index === 2 ? 'today' : 'upcoming' }))} />;
}

function Call({ part }: PartProps) {
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [phase, setPhase] = useState<'connecting' | 'connected' | 'failed'>('connected');
  const artwork = useScreenArtwork();
  return <View style={styles.group}>
    <YCallPanel name={part.items?.[0] ?? '月光旅人'} status={phase === 'connected' ? '00:24' : phase === 'connecting' ? '正在连接' : '通话已结束'}
      phase={phase} cover={artwork('night')} muted={muted} speaker={speaker}
      labels={{ mic: muted ? '开启麦克风' : '静音', speaker: speaker ? '停用扬声器' : '扬声器', hangup: phase === 'failed' ? '重新预览' : '挂断' }}
      onMute={() => setMuted(!muted)} onSpeaker={() => setSpeaker(!speaker)}
      onHangup={() => setPhase(phase === 'failed' ? 'connected' : 'failed')} />
    {part.variant === 'debug' && <YTab active={phase} onChange={(key) => setPhase(key as typeof phase)} variant="segment"
      items={[{ key: 'connecting', label: '连接中' }, { key: 'connected', label: '通话中' }, { key: 'failed', label: '结束' }]} />}
  </View>;
}

function Detail({ part }: PartProps) {
  const [favorite, setFavorite] = useState(false);
  const artwork = useScreenArtwork();
  return <YDetailHeader variant={part.variant === 'poster' ? 'poster' : 'landscape'} title={part.items?.[0] ?? part.label}
    subtitle={part.items?.[1]} detail={part.detail} cover={artwork(part.variant === 'poster' ? 'night' : 'coast')}
    tags={<YBadge label={part.label} />}
    actions={<YIconButton icon={favorite ? IconFavoriteFilled : IconFavorite} label={favorite ? '取消收藏' : '收藏'} onPress={() => setFavorite(!favorite)}
      variant="media" selected={favorite} />} />;
}

function Episodes({ part }: PartProps) {
  const [episode, setEpisode] = useState('0');
  const [locked, setLocked] = useState(false);
  const items = part.items ?? ['01', '02', '03', '04'];
  return <View style={styles.group}>
    <YSectionHeader title={part.label} size="compact" />
    <YEpisodeGrid active={episode} onSelect={setEpisode} onLocked={() => setLocked(true)}
      episodes={items.map((label, index) => ({ id: String(index), label, locked: index >= 2, lockLabel: index >= 2 ? '未解锁' : undefined }))} />
    <YDialog visible={locked} variant="notice" title="解锁剧集" description="会员剧集可以在会员页查看。"
      closeLabel="关闭解锁提示" onClose={() => setLocked(false)} primary={{ label: '返回', onPress: () => setLocked(false) }} />
  </View>;
}

function Fields({ part }: PartProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  return <View style={styles.group}>
    {(part.items ?? [part.label]).map((label) => {
      const password = label.includes('密码');
      const multiline = /介绍|简介|描述|理由|反馈/.test(label);
      const limit = multiline ? 120 : undefined;
      const value = values[label] ?? '';
      return <YField key={label} label={label} required={part.variant === 'required'}
        counter={limit ? value.length + '/' + limit : undefined} detail={part.detail}>
        <YTextInput accessibilityLabel={label} value={value} placeholder={'输入' + label} autoCapitalize="none"
          password={password} showPasswordLabel="显示密码" hidePasswordLabel="隐藏密码"
          multiline={multiline} maxLength={limit} onChangeText={(text) => setValues((previous) => ({ ...previous, [label]: text }))} />
      </YField>;
    })}
  </View>;
}

function Host({ part }: PartProps) {
  const [state, setState] = useState<'ready' | 'loading' | 'error' | 'empty'>(part.variant === 'debug' ? 'loading' : 'ready');
  const { tokens } = useTheme();
  const { announce } = useContext(sectionContext);
  return <View style={[styles.host, { backgroundColor: tokens.bgSecondary }]}>
    {part.variant === 'capsule' && <View style={styles.capsule}>
      <YWebCapsule moreLabel="更多" closeLabel="关闭宿主" onMore={() => announce('打开宿主菜单')} onClose={() => setState('empty')} />
    </View>}
    {state === 'ready' ? <YSectionHeader title={part.label} subtitle={part.detail ?? 'App 内容容器'} /> :
      <YState state={state} title={state === 'loading' ? '等待宿主加载' : state === 'empty' ? '容器已关闭' : '加载失败'}
        loadingLayout="spinner" action={{ label: '重新打开', onPress: () => setState('ready') }} />}
    <YButton size="sm" variant="secondary" label={state === 'ready' ? '查看加载状态' : '显示宿主'} onPress={() => setState(state === 'ready' ? 'loading' : 'ready')} />
  </View>;
}

function Identity({ part }: PartProps) {
  const [followed, setFollowed] = useState(false);
  const artwork = useScreenArtwork();
  return <YProfileHeader name={part.items?.[0] ?? '月光旅人'} subtitle={part.items?.[1]} bio={part.detail}
    cover={artwork('basic')} avatar={artwork('avatar')}
    badge={part.variant === 'author' ? <YBadge label={part.label} variant="brand" /> : undefined}
    stats={[{ id: 'following', label: '关注', value: '12' }, { id: 'followers', label: '粉丝', value: '1,284' }]}
    action={part.variant === 'author' ? <YButton size="sm" variant={followed ? 'secondary' : 'primary'}
      label={followed ? '已关注' : '关注'} onPress={() => setFollowed(!followed)} /> : undefined} />;
}

function Inbox({ part }: PartProps) {
  const [opened, setOpened] = useState<string[]>([]);
  const { tab, announce } = useContext(sectionContext);
  const showSystem = part.variant === 'system' || part.variant === 'mixed' && tab === '1';
  const people = showSystem ? ['系统消息', '活动通知'] : part.items ?? ['月光旅人', '海风'];
  return <View>
    {people.map((title, index) => <YInboxRow key={title} title={title}
      preview={showSystem ? index ? '有新的互动活动' : '你有一条新通知' : part.detail ?? '上一次的故事还没讲完。'}
      timestamp={index ? '昨天' : '刚刚'} unread={!opened.includes(title) && index === 0} unreadLabel="未读"
      onPress={() => { setOpened((previous) => previous.includes(title) ? previous : [...previous, title]); announce('已读 · ' + title); }} />)}
  </View>;
}

function Media({ part }: PartProps) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const artwork = useScreenArtwork();
  const labels = part.items ?? names;
  const images = part.variant === 'banner' ? ['royalty','occult','night'] as const : ['avatar','storyteller','night'] as const;
  if (part.variant === 'login') return <View style={styles.group}>
    <View style={styles.columns}>
      <YMediaCard variant="profile" title="雾岛来信" cover={artwork('coast')} style={styles.column} />
      <YMediaCard variant="profile" title="星砂纪事" cover={artwork('night')} style={styles.column} />
    </View>
    <YSectionHeader title={labels[0] ?? 'Yoroll'} subtitle={part.detail} />
  </View>;
  return <View style={styles.group}>
    <YMediaCard variant={part.variant === 'drama' ? 'drama' : 'banner'} cover={artwork(images[selected % images.length])}
      title={labels[selected] ?? part.label} subtitle={part.detail} onPress={() => setPlaying(!playing)}
      coverAction={<YPlayPill label={playing ? '暂停预览' : '游玩'} hideIcon={playing} onPress={() => setPlaying(!playing)} />} />
    <View style={styles.hRow}>
      <View style={styles.hRow}>{labels.map((label, index) => <YIconButton key={label} size={32}
        label={'切换到' + label} icon={() => <CarouselIndicatorDot active={selected === index} />}
        onPress={() => { setSelected(index); setPlaying(false); }} />)}</View>
    </View>
  </View>;
}

function Messages({ part }: PartProps) {
  const { announce } = useContext(sectionContext);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  return <View style={styles.group}>
    <YMessageBubble variant="narration" text={part.detail ?? '雾气漫过了码头。'} />
    <YMessageBubble text={part.items?.[0] ?? '你也在等那班船吗？'} leading={<YAvatar name="月光旅人" size={28} />} />
    {messages.map((text, index) => <YMessageBubble key={index} variant="user" text={text} />)}
    <YComposer value={draft} onChangeText={setDraft} placeholder="输入消息" sendLabel="发送" voiceLabel="语音"
      onVoice={() => announce('已切换语音入口')}
      onSend={(text) => { setMessages((previous) => [...previous, text]); setDraft(''); }} />
  </View>;
}

function Packs({ part }: PartProps) {
  const { announce } = useContext(sectionContext);
  const artwork = useScreenArtwork();
  const tones = ['newUser', 'firstChargeOffer', 'starter', 'firstChargeOffer', 'everydayTopUp', 'chatMore'] as const;
  const badges = ['新人专享', '首充加赠', '入门', '首充加赠', '日常补给', '畅聊'];
  const amounts = part.items ?? ['80', '180', '330', '730', '1,120', '4,500'];
  return <View style={styles.columns}>{amounts.map((amount, index) => <View key={amount} style={styles.column}>
    <YCreditPackCard amount={amount} price={['¥6', '¥12', '¥18', '¥30', '¥68', '¥198'][index % 6]}
      bonus={index === 1 ? '含 10 Treats 加赠' : index === 3 ? '含 60 Treats 加赠' : undefined}
      badge={badges[index % 6]} badgeTone={tones[index % 6]}
      artworkSource={artwork(index < 2 ? 'treat' : index < 4 ? 'treatPile' : 'treatLarge')}
      onPurchase={() => announce('已选择 ' + amount + ' Treats')} />
  </View>)}</View>;
}

function Personas({ part }: PartProps) {
  const [active, setActive] = useState(0);
  const { announce } = useContext(sectionContext);
  const artwork = useScreenArtwork();
  const owned = part.variant === 'owned';
  return <View style={styles.columns}>{(part.items ?? ['月光旅人', '海岸来客']).map((title, index) => <View key={title} style={styles.column}>
    <YPersonaCard title={title} cover={artwork(covers[index % covers.length])} variant={owned ? 'owned' : 'persona'}
      label={owned ? index ? '审核中' : '草稿' : active === index ? '默认人设' : undefined}
      status={owned ? index ? 'review' : 'draft' : active === index ? 'default' : undefined}
      detail={!owned ? part.detail ?? '把旅行中听到的故事写进信里。' : undefined} onPress={() => announce('已打开' + title)}
      actions={<YButton size="sm" variant="ghost" label={owned ? '编辑' : '设为默认'} disabled={!owned && active === index}
        onPress={() => owned ? announce('编辑' + title) : setActive(index)} />} />
  </View>)}</View>;
}

export function Plans({ part }: PartProps) {
  const { tier, setTier } = useContext(sectionContext);
  const artwork = useScreenArtwork();
  const [annual, setAnnual] = useState(true);
  if (part.variant === 'cycle') return <View style={styles.columns} accessibilityRole="radiogroup" accessibilityLabel={part.label}>
    <YPlanCard title="按年订阅" variant="cycle" tier={tier} selected={annual} onSelect={() => setAnnual(true)} style={styles.column}
      price={tier === 'plus' ? '¥418' : '¥298'} referencePrice={tier === 'plus' ? '¥698' : undefined}
      offer={tier === 'plus' ? { label: '限时折扣', countdown: '02:18:36' } : undefined} />
    <YPlanCard title="按月订阅" variant="cycle" tier={tier} selected={!annual} onSelect={() => setAnnual(false)}
      style={styles.column} price={tier === 'plus' ? '¥68' : '¥48'} />
  </View>;

  const benefits = [
    ['每月 Treats', 'creditBenefit', '1,000', '3,600'],
    ['建议回复', 'suggestionsBenefit', '100 次', '不限'],
    ['可创建人设数', 'personaBenefit', '5 个', '不限'],
    ['语音通话', 'callingBenefit', '高级会员专享', '8 / 分钟'],
    ['下载视频', 'videoBenefit', '高级会员专享', '无水印'],
    ['下载图片', 'imageBenefit', '无水印', '无水印'],
  ] as const;
  return <View style={styles.columns} accessibilityRole="radiogroup" accessibilityLabel={part.label}>
    {(['basic', 'plus'] as const).map((option) => <YPlanCard key={option} title={option === 'basic' ? 'PLUS' : 'ULTRA'}
      tier={option} selected={tier === option} onSelect={() => setTier(option)} style={styles.column}
      benefits={benefits.map(([label, image, basic, plus]) => ({ label, value: option === 'basic' ? basic : plus, artwork: artwork(image) }))}
      current={option === 'basic' ? '当前方案' : undefined} />)}
  </View>;
}

function Player({ part }: PartProps) {
  const [time, setTime] = useState(28);
  const [playing, setPlaying] = useState(false);
  const [wide, setWide] = useState(false);
  const { announce } = useContext(sectionContext);
  const artwork = useScreenArtwork();
  const drama = part.variant === 'drama';
  const [liked, setLiked] = useState(false);
  const controls = <YPlayerControls playing={playing} onToggle={() => setPlaying(!playing)} seconds={time} duration={120} onSeek={setTime}
    labels={{ play: '播放', pause: '暂停', seek: '播放进度', fullscreen: wide ? '退出横屏' : '全屏' }} overlay={drama}
    onFullscreen={() => { setWide(!wide); announce(wide ? '退出横屏' : '切换播放画幅'); }} />;
  if (!drama) return <View style={styles.group}>
    <YMediaCard title={part.label} cover={artwork('night')} variant="game" size="sm"
      subtitle={playing ? '播放中' : '已暂停'} onPress={() => setPlaying(!playing)} />
    {controls}
  </View>;

  return <View style={[styles.drama, { aspectRatio: wide ? 16 / 9 : 9 / 16 }]}>
    <Image source={artwork('night')} contentFit="cover" contentPosition="top" style={StyleSheet.absoluteFill} />
    <View style={styles.dramaRail}>
      <YIconButton icon={liked ? IconFavoriteFilled : IconFavorite} onPress={() => setLiked(!liked)}
        label={liked ? '取消收藏' : '收藏'} variant="media" selected={liked} />
    </View>
    <View style={styles.dramaFooter}>
      <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginHorizontal: 12, marginBottom: 6 }}>星砂纪事 · 第 1 集</Text>
      {controls}
    </View>
  </View>;
}

function Choices({ part }: PartProps) {
  const choices = (part.items ?? ['走进车站', '留在海边']).map((label, index) => ({ key: String(index), label }));
  const [selected, setSelected] = useState('');
  const [remaining, setRemaining] = useState(8);
  const [running, setRunning] = useState(false);
  const finished = Boolean(selected) || remaining <= 0;
  useEffect(() => {
    if (!running || finished) return;
    const timer = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [running, finished]);
  return <View style={styles.group}>
    <YStoryChoices title={part.label} choices={choices} selected={selected} onSelect={setSelected} disabled={finished}
      timer={{ remaining, total: 8, label: remaining + ' 秒' }} />
    <YButton size="sm" variant="ghost" label={running || finished ? '重新选择' : '启动倒计时'} onPress={() => {
      setSelected(''); setRemaining(8); setRunning(true);
    }} />
  </View>;
}

function Ending({ part }: PartProps) {
  const [variant, setVariant] = useState<'chapter' | 'game' | 'death'>('chapter');
  const [episode, setEpisode] = useState(1);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const artwork = useScreenArtwork();
  return <View style={styles.group}>
    <YTab variant="segment" active={variant} onChange={(key) => { setVariant(key as typeof variant); setShowEpisodes(false); }}
      items={[{ key: 'chapter', label: '本集结束' }, { key: 'game', label: '故事结束' }, { key: 'death', label: '失败结局' }]} />
    <YStoryEnding variant={variant} title={variant === 'chapter' ? '第 ' + episode + ' 集' : variant === 'game' ? '故事结束' : '探索失败'}
      emphasis="播放完成" detail={part.detail}
      artwork={<Image source={artwork('night')} contentFit="cover" style={StyleSheet.absoluteFill} />}
      next={{ label: '下一集', onPress: () => { setEpisode(episode + 1); setShowEpisodes(false); } }}
      episodes={{ label: '选集', onPress: () => setShowEpisodes(!showEpisodes) }} />
    {showEpisodes && <YEpisodeGrid episodes={[1, 2, 3].map((index) => ({ id: String(index), label: '第 ' + index + ' 集' }))}
      active={String(episode)} onSelect={(value) => { setEpisode(Number(value)); setShowEpisodes(false); }} />}
  </View>;
}

function Voices({ part }: PartProps) {
  const labels = part.items ?? ['清朗', '低沉'];
  const [active, setActive] = useState(labels[0]);
  const [playing, setPlaying] = useState('');
  return <View style={styles.group}>
    <YSectionHeader title={part.label} size="compact" subtitle={part.detail} />
    <View style={styles.columns} accessibilityRole="radiogroup">
      {labels.map((name) => <YVoiceCard key={name} name={name} style={styles.column} selected={active === name}
        onSelect={() => setActive(name)} playing={playing === name}
        previewLabel={(playing === name ? '停止试听 · ' : '试听 · ') + name}
        onPreview={() => setPlaying(playing === name ? '' : name)} />)}
    </View>
  </View>;
}

function Rows({ part }: PartProps) {
  const [unfollowed, setUnfollowed] = useState<string[]>([]);
  const { announce } = useContext(sectionContext);
  const follow = part.variant === 'follow';
  const history = part.variant === 'history';
  return <YListGroup title={part.label}>
    {(part.items ?? names).map((title, index) => <YListRow key={title} title={title} detail={part.detail} divider
      leading={follow ? <YAvatar name={title} size={40} /> : history ? <IconTreatsFilled size={20} color="#FF9CD5" /> : undefined}
      value={history ? index === 0 ? '+30' : '−8' : undefined}
      variant={title.includes('注销') ? 'danger' : 'default'}
      trailing={follow ? <YButton size="sm" variant="secondary" label={unfollowed.includes(title) ? '关注' : '已关注'}
        onPress={() => setUnfollowed((previous) => previous.includes(title) ? previous.filter((name) => name !== title) : [...previous, title])} /> : undefined}
      onPress={follow || history ? undefined : () => announce('已选择' + title)} />)}
  </YListGroup>;
}

function Search({ part }: PartProps) {
  const [query, setQuery] = useState('');
  const labels = part.items ?? names;
  const filtered = labels.filter((item) => item.toLowerCase().includes(query.trim().toLowerCase()));
  return <View style={styles.group}>
    <YSearchField value={query} onChangeText={setQuery} label={part.label} clearLabel="清空搜索" variant={part.variant === 'entry' ? 'entry' : 'input'} />
    {part.variant === 'entry' ? null : filtered.length
      ? <Cards part={{ kind: 'cards', label: '结果', items: filtered, detail: part.detail, variant: 'channel' }} />
      : <YState state="empty" title="没有匹配的内容" />}
  </View>;
}

function Selection({ part }: PartProps) {
  const [selected, setSelected] = useState('0');
  return <YChoiceGroup label={part.label} value={selected} onChange={setSelected}
    items={(part.items ?? ['默认', '自定义']).map((label, index) => ({ key: String(index), label }))} />;
}

function Slider({ part }: PartProps) {
  const [value, setValue] = useState(15);
  return <YSlider label={part.label} min={13} max={22} value={value} onChange={setValue} />;
}

function Tabs({ part }: PartProps) {
  const [active, setActive] = useState('0');
  const { announce, setTab, uiBase } = useContext(sectionContext);
  const illustrations = ['recommend', 'drama', 'filmgame', 'minigame'];
  const items = (part.items ?? ['全部', '最新']).map((label, index) => ({
    key: String(index), label,
    icon: part.variant === 'pill' && illustrations[index] ? <Image source={uiBase + 'home/' + illustrations[index] + '.webp'}
      style={{ width: 18, height: 18, opacity: String(index) === active ? 1 : 0.6 }} contentFit="contain" /> : undefined,
  }));
  return <YTab active={active} textLayout={part.detail === 'content' ? 'content' : 'equal'} onChange={(key) => { setActive(key); setTab(key); announce('已切换' + items[Number(key)].label); }}
    variant={(part.variant ?? 'text') as YTabVariant} items={items} />;
}

function Tags({ part }: PartProps) {
  const [selected, setSelected] = useState<string[]>([]);
  return <View style={styles.tags}>{(part.items ?? ['奇幻', '剧情', '悬疑']).map((label) => <YFilterChip key={label} label={label} variant="filter"
    selected={selected.includes(label)} onPress={() => setSelected(selected.includes(label) ? selected.filter((item) => item !== label) : [...selected, label])} />)}</View>;
}

function Tasks({ part }: PartProps) {
  const [done, setDone] = useState<string[]>([]);
  return <YListGroup title={part.label}>{(part.items ?? ['完成三次对话', '体验互动短剧']).map((title, index) => <YTaskRow key={title}
    title={title} detail={part.detail} reward={index ? '+50' : '+20'} status={done.includes(title) ? 'complete' : 'claimable'}
    actionLabel={done.includes(title) ? '已领取' : '领取'} onAction={() => setDone((previous) => [...previous, title])} />)}</YListGroup>;
}

function Toggles({ part }: PartProps) {
  const [active, setActive] = useState<string[]>([]);
  return <YListGroup title={part.label}>{(part.items ?? ['接收提醒']).map((title) => <YListRow key={title} title={title} divider
    trailing={<YSwitch label={title} value={active.includes(title)} onChange={(enabled) =>
      setActive(enabled ? [...active, title] : active.filter((item) => item !== title))} />} />)}</YListGroup>;
}

function Uploads({ part }: PartProps) {
  const [attached, setAttached] = useState(false);
  const artwork = useScreenArtwork();
  const { announce } = useContext(sectionContext);
  return <View style={styles.group}>
    <YSectionHeader title={part.label} size="compact" subtitle={part.detail} />
    <YUploadGrid items={attached ? [{ id: 'img', uri: artwork('coast'), label: '封面' }] : []}
      addLabel="添加示例图片" removeLabel={() => '移除示例图片'} onAdd={() => setAttached(true)}
      onRemove={() => setAttached(false)} onPreview={() => announce('已打开图片预览')} limit={1} />
  </View>;
}

function Section({ part }: PartProps) {
  return <YSectionHeader title={part.label} subtitle={part.detail} />;
}

export const partRenderers: Record<ScreenPartKind, ComponentType<PartProps>> = {
  actions: Actions, account: Account, banner: Banner, balance: Balance, call: Call, cards: Cards, checkin: Checkin,
  comments: CommentsPart, confirm: ConfirmPart, choices: Choices, ending: Ending, detail: Detail, dialog: NoticeDialogPart, episodes: Episodes,
  fields: Fields, fullscreen: FullscreenPart, host: Host, identity: Identity, inbox: Inbox, media: Media,
  messages: Messages, model: ModelPart, notice: Banner, packs: Packs, personas: Personas, plans: Plans, player: Player,
  rows: Rows, search: Search, section: Section, selection: Selection, share: SharePart, sheet: SheetPart,
  slider: Slider, tabs: Tabs, tags: Tags, tasks: Tasks, toggles: Toggles, uploads: Uploads, voices: Voices,
};

const styles = StyleSheet.create({
  group: { gap: 8 },
  hRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  columns: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  column: { flexBasis: '38%', flexGrow: 1, flexShrink: 1, minWidth: 120 },
  drama: { position: 'relative', backgroundColor: '#0B0B0D', overflow: 'hidden' },
  dramaRail: { position: 'absolute', right: 12, bottom: 108 },
  dramaFooter: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  host: { minHeight: 140, borderRadius: 12, gap: 14, justifyContent: 'center', padding: 16 },
  capsule: { alignSelf: 'flex-end' },
});
