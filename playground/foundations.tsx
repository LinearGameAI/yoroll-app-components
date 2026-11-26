import { useState } from 'react';
import {
  darkTokens, lightTokens, layout, sheetMetrics, dialogMetrics, buttonMetrics, inputMetrics, tabMetrics,
  shadowPresets, TREAT_GRADIENT, TREAT_TEXT_GRADIENT, useTheme, type ThemeTokens,
} from '../src';
import { CopyButton, DirectoryHeading, SourceLink } from './controls';
import { TypographySection } from './typeSpec';
import type { Inventory } from './inventoryData';

const sections = [
  { key: 'color', label: '主题色' }, { key: 'typography', label: '字体与字号' },
  { key: 'layout', label: '布局与尺寸' }, { key: 'surface', label: '渐变与阴影' },
] as const;
type ColorToken = keyof ThemeTokens;

const colorGroups: { title: string; keys: ColorToken[] }[] = [
  { title: '品牌与主色', keys: ['orange', 'orange1', 'orange2', 'orange3', 'orange4', 'orange5', 'orange6', 'orange7', 'dark', 'primary'] },
  { title: '文字与状态', keys: ['textPrimary', 'textSecondary', 'textTertiary', 'textFourth', 'textWrong', 'textLink', 'textRight', 'textProblem'] },
  { title: '背景与反馈', keys: ['bgPrimary', 'bgSecondary', 'bgTertiary', 'bgFourth', 'bgFifth', 'bgCard', 'bgHover', 'bgHighlight', 'bgPicked', 'bgWrong', 'bgRight'] },
  { title: '边线、底栏与遮罩', keys: ['cardStroke', 'mask', 'shadow', 'tabBarBg', 'bottomGradientStart', 'bottomGradientStop'] },
];
const colorUsage: Partial<Record<ColorToken, string>> = {
  orange: '品牌强调色',
  orange7: 'Treats 渐变粉色端点',
  dark: '品牌深色',
  primary: '主操作色',
  textPrimary: '标题与主要正文',
  textSecondary: '说明与次级内容',
  textTertiary: '占位、空态与未选页签',
  textFourth: '低对比度装饰与控件细节',
  textWrong: '字段错误与错误反馈',
  textLink: '可操作文本',
  textRight: '成功反馈',
  textProblem: '提醒状态',
  bgPrimary: '页面底色',
  bgSecondary: '弹层和次级表面',
  bgTertiary: '第三层表面',
  bgCard: '卡片表面',
  bgPicked: '选中表面',
  cardStroke: '卡片边线与分隔',
  mask: '遮罩',
  tabBarBg: '应用底栏',
};

