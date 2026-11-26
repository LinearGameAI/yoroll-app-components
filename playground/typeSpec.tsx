import { useEffect, useId, useState } from 'react';
import {
  avatarInitialTypography, buttonLabelTypography, buttonMetrics, chatFontSize, chatMessageTypography,
  customFontNames, playPillLabelTypography, systemFonts, tabLabelTypography, typography, type ThemeTokens,
} from '../src';
import { CopyButton, SourceLink } from './controls';
import type { Inventory } from './inventoryData';

type Metrics = { fontSize: number; lineHeight?: number; fontWeight?: string; letterSpacing?: number };
type TypeRow = {
  label: string;
  reference: string;
  font?: string;
  metrics?: Metrics;
  colors?: (keyof ThemeTokens)[];
  detail?: string;
  source?: [path: string, line?: number];
};

const system = 'fonts.sans';
const mediumDisplay = 'fontWeights.dispMedium';

function role(
  key: keyof typeof typography, label: string, font: string | undefined, source: TypeRow['source'],
  colors?: TypeRow['colors'], detail?: string,
): TypeRow {
  return { label, reference: 'typography.' + key, metrics: typography[key], font, source, colors, detail };
}

const navigation = role('navigationTitle', '默认标题', mediumDisplay, ['src/components/primitives/YTopBar.tsx', 98], ['textPrimary']);
const input = role('inputText', '输入文字', system, ['src/components/primitives/YTextInput.tsx', 127], ['textPrimary', 'textTertiary']);
const inputHelper = role('inputHelper', '提示与错误', system, ['src/components/primitives/YTextInput.tsx', 137], ['textSecondary', 'textWrong']);
const creatorPath = 'src/screens/chat/creator/CreatorUI.tsx';
const noticePath = 'src/components/primitives/noticeDialogStyles.ts';
const profilePath = 'src/components/ProfileFieldHeading.tsx';
const giftPath = 'src/paidGuidance/chatGift/ChatGiftBanner.tsx';

const staticRoles = [
  navigation, input, inputHelper,
  role('profileLabel', '资料字段标题', system, [profilePath, 16], ['textSecondary']),
  role('profileDetail', '资料字段说明', system, [profilePath, 17], ['textTertiary']),
  role('creatorTitle', '创作页标题', system, [creatorPath, 21], ['textPrimary', 'textTertiary']),
  role('creatorHeading', '创作页分组标题', system, [creatorPath, 21], ['textPrimary', 'textTertiary']),
  role('creatorBody', '创作页正文', system, [creatorPath, 21], ['textPrimary', 'textTertiary']),
  role('noticeTitle', '通知弹层标题', undefined, [noticePath, 27], undefined, '#F7F7F8'),
  role('noticeBody', '通知弹层正文', undefined, [noticePath, 29], undefined, '#D8D8DC'),
  role('noticeAction', '通知弹层主操作', undefined, [noticePath, 34], undefined, '#1C1E22'),
  role('membershipPrice', '会员方案价格', undefined, ['src/screens/membership/MembershipOffers.tsx', 323], undefined, '#FFFFFF'),
];

const displayRoles = [
  role('treatBalance', 'Treats 余额', 'fonts.geologicaSemibold', ['src/screens/membership/TreatBalanceCard.tsx', 71], undefined, '使用等宽数字。字体加载后切换字族。'),
  role('registrationReward', '注册奖励金额', 'fonts.geologicaSemibold', ['src/overlays/RegistrationRewardDialog.tsx', 146], undefined, '使用等宽数字。'),
  role('chatGiftDiscount', '礼物折扣 · 常规', 'fonts.bebas / fonts.sans', [giftPath, 496], undefined, '中文按可用宽度缩放，字号上限 32 pt。'),
  role('chatGiftDiscountCompact', '礼物折扣 · 紧凑', 'fonts.bebas / fonts.sans', [giftPath, 497], undefined, '中文按可用宽度缩放，字号上限 28 pt。'),
];

