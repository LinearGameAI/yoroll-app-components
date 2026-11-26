import { useState, type ComponentType, type ReactNode } from 'react';
import { useTheme } from '../src';
import { CopyButton, DirectoryHeading, Segmented, SourceLink } from './controls';
import { catalogExample, categories, type ComponentDemo } from './demos';
import { ComponentTypography, hasComponentTypography } from './typeSpec';

export const repositoryUrl = 'https://github.com/LinearGameAI/yoroll-app-components';
const installCommand = 'npm install git+https://github.com/LinearGameAI/yoroll-app-components.git';

export const routeFor = (name: string) => `#${name.toLowerCase()}`;

export const blocks = [
  {
    id: 'profile-form',
    title: '资料编辑表单',
    description: '组合顶栏、头像、输入框与保存动作。修改显示名称会同步更新头像预览。',
    path: 'app/edit-profile.tsx',
    components: ['YTopBar', 'YAvatar', 'YTextInput', 'YButton'],
  },
  {
    id: 'confirm-dialog',
    title: '修改确认框',
    description: '复用 App 居中确认框的宽度、圆角和间距，展示保存、放弃与关闭三种反馈。',
    path: 'src/features/userPersonas/PersonaUnsavedDialog.tsx',
    components: ['YButton'],
  },
  {
    id: 'loading-list',
    title: '列表加载与空态',
    description: '展示页签、骨架、加载结果和空列表之间的切换。',
    path: 'src/screens/HomeScreen.tsx',
    components: ['YTab', 'SkeletonBlock', 'YButton'],
  },
].map((block) => ({ ...block, ...catalogExample('blocks/' + block.id) }));
export type Block = typeof blocks[number];

const previewTabs = [{ key: 'preview', label: '预览' }, { key: 'code', label: '代码' }] as const;

export function CodeBlock({ code, language = 'TSX', copyLabel = '复制代码' }: {
  code: string; language?: string; copyLabel?: string;
}) {
  return (
    <div className="doc-code">
      <div className="code-toolbar"><span>{language}</span><CopyButton code={code} label={copyLabel} /></div>
      <pre tabIndex={0}><code>{code}</code></pre>
    </div>
  );
}

function PreviewPanel({ Preview, code }: { Preview: ComponentType; code: string }) {
  const [tab, setTab] = useState<typeof previewTabs[number]['key']>('preview');
  return (
    <div className="preview-panel">
      <div className="preview-toolbar">
        <Segmented items={previewTabs} value={tab} onChange={setTab} label="示例视图" />
        {tab === 'code' && <CopyButton code={code} />}
      </div>
      <div hidden={tab !== 'preview'} className="showcase preview-stage"><Preview /></div>
      <div hidden={tab !== 'code'} className="preview-code"><pre tabIndex={0}><code>{code}</code></pre></div>
    </div>
  );
}

type DocSection = { id: string; label: string };
function DocLayout({ route, sections, children }: { route: string; sections: DocSection[]; children: ReactNode }) {
  return (
    <div className="doc-layout">
      <nav className="contents-nav" aria-label="本页目录">
        <span>本页</span>
        {sections.map(({ id, label }) => {
          const href = route + '/' + id;
          return <a key={id} href={href} aria-current={window.location.hash === href ? 'location' : undefined}>{label}</a>;
        })}
      </nav>
      <div className="doc-body">{children}</div>
    </div>
  );
}

function Installation({ id }: { id: string }) {
  return (
    <section id="installation" className="doc-section">
      <h2>安装</h2>
      <p>在 Expo SDK 54 / React Native 0.81 项目中添加组件库依赖。</p>
      <CodeBlock code={installCommand} language="Shell" copyLabel="复制安装命令" />
      <div className="doc-links">
        <a href="#start" className="inline-source">主题与安全区配置</a>
        <a href={`./r/${id}.json`} className="inline-source" download>下载源文件与依赖 JSON</a>
      </div>
    </section>
  );
}