function ColorSection({ tokenName }: { tokenName: string }) {
  const { tokens, mode } = useTheme();
  const [query, setQuery] = useState(tokenName);
  const search = query.trim().toLowerCase();
  const groups = colorGroups.map((group) => ({
    ...group,
    keys: group.keys.filter((key) => [key, darkTokens[key], lightTokens[key], colorUsage[key] ?? '']
      .some((value) => value.toLowerCase().includes(search))),
  })).filter((group) => group.keys.length);
  return (
    <>
      <div className="directory-toolbar">
        <input type="search" aria-label="搜索色彩 Token" placeholder="搜索名称、用途或色值" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
        <CopyButton code={JSON.stringify({ dark: darkTokens, light: lightTokens }, null, 2)} label="复制色彩 JSON" />
      </div>
      {groups.length === 0 && <p className="empty">没有匹配的色彩 Token。</p>}
      {groups.map(({ title, keys }) => (
        <section className="reference-section" key={title}>
          <h2>{title}</h2>
          <div className="token-grid">
            {keys.map((key) => (
              <article className="reference-card" key={key}>
                <div className="swatch-field"><div style={{ backgroundColor: tokens[key] }} /></div>
                <div className="reference-body">
                  <code>{key}</code>
                  {colorUsage[key] && <p>{colorUsage[key]}</p>}
                  <div className="value-row"><span>深色</span><code>{darkTokens[key]}</code></div>
                  <div className="value-row"><span>浅色</span><code>{lightTokens[key]}</code></div>
                  <CopyButton code={`${mode === 'dark' ? 'darkTokens' : 'lightTokens'}.${key}`} label="复制引用" />
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

const metricGroups = [
  { title: '应用布局', prefix: 'layout', path: 'src/theme/layout.ts', values: layout },
  { title: '输入框', prefix: 'inputMetrics', path: 'src/components/primitives/YTextInput.tsx', values: inputMetrics },
  { title: '页签', prefix: 'tabMetrics', path: 'src/components/primitives/YTab.tsx', values: tabMetrics },
  { title: '底部弹层', prefix: 'sheetMetrics', path: 'src/components/ChatBottomSheet.tsx', values: sheetMetrics },
  { title: '居中确认框', prefix: 'dialogMetrics.centered', path: 'src/components/primitives/centeredDialogStyles.ts', values: dialogMetrics.centered },
  { title: '通知与奖励弹窗', prefix: 'dialogMetrics.notice', path: 'src/components/primitives/noticeDialogStyles.ts', values: dialogMetrics.notice },
];

function LayoutSection() {
  return (
    <div className="section-stack">
      <p className="directory-note">App 数值使用逻辑像素。底部弹层安全区留白按 <code>max(bottomInset, {sheetMetrics.minBottomInset}) + {layout.gutter}</code> 计算。</p>
      <section className="reference-section">
        <h2>按钮尺寸</h2>
        <p>圆角 <code>{buttonMetrics.borderRadius} pt</code></p>
        <div className="props-scroll">
          <table>
            <thead><tr><th scope="col">规格</th><th scope="col">最小高度</th><th scope="col">横向内边距</th><th scope="col">纵向内边距</th><th scope="col">字号</th></tr></thead>
            <tbody>{Object.entries(buttonMetrics.sizes).map(([key, value]) => (
              <tr key={key}><th scope="row"><code>{key}</code></th><td>{value.minHeight} pt</td><td>{value.paddingH} pt</td><td>{value.paddingV} pt</td><td>{value.fontSize} pt</td></tr>
            ))}</tbody>
          </table>
        </div>
        <SourceLink path="src/components/primitives/YButton.tsx" />
      </section>
      {metricGroups.map(({ title, prefix, path, values }) => (
        <section className="reference-section" key={prefix}>
          <div className="reference-title"><h2>{title}</h2><SourceLink path={path} /></div>
          <div className="spec-list">
            {Object.entries(values).map(([name, value]) => (
              <div key={name}><code>{prefix}.{name}</code>
                <span>{typeof value === 'number' ? `${value} pt` : Array.isArray(value) ? value.join(' → ') : value}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SurfaceSection() {
  return (
    <div className="section-stack">
      <section className="reference-section">
        <div className="reference-title"><h2>Treats 渐变</h2><SourceLink path="src/theme/treats.ts" /></div>
        <div className="surface-grid">
          {[
            { name: 'TREAT_GRADIENT', colors: TREAT_GRADIENT, label: '图标、奖励与购买表面' },
            { name: 'TREAT_TEXT_GRADIENT', colors: TREAT_TEXT_GRADIENT, label: '粉色在左，橙色在右的金额文字' },
          ].map(({ name, colors, label }) => (
            <article className="reference-card" key={name}>
              <div className="gradient-sample" style={{ backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})` }} />
              <div className="reference-body"><code>{name}</code><p>{label}</p><small>{colors.join(' → ')}</small><CopyButton code={name} label="复制引用" /></div>
            </article>
          ))}
        </div>
      </section>
      <section className="reference-section">
        <div className="reference-title"><h2>阴影</h2><SourceLink path="src/theme/shadows.ts" /></div>
        <div className="surface-grid">
          {Object.entries(shadowPresets).map(([name, shadow]) => (
            <article className="reference-card" key={name}>
              <div className="shadow-field"><div style={{ boxShadow: shadow.web }} /></div>
              <div className="reference-body"><code>shadows.{name}</code>
                <p>iOS 模糊 {shadow.ios.shadowRadius} pt，透明度 {shadow.ios.shadowOpacity}</p>
                <p>Android elevation {shadow.android.elevation}</p>
                <CopyButton code={JSON.stringify({ ios: shadow.ios, android: shadow.android }, null, 2)} label="复制平台样式" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function FoundationsPage({ tokenName, inventory }: { tokenName: string; inventory: Inventory | null }) {
  const section = sections.find(({ key }) => key === tokenName)?.key ?? 'color';
  return (
    <>
      <DirectoryHeading title="设计 Token" action={<SourceLink path="src/theme/tokens.ts" />}>
        从 App 样式提取的语义色、字族、字号和布局尺寸。深色是 App 默认主题，浅色用于对照。
      </DirectoryHeading>
      <nav className="directory-tabs" aria-label="Token 类型">
        {sections.map(({ key, label }) => (
          <a key={key} href={key === 'color' ? '#tokens' : '#tokens/' + key} aria-current={section === key ? 'page' : undefined}>{label}</a>
        ))}
      </nav>
      {section === 'color' && <ColorSection tokenName={tokenName === 'color' ? '' : tokenName} />}
      {section === 'typography' && <TypographySection inventory={inventory} />}
      {section === 'layout' && <LayoutSection />}
      {section === 'surface' && <SurfaceSection />}
    </>
  );
}
