import type { ComponentType } from 'react';
import { examples } from 'catalog-examples';
import type { ThemeTokens } from '../src';
import { appDemos } from './appDemos';

export const categories = [
  { id: 'controls', label: '操作与输入' },
  { id: 'navigation', label: '导航' },
  { id: 'overlays', label: '弹窗与弹层' },
  { id: 'cards', label: '卡片与资料' },
  { id: 'lists', label: '列表与任务' },
  { id: 'communication', label: '对话与播放' },
  { id: 'feedback', label: '状态与反馈' },
  { id: 'display', label: '基础展示' },
] as const;

type Example = {
  title: string;
  code: string;
  Preview: ComponentType;
};

type Prop = [name: string, type: string, description: string];

export type ComponentDemo = {
  name: string;
  label: string;
  category: typeof categories[number]['id'];
  description: string;
  appPath?: string;
  colors?: (keyof ThemeTokens)[];
  examples: [Example, ...Example[]];
  props: Prop[];
};

export function catalogExample(path: string) {
  const result = examples[path];
  if (!result) throw new Error('Missing catalog example ' + path);
  return result;
}

function example(title: string, id: string): Example {
  return { title, ...catalogExample('components/' + id) };
}

const extracted: ComponentDemo[] = appDemos.map(({ example: id, exampleTitle, ...demo }) => ({
  ...demo, examples: [example(exampleTitle, id)],
}));

