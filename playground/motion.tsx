import { useState, type CSSProperties } from 'react';
import { motionTokens, sheetMetrics } from '../src';
import { CopyButton, DirectoryHeading, SourceLink } from './controls';

const curves = {
  outCubic: 'cubic-bezier(.215,.61,.355,1)',
  inCubic: 'cubic-bezier(.55,.055,.675,.19)',
  inOutCubic: 'cubic-bezier(.645,.045,.355,1)',
  inOutQuad: 'cubic-bezier(.455,.03,.515,.955)',
  ease: 'ease-in-out',
};

type Recipe = {
  name: string;
  token: keyof typeof motionTokens;
  path: string;
  rule: string;
  stage: 'sheet' | 'fade' | 'pulse' | 'width' | 'crossfade';
  steps: { label: string; ms: number; phase?: 'out'; curve: string; sourceCurve: string }[];
};

const recipes: Recipe[] = [
  {
    name: '共用底部弹层', token: 'bottomSheet', path: 'src/components/ChatBottomSheet.tsx', stage: 'sheet',
    rule: `面板位移驱动遮罩透明度。下拉超过 ${motionTokens.bottomSheet.dismissDistance} pt 或速度超过 ${motionTokens.bottomSheet.dismissVelocity} pt/ms 时关闭，未达到阈值则回弹。`,
    steps: [
      { label: '进入', ms: motionTokens.bottomSheet.enterMs, curve: curves.ease, sourceCurve: 'inOut(ease)' },
      { label: '退出', ms: motionTokens.bottomSheet.exitMs, phase: 'out', curve: curves.ease, sourceCurve: 'inOut(ease)' },
      { label: '回弹', ms: motionTokens.bottomSheet.snapBackMs, curve: curves.ease, sourceCurve: 'inOut(ease)' },
    ],
  },
  {
    name: '模型选择弹窗', token: 'modelPicker', path: 'src/screens/chat/useModelPickerMotion.ts', stage: 'sheet',
    rule: '原生 Modal 显示后启动入场。面板和遮罩共用 UI 线程进度，并由动画结束事件推进状态。',
    steps: [
      { label: '进入', ms: motionTokens.modelPicker.enterMs, curve: curves.outCubic, sourceCurve: 'out(cubic)' },
      { label: '退出', ms: motionTokens.modelPicker.exitMs, phase: 'out', curve: curves.inCubic, sourceCurve: 'in(cubic)' },
    ],
  },
  {
    name: '消息操作反馈', token: 'replyAction', path: 'src/screens/chat/ReplyActionButton.tsx', stage: 'fade',
    rule: `常态透明度 1，按压 ${motionTokens.replyAction.pressedOpacity}，弱化 ${motionTokens.replyAction.disabledOpacity}。移除时先淡出，剩余项随布局过渡。`,
    steps: [
      { label: '反馈', ms: motionTokens.replyAction.feedbackMs, curve: curves.inOutQuad, sourceCurve: 'inOut(quad)' },
      { label: '退出', ms: motionTokens.replyAction.exitMs, phase: 'out', curve: curves.outCubic, sourceCurve: 'out(cubic)' },
      { label: '重排', ms: motionTokens.replyAction.layoutMs, curve: curves.inOutCubic, sourceCurve: 'inOut(cubic)' },
    ],
  },
  {
    name: '轮播指示点', token: 'carouselDot', path: 'src/components/CarouselIndicatorDot.tsx', stage: 'width',
    rule: `选中时宽度 ${motionTokens.carouselDot.width} → ${motionTokens.carouselDot.activeWidth} pt，白色不透明度 0.5 → 0.8。`,
    steps: [{ label: '选中', ms: motionTokens.carouselDot.durationMs, curve: curves.outCubic, sourceCurve: 'out(cubic)' }],
  },
  {
    name: '骨架呼吸', token: 'skeleton', path: 'src/components/SkeletonBlock.tsx', stage: 'pulse',
    rule: `透明度在 ${motionTokens.skeleton.restOpacity} 和 1 之间交替。挂载的占位块共享同一个动画值，最后一个卸载时停止。`,
    steps: [{ label: '单次呼吸', ms: motionTokens.skeleton.halfCycleMs * 2, curve: curves.ease, sourceCurve: 'Animated 默认' }],
  },
  {
    name: '打字指示点', token: 'typingDots', path: 'src/screens/chat/TypingDots.tsx', stage: 'pulse',
    rule: `点的透明度从 ${motionTokens.typingDots.restOpacity} 到 1，几个点错峰往返。`,
    steps: [
      { label: '变亮', ms: motionTokens.typingDots.appearMs, curve: curves.ease, sourceCurve: 'Animated 默认' },
      { label: '恢复', ms: motionTokens.typingDots.fadeMs, phase: 'out', curve: curves.ease, sourceCurve: 'Animated 默认' },
    ],
  },
  {
    name: '签到弹窗', token: 'checkInDialog', path: 'src/components/DailyCheckinDialog.tsx', stage: 'fade',
    rule: '遮罩与弹窗主体一起过渡。启用减少动态效果时，入场和退场时长归零。',
    steps: [
      { label: '进入', ms: motionTokens.checkInDialog.enterMs, curve: curves.outCubic, sourceCurve: 'out(cubic)' },
      { label: '退出', ms: motionTokens.checkInDialog.exitMs, phase: 'out', curve: curves.inOutCubic, sourceCurve: 'inOut(cubic)' },
    ],
  },
  {
    name: '发现页筛选栏', token: 'discoveryHeader', path: 'src/screens/chat/discovery/CollapsibleDiscoveryHeader.tsx', stage: 'sheet',
    rule: '按滚动方向收放。动画过程中保持同一份筛选内容与列表留位，并遵循系统减少动态效果设置。',
    steps: [{ label: '展开', ms: motionTokens.discoveryHeader.durationMs, curve: curves.outCubic, sourceCurve: 'out(cubic)' }],
  },
  {
    name: '会员背景换档', token: 'membershipBackground', path: 'src/screens/membership/MembershipBackground.tsx', stage: 'crossfade',
    rule: '目标背景解码后开始过渡，插值所有图层权重。快速切换从当前混合状态继续。',
    steps: [{ label: '交叉渐变', ms: motionTokens.membershipBackground.durationMs, curve: curves.inOutCubic, sourceCurve: 'inOut(cubic)' }],
  },
  {
    name: '开屏淡出', token: 'splash', path: 'src/components/AppSplash.tsx', stage: 'fade',
    rule: '启动与门禁阶段共用开屏。准备就绪后淡出，完成时通知宿主。',
    steps: [{ label: '淡出', ms: motionTokens.splash.fadeMs, phase: 'out', curve: curves.ease, sourceCurve: 'Animated 默认' }],
  },
];

