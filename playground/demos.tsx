import { useRef, useState, type ComponentType } from 'react';
import { Animated } from 'react-native';
import { IconAdd, IconMoreHorizontal } from '@yoroll/rn-icon';
import {
  CarouselIndicatorDot,
  NavigationBarMaterial,
  SkeletonBlock,
  TreatText,
  YAvatar,
  YButton,
  YPlayPill,
  YTab,
  YTextInput,
  YTopBar,
  useTheme,
  type ThemeTokens,
  type YTabVariant,
} from '../src';

export const categories = [
  { id: 'controls', label: '操作与输入' },
  { id: 'navigation', label: '导航' },
  { id: 'display', label: '展示与反馈' },
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

function ButtonVariants() {
  const [action, setAction] = useState('');
  const { tokens } = useTheme();
  return (
    <div className="sample-stack">
      <div className="sample-row">
        <YButton label="确认" onPress={() => setAction('确认')} />
        <YButton label="取消" variant="outline" onPress={() => setAction('取消')} />
        <YButton
          label="添加"
          variant="brand"
          leftIcon={<IconAdd color={tokens.orange4} size={14} />}
          onPress={() => setAction('添加')}
        />
      </div>
      <output className="sample-status">{action && `已点击${action}`}</output>
    </div>
  );
}

function ButtonGradient() {
  const { tokens } = useTheme();
  const direction = { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } };
  const colors = [tokens.orange7, tokens.orange] as const;
  return (
    <div className="sample-row">
      <YButton label="渐变背景" backgroundGradient={{ colors, ...direction }} textStyle={{ color: tokens.dark }} />
      <YButton label="渐变文字" variant="outline" labelGradient={{ colors, ...direction }} />
    </div>
  );
}

function Tabs({ variant }: { variant: YTabVariant }) {
  const [active, setActive] = useState('feature');
  return (
    <div className="sample-field">
      <YTab
        variant={variant}
        items={[
          { key: 'feature', label: '推荐' },
          { key: 'following', label: '关注' },
          { key: 'saved', label: '收藏' },
        ]}
        active={active}
        onChange={setActive}
      />
    </div>
  );
}

function TopBarPreview() {
  const [action, setAction] = useState('');
  const { tokens } = useTheme();
  return (
    <div className="sample-stack sample-field">
      <div className="sample-topbar">
        <YTopBar
          title="个人资料"
          backLabel="返回"
          onBack={() => setAction('返回')}
          rightSlot={
            <YButton
              variant="ghost"
              size="icon"
              accessibilityLabel="更多选项"
              icon={<IconMoreHorizontal color={tokens.textPrimary} size={20} />}
              onPress={() => setAction('更多选项')}
            />
          }
        />
      </div>
      <output className="sample-status">{action && `已点击${action}`}</output>
    </div>
  );
}

function MaterialPreview() {
  const scrollY = useRef(new Animated.Value(64)).current;
  const [offset, setOffset] = useState(64);
  return (
    <div className="sample-stack sample-field">
      <div className="material-sample">
        <NavigationBarMaterial testID="navigation-material" scrollY={scrollY} />
        <span>导航栏</span>
      </div>
      <label className="slider">
        <span>滚动距离</span>
        <input
          type="range"
          min={0}
          max={100}
          value={offset}
          onChange={(event) => {
            const value = event.currentTarget.valueAsNumber;
            setOffset(value);
            scrollY.setValue(value);
          }}
        />
        <output>{offset} pt</output>
      </label>
    </div>
  );
}

function PlayButtons() {
  const [action, setAction] = useState('');
  return (
    <div className="sample-stack">
      <div className="sample-row">
        <YPlayPill label="播放" onPress={() => setAction('播放')} />
        <YPlayPill label="继续观看" mode="continue" variant="brand" onPress={() => setAction('继续观看')} />
      </div>
      <output className="sample-status">{action && `已点击${action}`}</output>
    </div>
  );
}

function CarouselPreview() {
  const [active, setActive] = useState(0);
  return (
    <div className="carousel-preview" role="group" aria-label="轮播指示点">
      {[0, 1, 2].map((index) => (
        <button key={index} type="button" aria-label={`预览第 ${index + 1} 页`}
          aria-pressed={active === index} onClick={() => setActive(index)}>
          <CarouselIndicatorDot active={active === index} />
        </button>
      ))}
    </div>
  );
}