export const demos: ComponentDemo[] = [
  {
    name: 'YButton',
    colors: ['primary', 'bgCard', 'dark', 'textSecondary', 'cardStroke', 'bgPicked', 'orange4', 'orange'],
    label: '按钮',
    category: 'controls',
    description: '主操作、次操作、描边、文字、危险与品牌操作，包含五档尺寸以及加载、禁用状态。',
    examples: [
      example('常用样式', 'button-variants'),
      example('禁用与加载', 'button-states'),
      example('渐变', 'button-gradient'),
    ],
    props: [
      ['variant', 'primary | secondary | outline | ghost | danger | brand | orange', '按钮外观，默认 primary。'],
      ['size', 'sm | md | lg | xl | icon', '按钮尺寸，默认 md。'],
      ['disabled / loading', 'boolean', '两种状态都暂停点击。loading 显示进度指示器。'],
      ['backgroundGradient / labelGradient', 'YButtonGradient', '分别控制底色和文字渐变。'],
    ],
  },
  {
    name: 'YTextInput',
    colors: ['textPrimary', 'textSecondary', 'textTertiary', 'textWrong'],
    label: '输入框',
    category: 'controls',
    description: '提供焦点、密码显隐、辅助提示和字段错误反馈。',
    examples: [
      example('基础输入', 'text-input'),
      example('密码与错误提示', 'password-input'),
    ],
    props: [
      ['password', 'boolean', '显示密码显隐按钮。'],
      ['hint / error', 'string', '字段下方的说明或错误；error 优先显示。'],
      ['leftIcon / rightSlot', 'ReactNode', '输入框两侧的自定义内容。'],
      ['showPasswordLabel / hidePasswordLabel', 'string', '密码按钮的无障碍名称，用于本地化。'],
    ],
  },
  {
    name: 'YPlayPill',
    colors: ['dark'],
    label: '播放按钮',
    category: 'controls',
    description: '胶囊形播放入口，包含继续观看和即将上线状态。',
    examples: [
      example('播放与继续', 'play-pill'),
      example('即将上线', 'play-pill-soon'),
    ],
    props: [
      ['variant', 'light | brand', '白色外观或随主题变化的外观。'],
      ['mode', 'play | continue', '选择默认文案。'],
      ['label / comingSoonLabel', 'string', '自定义各状态文案。'],
      ['comingSoon', 'boolean', '隐藏播放图标并暂停点击。'],
    ],
  },
  {
    name: 'YTab',
    colors: ['bgPrimary', 'bgSecondary', 'bgTertiary', 'cardStroke', 'textPrimary', 'textTertiary'],
    label: '页签',
    category: 'navigation',
    description: '支持列表分段、内容下划线、文字导航和首页频道胶囊，由调用方管理选中项。',
    examples: [
      example('分段', 'tabs-segment'),
      example('下划线', 'tabs-underline'),
      example('文字', 'tabs-text'),
      example('首页频道', 'tabs-pill'),
    ],
    props: [
      ['items', 'YTabItem[]', '每个选项需要稳定的 key 和展示 label。'],
      ['active / onChange', 'string / (key: string) => void', '当前选中 key 与切换回调。'],
      ['variant', 'underline | segment | text | pill', '外观样式，默认 underline。'],
      ['textLayout', 'equal | content', '文字样式的等分或内容宽度布局。'],
    ],
  },
  {
    name: 'YTopBar',
    colors: ['bgPrimary', 'textPrimary'],
    label: '顶部导航栏',
    category: 'navigation',
    description: '包含安全区、居中标题、返回按钮和可定制的两侧操作。',
    examples: [
      example('标题与操作', 'top-bar'),
    ],
    props: [
      ['title / titleSlot', 'string / ReactNode', '标题文本或自定义标题内容。'],
      ['onBack / backLabel', '() => void / string', '返回动作和对应的无障碍名称。'],
      ['leftSlot / rightSlot', 'ReactNode', '自定义两侧操作区。'],
    ],
  },
  {
    name: 'NavigationBarMaterial',
    colors: ['bgPrimary'],
    label: '导航栏底色',
    category: 'navigation',
    description: '把滚动位置映射为主题底色的透明度，适用于吸顶导航。',
    examples: [
      example('滚动淡入', 'navigation-material'),
    ],
    props: [
      ['scrollY', 'Animated.Value', '0 到 100 pt 映射到透明和完全不透明。'],
      ['testID', 'string', '用于定位背景层的测试标识。'],
    ],
  },
  {
    name: 'YAvatar',
    colors: ['orange', 'orange7', 'dark'],
    label: '头像',
    category: 'display',
    description: '图片与首字母头像，支持不同尺寸、渐变和描边。',
    examples: [
      example('尺寸与外观', 'avatars'),
    ],
    props: [
      ['src / name', 'string', '图片地址，或无图时提取首字母的名称。'],
      ['size', 'number', '头像直径，默认 40。'],
      ['color / gradientColors', 'string / [string, string, ...string[]]', '纯色或渐变背景。'],
      ['ring', 'string', '边框颜色。'],
    ],
  },
  {
    name: 'SkeletonBlock',
    appPath: 'src/components/SkeletonBlock.tsx',
    colors: ['bgSecondary'],
    label: '骨架占位',
    category: 'display',
    description: '可组合的加载占位块，多块占位共享同一呼吸动画。',
    examples: [
      example('列表占位', 'skeleton'),
    ],
    props: [
      ['style', 'StyleProp<ViewStyle>', '设置占位的尺寸和圆角。'],
      ['color', 'string', '覆盖主题默认的底色。'],
    ],
  },
  {
    name: 'CarouselIndicatorDot',
    appPath: 'src/components/CarouselIndicatorDot.tsx',
    label: '轮播指示点',
    category: 'navigation',
    description: '轮播页选中时过渡点宽度和透明度。',
    examples: [
      example('切换选中项', 'carousel'),
    ],
    props: [['active', 'boolean', '指示点的选中状态。']],
  },
  {
    name: 'TreatText',
    appPath: 'src/components/TreatText.tsx',
    colors: ['orange7', 'orange'],
    label: 'Treats 渐变金额',
    category: 'display',
    description: '统一粉橙渐变方向，原生使用文字测量与遮罩。',
    examples: [
      example('金额样式', 'treat-text'),
    ],
    props: [
      ['children', 'ReactNode', '要显示的金额或文本。'],
      ['gradientColors', 'LinearGradientProps["colors"]', '默认使用导出的 TREAT_TEXT_GRADIENT。'],
      ['androidRenderingMode', 'software | hardware', '原生 Android 遮罩渲染模式，默认 software。'],
    ],
  },
  ...extracted,
];