export function ComponentDetails({ demo }: { demo: ComponentDemo }) {
  const { tokens } = useTheme();
  const id = demo.name.toLowerCase();
  const sections: DocSection[] = [
    { id: 'previews', label: '预览与代码' }, { id: 'installation', label: '安装' },
    { id: 'usage', label: '用法' }, { id: 'props', label: '参数' },
    ...(hasComponentTypography(demo.name) ? [{ id: 'typography', label: '字体与字号' }] : []),
    ...(demo.colors?.length ? [{ id: 'tokens', label: '相关 Token' }] : []),
  ];
  return (
    <>
      <div className="breadcrumb">
        <a href="#components">组件</a><span aria-hidden="true">/</span>
        <span>{categories.find((item) => item.id === demo.category)?.label}</span>
      </div>
      <DirectoryHeading title={demo.name} action={
        <div className="doc-links">
          <a className="inline-source" href={`${repositoryUrl}/blob/main/src/components/${demo.name}.tsx`}>组件库实现</a>
          <SourceLink path={demo.appPath ?? `src/components/primitives/${demo.name}.tsx`} />
        </div>
      }>{demo.description}</DirectoryHeading>
      <DocLayout route={routeFor(demo.name)} sections={sections}>
        <section id="previews" className="doc-section">
          <h2>预览与代码</h2>
          <div className="preview-list">
            {demo.examples.map(({ title, code, Preview }) => (
              <div className="doc-example" key={title}><h3>{title}</h3><PreviewPanel code={code} Preview={Preview} /></div>
            ))}
          </div>
        </section>
        <Installation id={id} />
        <section id="usage" className="doc-section">
          <h2>用法</h2>
          {demo.name === 'YTopBar' && <p>将顶栏放在应用根层的 <code>SafeAreaProvider</code> 内，以读取顶部安全区。</p>}
          <CodeBlock code={`import { ${demo.name} } from '@yoroll/app-components';`} copyLabel="复制导入" />
        </section>
        <section id="props" className="doc-section">
          <h2>常用参数</h2>
          <div className="props-scroll">
            <table>
              <thead><tr><th scope="col">参数</th><th scope="col">类型</th><th scope="col">说明</th></tr></thead>
              <tbody>{demo.props.map(([name, type, description]) => (
                <tr key={name}><th scope="row"><code>{name}</code></th><td><code>{type}</code></td><td>{description}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </section>
        <ComponentTypography name={demo.name} />
        {demo.colors && <section id="tokens" className="doc-section">
          <h2>相关 Token</h2>
          <div className="detail-tokens">
            {demo.colors.map((key) => <a href={`#tokens/${key}`} key={key} title={tokens[key]}>
              <span aria-hidden="true" style={{ backgroundColor: tokens[key] }} /><code>{key}</code>
            </a>)}
          </div>
        </section>}
      </DocLayout>
    </>
  );
}

const startExample = `import { Alert, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  YButton, YTopBar, YorollThemeProvider, layout, useTheme,
} from '@yoroll/app-components';

function Settings() {
  const { tokens } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: tokens.bgPrimary }}>
      <YTopBar title="设置" />
      <View style={{ padding: layout.gutter }}>
        <YButton label="保存" onPress={() => Alert.alert('已保存')} fullWidth />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <YorollThemeProvider mode="dark">
        <Settings />
      </YorollThemeProvider>
    </SafeAreaProvider>
  );
}`;

export function GettingStartedPage() {
  return (
    <>
      <DirectoryHeading title="接入指南">
        将基础组件和设计 Token 安装到 Expo / React Native，从一个页面开始复用。
      </DirectoryHeading>
      <DocLayout route="#start" sections={[
        { id: 'installation', label: '安装' }, { id: 'usage', label: '使用' }, { id: 'source', label: '获取源码' },
      ]}>
        <section id="installation" className="doc-section">
          <h2>安装</h2>
          <p>在 Expo SDK 54 / React Native 0.81 项目根目录执行。团队项目可以在 Git URL 后追加 <code>#提交号</code> 固定版本。</p>
          <CodeBlock code={installCommand} language="Shell" copyLabel="复制安装命令" />
        </section>
        <section id="usage" className="doc-section">
          <h2>使用</h2>
          <p>页面可以从 <code>useTheme()</code> 读取主题。用到 <code>YTopBar</code> 时，在应用根层提供 <code>SafeAreaProvider</code>。</p>
          <CodeBlock code={startExample} />
        </section>
        <section id="source" className="doc-section">
          <h2>获取源码</h2>
          <p>组件页可以下载该项的源码 JSON，其中列出了原始文件、相对路径和依赖。组合页的代码就是预览使用的 TSX。</p>
          <div className="doc-links">
            <a href="./registry.json" className="inline-source" target="_blank" rel="noreferrer">查看注册表 JSON</a>
            <a href="#components" className="inline-source">浏览组件</a>
            <a href="#blocks" className="inline-source">浏览组合</a>
          </div>
        </section>
      </DocLayout>
    </>
  );
}

function BlockCard({ block }: { block: Block }) {
  return (
    <article className="reference-card block-card">
      <div className="showcase block-card-stage"><block.Preview /></div>
      <div className="reference-body">
        <a className="block-title" href={`#blocks/${block.id}`}>{block.title}</a>
        <p>{block.description}</p>
      </div>
    </article>
  );
}

export function BlocksPage() {
  return (
    <>
      <DirectoryHeading title="组合示例">
        用真实组件和 App 的规格搭建常见界面。每个示例都有可操作预览和可复制 TSX。
      </DirectoryHeading>
      <div className="block-grid">{blocks.map((block) => <BlockCard key={block.id} block={block} />)}</div>
    </>
  );
}

export function BlockDetails({ block }: { block: Block }) {
  return (
    <>
      <div className="breadcrumb"><a href="#blocks">组合示例</a></div>
      <DirectoryHeading title={block.title} action={<SourceLink path={block.path} />}>{block.description}</DirectoryHeading>
      <DocLayout route={'#blocks/' + block.id} sections={[
        { id: 'previews', label: '预览与代码' }, { id: 'installation', label: '安装' }, { id: 'components', label: '使用的组件' },
      ]}>
        <section id="previews" className="doc-section">
          <h2>预览与代码</h2>
          <PreviewPanel Preview={block.Preview} code={block.code} />
        </section>
        <Installation id={block.id} />
        <section id="components" className="doc-section">
          <h2>使用的组件</h2>
          <div className="detail-tokens">{block.components.map((name) => <a href={routeFor(name)} key={name}><code>{name}</code></a>)}</div>
        </section>
      </DocLayout>
    </>
  );
}

export function DocsHome() {
  const profile = blocks[0];
  return (
    <>
      <header className="docs-hero">
        <div className="docs-hero-copy">
          <p className="docs-platform">React Native · Expo</p>
          <h1 id="page-title" tabIndex={-1}><span>Yoroll App</span>{' '}组件库</h1>
          <p className="docs-lede">用现有组件、组合示例和设计 Token 搭建 App 界面。</p>
          <div className="home-actions">
            <a className="doc-action doc-action-primary" href="#start">接入指南</a>
            <a className="doc-action" href="#components">浏览组件</a>
          </div>
        </div>
        <div className="docs-hero-sample">
          <profile.Preview />
          <a href={`#blocks/${profile.id}`} className="inline-source">查看表单示例</a>
        </div>
      </header>
      <section className="home-section">
        <div className="home-section-title"><h2>组合示例</h2><a className="inline-source" href="#blocks">查看全部组合</a></div>
        <div className="block-grid">{blocks.slice(1).map((block) => <BlockCard block={block} key={block.id} />)}</div>
      </section>
      <section className="home-section">
        <div className="home-section-title"><h2>设计规范</h2></div>
        <div className="guide-grid">
          <a href="#tokens"><strong>设计 Token</strong><span>语义色、字级与字族、尺寸、渐变与阴影</span></a>
          <a href="#motion"><strong>动效</strong><span>时长、缓动与可播放示意</span></a>
          <a href="#assets"><strong>图素</strong><span>素材图库、视觉风格和生成提示词</span></a>
        </div>
      </section>
    </>
  );
}