export const demos: ComponentDemo[] = [
  {
    name: 'YButton',
    colors: ['primary', 'bgCard', 'dark', 'textSecondary', 'cardStroke', 'bgPicked', 'orange4', 'orange'],
    label: '按钮',
    category: 'controls',
    description: '带常用外观、尺寸、渐变和加载态的操作按钮。',
    examples: [
      {
        title: '常用样式',
        code: '<YButton label="确认" onPress={onConfirm} />\n<YButton label="取消" variant="outline" onPress={onCancel} />\n<YButton label="添加" variant="brand" onPress={onAdd} />',
        Preview: ButtonVariants,
      },
      {
        title: '禁用与加载',
        code: '<YButton label="无法继续" disabled />\n<YButton label="保存中" loading />',
        Preview: () => (
          <div className="sample-row">
            <YButton label="无法继续" disabled />
            <YButton label="保存中" accessibilityLabel="保存中" loading />
          </div>
        ),
      },
      {
        title: '渐变',
        code: '<YButton\n  label="渐变背景"\n  backgroundGradient={{\n    colors: ["#FF9CD5", "#FF8652"],\n    start: { x: 0, y: 0.5 },\n    end: { x: 1, y: 0.5 },\n  }}\n  textStyle={{ color: "#1C1E22" }}\n  onPress={onConfirm}\n/>',
        Preview: ButtonGradient,
      },
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
      {
        title: '基础输入',
        code: '<YTextInput\n  accessibilityLabel="邮箱"\n  placeholder="输入邮箱"\n  autoCapitalize="none"\n  keyboardType="email-address"\n  hint="用于接收通知"\n/>',
        Preview: () => (
          <div className="sample-field">
            <YTextInput accessibilityLabel="邮箱" placeholder="输入邮箱" autoCapitalize="none" keyboardType="email-address" hint="用于接收通知" />
          </div>
        ),
      },
      {
        title: '密码与错误提示',
        code: '<YTextInput\n  accessibilityLabel="密码"\n  placeholder="输入密码"\n  password\n  showPasswordLabel="显示密码"\n  hidePasswordLabel="隐藏密码"\n  error="请输入至少 8 个字符"\n/>',
        Preview: () => (
          <div className="sample-field">
            <YTextInput
              accessibilityLabel="密码"
              placeholder="输入密码"
              defaultValue="yoroll"
              password
              showPasswordLabel="显示密码"
              hidePasswordLabel="隐藏密码"
              error="请输入至少 8 个字符"
            />
          </div>
        ),
      },
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
      {
        title: '播放与继续',
        code: '<YPlayPill label="播放" onPress={onPlay} />\n<YPlayPill label="继续观看" mode="continue" variant="brand" onPress={onResume} />',
        Preview: PlayButtons,
      },
      {
        title: '即将上线',
        code: '<YPlayPill comingSoon comingSoonLabel="即将上线" />',
        Preview: () => <YPlayPill comingSoon comingSoonLabel="即将上线" />,
      },
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
    description: '由调用方管理选中项，支持分段、下划线及文字样式。',
    examples: [
      {
        title: '分段',
        code: 'const [active, setActive] = useState("feature");\nconst items = [{ key: "feature", label: "推荐" }, { key: "saved", label: "收藏" }];\n\n<YTab variant="segment" items={items} active={active} onChange={setActive} />',
        Preview: () => <Tabs variant="segment" />,
      },
      {
        title: '下划线',
        code: '<YTab variant="underline" items={items} active={active} onChange={setActive} />',
        Preview: () => <Tabs variant="underline" />,
      },
      {
        title: '文字',
        code: '<YTab variant="text" items={items} active={active} onChange={setActive} />',
        Preview: () => <Tabs variant="text" />,
      },
    ],
    props: [
      ['items', 'YTabItem[]', '每个选项需要稳定的 key 和展示 label。'],
      ['active / onChange', 'string / (key: string) => void', '当前选中 key 与切换回调。'],
      ['variant', 'underline | segment | text', '外观样式，默认 underline。'],
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
      {
        title: '标题与操作',
        code: '<YTopBar\n  title="个人资料"\n  backLabel="返回"\n  onBack={onBack}\n  rightSlot={<YButton label="编辑" variant="ghost" onPress={onEdit} />}\n/>',
        Preview: TopBarPreview,
      },
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
      {
        title: '滚动淡入',
        code: 'const scrollY = useRef(new Animated.Value(0)).current;\n\n<NavigationBarMaterial testID="top-bar-material" scrollY={scrollY} />',
        Preview: MaterialPreview,
      },
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
      {
        title: '尺寸与外观',
        code: '<YAvatar name="Yoroll" size={36} />\n<YAvatar name="Amy" size={48} color="#6551B5" />\n<YAvatar name="Remi" size={56} ring="#FF9CD5" gradientColors={["#BE9AFF", "#6551B5"]} />',
        Preview: () => (
          <div className="sample-row">
            <YAvatar name="Yoroll" size={36} />
            <YAvatar name="Amy" size={48} color="#6551B5" />
            <YAvatar name="Remi" size={56} ring="#FF9CD5" gradientColors={['#BE9AFF', '#6551B5']} />
          </div>
        ),
      },
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
      {
        title: '列表占位',
        code: '<SkeletonBlock style={{ width: 48, height: 48, borderRadius: 24 }} />\n<SkeletonBlock style={{ width: 128, height: 10, borderRadius: 5 }} />',
        Preview: () => (
          <div className="sample-row skeleton-sample">
            <SkeletonBlock style={{ width: 48, height: 48, borderRadius: 24 }} />
            <div className="sample-stack">
              <SkeletonBlock style={{ width: 128, height: 10, borderRadius: 5 }} />
              <SkeletonBlock style={{ width: 80, height: 8, borderRadius: 4 }} />
            </div>
          </div>
        ),
      },
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
    examples: [{ title: '切换选中项', code: '<CarouselIndicatorDot active={index === selectedIndex} />', Preview: CarouselPreview }],
    props: [['active', 'boolean', '指示点的选中状态。']],
  },
  {
    name: 'TreatText',
    appPath: 'src/components/TreatText.tsx',
    colors: ['orange7', 'orange'],
    label: 'Treats 渐变金额',
    category: 'display',
    description: '统一粉橙渐变方向，原生使用文字测量与遮罩。',
    examples: [{
      title: '金额样式',
      code: '<TreatText style={{ fontSize: 28, fontWeight: "700" }}>1,280 Treats</TreatText>',
      Preview: () => <TreatText style={{ fontSize: 28, fontWeight: '700' }}>1,280 Treats</TreatText>,
    }],
    props: [
      ['children', 'ReactNode', '要显示的金额或文本。'],
      ['gradientColors', 'LinearGradientProps["colors"]', '默认使用导出的 TREAT_TEXT_GRADIENT。'],
      ['androidRenderingMode', 'software | hardware', '原生 Android 遮罩渲染模式，默认 software。'],
    ],
  },
];
