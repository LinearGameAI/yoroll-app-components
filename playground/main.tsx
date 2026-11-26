import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IconClose, IconSearch, IconTextLogo } from '@yoroll/rn-icon';
import { YorollThemeProvider, darkTokens, lightTokens, type ThemeMode, type ThemeTokens } from '../src';
import { categories, demos, type ComponentDemo } from './demos';
import { DirectoryHeading } from './controls';
import { FoundationsPage } from './foundations';
import { MotionPage } from './motion';
import { AssetsPage } from './assets';
import { AppInventoryPage, type InventoryView } from './appInventory';
import {
  BlockDetails, BlocksPage, ComponentDetails, DocsHome, GettingStartedPage, blocks, repositoryUrl, routeFor,
} from './docs';
import { CatalogSearch, type SearchEntry } from './search';
import './styles.css';
import './directory.css';
import './docs.css';

declare const __APP_INVENTORY__: boolean;

const directoryLinks = [
  { hash: '#', label: '概览' },
  { hash: '#start', label: '接入指南' },
  { hash: '#components', label: '组件' },
  { hash: '#blocks', label: '组合示例' },
  { hash: '#tokens', label: '设计 Token' },
  { hash: '#motion', label: '动效' },
  { hash: '#assets', label: '图素' },
  ...(__APP_INVENTORY__ ? [{ hash: '#app', label: 'App 索引' }] : []),
];

const appViews: Readonly<Record<string, InventoryView>> = {
  '#app': 'source', '#app-assets': 'assets', '#app-motion': 'motion',
};

const searchEntries: SearchEntry[] = [
  { title: '接入指南', href: '#start', section: '指南', keywords: '安装 使用 React Native Expo 安全区 registry 源码' },
  { title: '组件', href: '#components', section: '目录', keywords: 'components' },
  { title: '组合示例', href: '#blocks', section: '目录', keywords: 'blocks' },
  { title: '设计 Token', href: '#tokens', section: '规范', keywords: '颜色 字体 布局 尺寸 阴影 渐变' },
  { title: '动效', href: '#motion', section: '规范', keywords: '缓动 运动 时长 动画' },
  { title: '图素', href: '#assets', section: '资源', keywords: '图标 icon 依赖' },
  ...(__APP_INVENTORY__ ? [{ title: 'App 完整索引', href: '#app', section: '资源', keywords: 'App 原图 字体 源码 样式' }] : []),
  ...demos.map((demo) => ({ title: demo.name, href: routeFor(demo.name), section: '组件', keywords: demo.label + ' ' + demo.description })),
  ...blocks.map((block) => ({ title: block.title, href: '#blocks/' + block.id, section: '组合示例', keywords: block.description })),
  ...(Object.keys(darkTokens) as (keyof ThemeTokens)[]).map((key) => ({
    title: key, href: '#tokens/' + key, section: 'Token', keywords: darkTokens[key] + ' ' + lightTokens[key],
  })),
];

const initialMetrics = { frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } };

function readTheme(): ThemeMode {
  try {
    return localStorage.getItem('yoroll-component-theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function ComponentNavigation({ matches, detail, query, setQuery }: {
  matches: ComponentDemo[]; detail?: ComponentDemo; query: string; setQuery: (value: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="search-box">
        <span className="search-icon" aria-hidden="true"><IconSearch size={17} color="currentColor" /></span>
        <input ref={input} type="search" aria-label="搜索组件" placeholder="筛选组件" value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
        {query && <button type="button" aria-label="清空筛选" onClick={() => { setQuery(''); input.current?.focus(); }}>
          <IconClose size={14} color="currentColor" />
        </button>}
      </div>
      <nav className="catalog-nav" aria-label="组件导航">
        {categories.map(({ id, label }) => {
          const members = matches.filter((demo) => demo.category === id);
          return members.length > 0 && (
            <div className="nav-group" key={id}>
              <p>{label}</p>
              <ul>{members.map((demo) => (
                <li key={demo.name}><a href={routeFor(demo.name)}
                  aria-current={detail === demo && !query ? 'page' : undefined} onClick={() => setQuery('')}>{demo.name}</a></li>
              ))}</ul>
            </div>
          );
        })}
      </nav>
    </>
  );
}

function ComponentsPage({ matches, query, clearSearch }: { matches: ComponentDemo[]; query: string; clearSearch: () => void }) {
  return (
    <>
      <DirectoryHeading title={query ? '组件搜索结果' : '组件'} action={<span className="directory-count" aria-live="polite">{matches.length} 个组件</span>}>
        {query ? <>匹配 <code>{query}</code> 的组件。</> : '预览状态与变体，查看安装、用法、参数和相关 Token。'}
      </DirectoryHeading>
      {!matches.length && <div className="empty">
        <p>没有匹配的组件。可以试试组件名或用途。</p>
        <button type="button" onClick={clearSearch}>清空筛选</button>
      </div>}
      <ul className="component-grid">
        {matches.map((demo) => {
          const { Preview } = demo.examples[0];
          return (
            <li className="tile" key={demo.name}>
              <div className="showcase"><Preview /></div>
              <a className="tile-link" href={routeFor(demo.name)}><strong>{demo.name}</strong><span>{demo.label}</span></a>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function App() {
  const [mode, setMode] = useState(readTheme);
  const [route, setRoute] = useState(window.location.hash);
  const [query, setQuery] = useState('');
  const [group, name, blockSection] = route.split('/');
  const detail = demos.find((demo) => routeFor(demo.name) === group);
  const block = group === '#blocks' ? blocks.find((item) => item.id === name) : undefined;
  const appView = __APP_INVENTORY__ ? appViews[route] : undefined;
  const directory = appView ? '#app' : detail ? '#components'
    : ['#components', '#start', '#blocks', '#tokens', '#motion', '#assets'].includes(group) ? group : '#';
  const activeDirectory = directoryLinks.find((item) => item.hash === directory);
  const tokenName = directory === '#tokens' ? name ?? '' : '';
  const section = block ? blockSection : detail || directory === '#start' ? name : undefined;
  const tokens = mode === 'light' ? lightTokens : darkTokens;
  const search = query.trim().toLowerCase();
  const matches = demos.filter((demo) => [demo.name, demo.label, demo.description].some((text) => text.toLowerCase().includes(search)));
  const colors = {
    '--bg': tokens.bgPrimary, '--card': tokens.bgCard, '--surface': tokens.bgSecondary,
    '--text': tokens.textPrimary, '--subtle': tokens.textSecondary, '--line': tokens.cardStroke,
    '--peach': tokens.orange, '--pink': tokens.orange7,
  } as CSSProperties;

  useEffect(() => {
    const handleRoute = () => { setRoute(window.location.hash); setQuery(''); };
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  useEffect(() => {
    const title = detail?.name ?? block?.title ?? (directory === '#' ? undefined : activeDirectory?.label);
    document.title = title ? `${title} | Yoroll App 组件库` : 'Yoroll App 组件库';
    if (section) document.getElementById(section)?.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
  }, [route, section, detail, block, directory, activeDirectory]);

  const changeMode = (next: ThemeMode) => {
    setMode(next);
    try {
      localStorage.setItem('yoroll-component-theme', next);
    } catch {
      // The selection still applies when browser storage is unavailable.
    }
  };

  return (
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <YorollThemeProvider mode={mode}>
        <div className="app" data-theme={mode} style={colors}>
          <a className="skip-link" href="#page-title" onClick={(event) => {
            event.preventDefault();
            document.getElementById('page-title')?.focus();
          }}>跳到正文</a>
          <header className="topbar">
            <div className="topbar-inner">
              <a className="brand" href="#" aria-label="Yoroll App 组件库首页" onClick={() => setQuery('')}>
                <IconTextLogo width={82} height={24} color={tokens.textPrimary} />
                <span>App 组件库</span>
              </a>
              <div className="topbar-tools">
                <div className="theme-switch" role="group" aria-label="预览主题">
                  <button type="button" aria-pressed={mode === 'dark'} onClick={() => changeMode('dark')}>深色</button>
                  <button type="button" aria-pressed={mode === 'light'} onClick={() => changeMode('light')}>浅色</button>
                </div>
                <a className="repo-link" href={repositoryUrl}>GitHub</a>
              </div>
            </div>
          </header>
          <div className="layout">
            <aside className="sidebar">
              <CatalogSearch entries={searchEntries} />
              <nav className="section-nav" aria-label="组件库栏目">
                {directoryLinks.map(({ hash, label }) => (
                  <a key={hash} href={hash} aria-current={directory === hash ? 'page' : undefined} onClick={() => setQuery('')}>{label}</a>
                ))}
              </nav>
              {directory === '#components' && <ComponentNavigation matches={matches} detail={detail} query={query} setQuery={setQuery} />}
            </aside>
            <main>
              {directory === '#' && <DocsHome />}
              {directory === '#start' && <GettingStartedPage />}
              {directory === '#components' && (detail && !search
                ? <ComponentDetails key={detail.name} demo={detail} />
                : <ComponentsPage matches={matches} query={query.trim()} clearSearch={() => setQuery('')} />)}
              {directory === '#blocks' && (block ? <BlockDetails key={block.id} block={block} /> : <BlocksPage />)}
              {directory === '#tokens' && <FoundationsPage key={tokenName} tokenName={tokenName} />}
              {directory === '#motion' && <MotionPage />}
              {directory === '#assets' && <AssetsPage showAppInventory={__APP_INVENTORY__} />}
              {__APP_INVENTORY__ && appView && <AppInventoryPage view={appView} />}
            </main>
          </div>
        </div>
      </YorollThemeProvider>
    </SafeAreaProvider>
  );
}

const container = document.getElementById('root');
if (!container) throw new Error('Missing catalog root.');
createRoot(container).render(<App />);