const componentTypes: Partial<Record<string, TypeRow[]>> = {
  YAvatar: [{
    label: '首字母 · 默认 40 pt 头像', reference: 'avatarInitialTypography(size)', font: mediumDisplay,
    metrics: avatarInitialTypography(), detail: '字号 = 头像直径 × 0.42，文字色 #FFFFFF。',
  }],
  YTopBar: [{ ...navigation, detail: 'contentColor 和 titleStyle 可覆盖默认样式。' }],
  YTextInput: [input, inputHelper],
  YButton: (Object.keys(buttonMetrics.sizes) as (keyof typeof buttonMetrics.sizes)[]).map((size) => ({
    label: size, reference: `buttonLabelTypography('${size}', variant)`, metrics: buttonLabelTypography(size),
    font: 'fontWeights.sansMedium',
  })),
  YTab: (['text', 'underline', 'segment'] as const).map((variant) => ({
    label: variant, reference: `tabLabelTypography('${variant}', active)`,
    metrics: tabLabelTypography(variant, true), font: variant === 'underline' ? 'fontWeights.sansBold / fontWeights.sansMedium' : system,
    colors: ['textPrimary', 'textTertiary'], detail: '未选中字重 500。',
  })),
  YPlayPill: (['sm', 'md', 'lg'] as const).map((size) => ({
    label: size, reference: `playPillLabelTypography('${size}')`, metrics: playPillLabelTypography(size),
    font: 'fontWeights.sansBold',
  })),
  TreatText: [{
    label: 'Treats 金额', reference: 'TREAT_TEXT_GRADIENT',
    detail: '字号、行高和字族由调用方的 style 设置。',
  }],
};

export function hasComponentTypography(name: string) {
  return Boolean(componentTypes[name]);
}

function measure(value?: number) {
  return value === undefined ? '系统' : Number(value.toFixed(2)) + ' pt';
}