function MotionCard({ recipe }: { recipe: Recipe }) {
  const [playback, setPlayback] = useState<{ step: Recipe['steps'][number]; run: number }>();
  const active = playback?.step ?? recipe.steps[0];
  const style = {
    '--duration': `${active.ms}ms`,
    '--curve': active.curve,
    '--sheet-radius': `${recipe.token === 'modelPicker' ? sheetMetrics.modelPickerRadius : sheetMetrics.radius}px`,
  } as CSSProperties;
  return (
    <article className="reference-card motion-card">
      <div className="motion-stage" data-kind={recipe.stage} style={style}>
        <div key={playback?.run ?? 0} className="motion-shape" data-play={!!playback} data-phase={active.phase ?? 'in'}>
          <div /><div /><div />
        </div>
      </div>
      <div className="reference-body">
        <div className="reference-title"><h2>{recipe.name}</h2><SourceLink path={recipe.path} /></div>
        <p>{recipe.rule}</p>
        <div className="motion-steps">
          {recipe.steps.map((step) => (
            <button key={step.label} type="button" onClick={() => setPlayback((value) => ({ step, run: (value?.run ?? 0) + 1 }))}>
              <strong>{step.label}</strong><span>{step.ms} ms · {step.sourceCurve}</span>
            </button>
          ))}
        </div>
        <CopyButton code={`motionTokens.${recipe.token}`} label="复制引用" />
      </div>
    </article>
  );
}

export function MotionPage() {
  return (
    <>
      <DirectoryHeading title="动效">
        按 App 实现核对的时长、缓动和生命周期。点击每段时长可播放示意。
      </DirectoryHeading>
      <div className="rule-list">
        <div><strong>挂载与回调</strong><p>先挂载再进场，退出完成后卸载。打断时取消旧动画并忽略过期回调。</p></div>
        <div><strong>共享进度</strong><p>相关视觉属性共用动画值。导航底色由滚动 0–{motionTokens.navigationBackground.scrollDistance} pt 映射到透明度 0–1。</p></div>
        <div><strong>减少动态效果</strong><p>按 App 具体实现使用系统减少动态效果设置，网页演示也随系统设置缩短。</p></div>
      </div>
      <div className="motion-grid">{recipes.map((recipe) => <MotionCard key={recipe.token} recipe={recipe} />)}</div>
    </>
  );
}