function TypeTable({ rows, samples = false }: { rows: TypeRow[]; samples?: boolean }) {
  return (
    <div className="props-scroll">
      <table className="typography-table">
        <thead><tr><th scope="col">用途</th><th scope="col">字号 / 行高</th><th scope="col">字重 / 字距</th><th scope="col">Token 映射</th></tr></thead>
        <tbody>{rows.map(({ label, metrics, reference, font, colors, detail, source }) => (
          <tr key={reference}>
            <th scope="row">
              <span>{label}</span>
              {samples && metrics && <span className="type-sample" style={{
                fontSize: metrics.fontSize, lineHeight: metrics.lineHeight ? metrics.lineHeight + 'px' : undefined,
                fontWeight: metrics.fontWeight, letterSpacing: metrics.letterSpacing,
              }}>Yoroll 123</span>}
              {source && <div><SourceLink path={source[0]} line={source[1]} /></div>}
            </th>
            <td>{metrics ? `${measure(metrics.fontSize)} / ${measure(metrics.lineHeight)}` : '调用方设置'}</td>
            <td>{metrics ? `${metrics.fontWeight ?? '系统'} / ${measure(metrics.letterSpacing)}` : '调用方设置'}</td>
            <td>
              <div className="type-reference"><code>{reference}</code><CopyButton code={reference} label="复制引用" /></div>
              {metrics && <div className="type-font">{font ? <code>{font}</code> : '系统字族'}</div>}
              {colors && <div className="type-colors">{colors.map((color) => <a href={`#tokens/${color}`} className="inline-source" key={color}><code>{color}</code></a>)}</div>}
              {detail && <p>{detail}</p>}
            </td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

export function ComponentTypography({ name }: { name: string }) {
  const rows = componentTypes[name];
  if (!rows) return null;
  return (
    <section id="typography" className="doc-section">
      <div className="reference-title"><h2>字体与字号</h2><a className="inline-source" href="#tokens/typography">完整排版规范</a></div>
      {name === 'YButton' && <p>主按钮常规字重 500，<code>brand</code> 为 700，<code>orange</code> 为 600。行高为字号 × 1.4 后取整。</p>}
      {name === 'YPlayPill' && <p>品牌样式在深色主题用 <a className="inline-source" href="#tokens/dark"><code>dark</code></a>，在浅色主题用 <code>#FFFFFF</code>。默认样式用 <code>#111111</code>。</p>}
      <TypeTable rows={rows} />
    </section>
  );
}

function FontSample({ src, text }: { src: string; text: string }) {
  const id = useId().replace(/[^\w-]/g, '');
  const family = 'AppFont' + id;
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const font = new FontFace(family, `url("${src}")`);
    let active = true;
    font.load().then(() => {
      if (active) {
        document.fonts.add(font);
        setReady(true);
      }
    }, () => {});
    return () => { active = false; document.fonts.delete(font); };
  }, [family, src]);
  return ready ? <div className="font-sample" style={{ fontFamily: family }}>{text}</div> : null;
}

const chatLabels: Record<keyof ReturnType<typeof chatMessageTypography>, string> = {
  user: '用户消息', dialog: '对话', narration: '旁白', thought: '想法', description: '描述',
  heading1: '一级标题', heading2: '二级标题', heading3: '三级标题',
  heading4: '四级标题', heading5: '五级标题', heading6: '六级标题',
};

function ChatTypeScale() {
  const [size, setSize] = useState<number>(chatFontSize.default);
  const metrics = chatMessageTypography(size);
  return (
    <section className="reference-section">
      <div className="reference-title"><h2>聊天消息</h2><SourceLink path="src/screens/chat/chatAppearance.ts" line={28} /></div>
      <p>原始字级和行高以 {chatFontSize.default} pt 为基准，随聊天字号设置同比变化。正文使用 <code>{system}</code>，字重跟随消息样式。</p>
      <label className="type-range">聊天字号 <input type="range" min={chatFontSize.min} max={chatFontSize.max} step={chatFontSize.step} value={size} aria-valuetext={size + ' pt'} onChange={(event) => setSize(event.currentTarget.valueAsNumber)} /><output>{size} pt</output></label>
      <TypeTable samples rows={(Object.keys(metrics) as (keyof typeof metrics)[]).map((key) => ({
        label: chatLabels[key], reference: `chatMessageTypography(${size}).${key}`, metrics: metrics[key], font: system,
      }))} />
    </section>
  );
}

export function TypographySection({ inventory }: { inventory: Inventory | null }) {
  const customFonts = [
    { name: customFontNames.bebas, key: 'fonts.bebas', file: 'BebasNeue-Regular.ttf', usage: '短剧会员标签、聊天礼物的拉丁字母和数字', sample: 'YOROLL 2026', path: 'app/_layout.tsx', line: 440 },
    { name: customFontNames.geologicaSemibold, key: 'fonts.geologicaSemibold', file: 'Geologica-SemiBold.ttf', usage: '引导标题、Treats 余额和奖励数字', sample: 'Yoroll 0123', path: 'app/_layout.tsx', line: 441 },
    { name: 'ChatGiftChineseDisplay', file: 'ChatGiftChinese-Display.ttf', usage: '聊天礼物折扣，按可用宽度和系统字体缩放调整', sample: '专属折扣', path: giftPath, line: 45 },
  ];
  return (
    <div className="section-stack">
      <section className="reference-section">
        <h2>字级与 Token</h2>
        <p>数值使用 React Native 逻辑点。复制 Token 后，可把排版样式传给 <code>Text</code>，再用主题字族和颜色组合。</p>
        <TypeTable rows={staticRoles} samples />
      </section>
      <section className="reference-section">
        <h2>组件字级</h2>
        <div className="detail-tokens">
          {Object.keys(componentTypes).map((name) => <a href={`#${name.toLowerCase()}/typography`} key={name}><code>{name}</code></a>)}
        </div>
      </section>
      <ChatTypeScale />
      <section className="reference-section">
        <div className="reference-title"><h2>系统字族</h2><SourceLink path="src/theme/fonts.ts" /></div>
        <div className="props-scroll">
          <table>
            <thead><tr><th scope="col">字族映射</th><th scope="col">iOS</th><th scope="col">Android</th><th scope="col">网页</th></tr></thead>
            <tbody>{([
              ['sans', 'fonts.sans / fontWeights.sansRegular / fontWeights.sansBold'],
              ['medium', 'fontWeights.sansMedium / fontWeights.dispMedium'],
              ['mono', 'fonts.mono / fontWeights.monoRegular'],
            ] as const).map(([key, names]) => (
              <tr key={key}><th scope="row"><code>{names}</code></th>
                {(['ios', 'android', 'web'] as const).map((platform) => <td key={platform}><code>{systemFonts[platform][key]}</code></td>)}
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      <section className="reference-section">
        <h2>App 展示字体</h2>
        <div className="type-font-grid">
          {customFonts.map(({ name, key, file, usage, sample, path, line }) => {
            const src = inventory?.assets.find((asset) => asset.path === 'assets/fonts/' + file)?.previewUrl;
            return <article className="reference-card reference-body" key={name}>
              {src && <FontSample src={src} text={sample} />}
              <h3>{name}</h3><code>{key ?? '通过 useFonts 注册'}</code><p>{usage}</p>
              <code>{file}</code><SourceLink path={path} line={line}>查看注册</SourceLink>
            </article>;
          })}
        </div>
        <div className="type-display"><TypeTable rows={displayRoles} /></div>
        {inventory && <a className="inline-source" href="#app-typography">查找 App 源文件中的字号和字族</a>}
      </section>
    </div>
  );
}
