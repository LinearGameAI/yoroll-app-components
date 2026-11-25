import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IconCheck, IconClose, IconCopy, IconSearch, IconTextLogo } from '@yoroll/rn-icon';
import { YorollThemeProvider, darkTokens, lightTokens, type ThemeMode } from '../src';
import { categories, demos, type ComponentDemo } from './demos';
import './styles.css';

const repositoryUrl = 'https://github.com/LinearGameAI/yoroll-app-components';
const initialMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, right: 0, bottom: 0, left: 0 },
};
const routeFor = (name: string) => `#${name.toLowerCase()}`;

function readTheme(): ThemeMode {
  try {
    return localStorage.getItem('yoroll-component-theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function CopyButton({ code }: { code: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const reset = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(reset.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    window.clearTimeout(reset.current);
    reset.current = window.setTimeout(() => setStatus('idle'), 2400);
  };

  const Icon = status === 'copied' ? IconCheck : IconCopy;
  return (
    <button className="copy-button" type="button" onClick={copy} aria-live="polite">
      <Icon size={14} color="currentColor" />
      {status === 'copied' ? '已复制' : status === 'failed' ? '复制失败，可手动选择' : '复制代码'}
    </button>
  );
}

function ComponentDetails({ demo }: { demo: ComponentDemo }) {
  return (
    <>
      <div className="detail-heading">
        <div className="breadcrumb">
          <a href="#">全部组件</a>
          <span aria-hidden="true">/</span>
          <span>{categories.find((category) => category.id === demo.category)?.label}</span>
        </div>
        <h1 id="page-title" tabIndex={-1}>{demo.name}</h1>
        <p>{demo.description}</p>
        <a className="source-link" href={`${repositoryUrl}/blob/main/src/components/${demo.name}.tsx`}>查看组件源码</a>
      </div>
      <div className="example-list">
        {demo.examples.map(({ title, code, Preview }) => {
          const snippet = `import { ${demo.name} } from '@yoroll/app-components';\n\n${code}`;
          return (
            <section className="example" key={title}>
              <h2>{title}</h2>
              <div className="example-content">
                <div className="showcase"><Preview /></div>
                <div className="code-panel">
                  <div className="code-toolbar"><span>TSX</span><CopyButton code={snippet} /></div>
                  <pre tabIndex={0}><code>{snippet}</code></pre>
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <h2 className="props-title">常用参数</h2>
      <div className="props-scroll">
        <table>
          <thead><tr><th scope="col">参数</th><th scope="col">类型</th><th scope="col">说明</th></tr></thead>
          <tbody>
            {demo.props.map(([name, type, description]) => (
              <tr key={name}><th scope="row"><code>{name}</code></th><td><code>{type}</code></td><td>{description}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Overview({ matches, filtering, clearSearch }: {
  matches: ComponentDemo[];
  filtering: boolean;
  clearSearch: () => void;
}) {
  return (
    <>
      {!filtering && (
        <header className="intro">
          <h1 id="page-title" tabIndex={-1}>Yoroll App 组件库</h1>
          <p>预览基础组件与常用状态，查看参数并复制 React Native 示例。</p>
        </header>
      )}
      <div className="grid-heading">
        {filtering ? <h1 id="page-title" tabIndex={-1}>搜索结果</h1> : <h2>全部组件</h2>}
        <span aria-live="polite">{matches.length} 个组件</span>
      </div>
      {!matches.length && (
        <div className="empty">
          <p>没有匹配的组件。可以试试组件名或用途。</p>
          <button type="button" onClick={clearSearch}>清空搜索</button>
        </div>
      )}
      <ul className="component-grid">
        {matches.map((demo) => {
          const { Preview } = demo.examples[0];
          return (
            <li className="tile" key={demo.name}>
              <div className="showcase"><Preview /></div>
              <a className="tile-link" href={routeFor(demo.name)}>
                <strong>{demo.name}</strong>
                <span>{demo.label}</span>
              </a>
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
  const searchRef = useRef<HTMLInputElement>(null);
  const detail = demos.find((demo) => routeFor(demo.name) === route);
  const tokens = mode === 'light' ? lightTokens : darkTokens;
  const search = query.trim().toLowerCase();
  const matches = demos.filter((demo) => [demo.name, demo.label, demo.description].some((text) =>
    text.toLowerCase().includes(search)
  ));
  const colors = {
    '--bg': tokens.bgPrimary,
    '--card': tokens.bgCard,
    '--surface': tokens.bgSecondary,
    '--text': tokens.textPrimary,
    '--subtle': tokens.textSecondary,
    '--line': tokens.cardStroke,
    '--peach': tokens.orange,
    '--pink': tokens.orange7,
  } as CSSProperties;

  useEffect(() => {
    const handleRoute = () => {
      setRoute(window.location.hash);
      setQuery('');
    };
    window.addEventListener('hashchange', handleRoute);
    return () => window.removeEventListener('hashchange', handleRoute);
  }, []);

  useEffect(() => {
    document.title = detail ? `${detail.name} | Yoroll App 组件库` : 'Yoroll App 组件库';
    window.scrollTo(0, 0);
  }, [detail]);

  const changeMode = (next: ThemeMode) => {
    setMode(next);
    try {
      localStorage.setItem('yoroll-component-theme', next);
    } catch {
      // The selected theme still applies when storage is unavailable.
    }
  };

  return (
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <YorollThemeProvider mode={mode}>
        <div className="app" data-theme={mode} style={colors}>
          <a className="skip-link" href="#page-title" onClick={(event) => {
            event.preventDefault();
            document.getElementById('page-title')?.focus();
          }}>跳到组件内容</a>
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
              <div className="search-box">
                <span className="search-icon" aria-hidden="true"><IconSearch size={17} color="currentColor" /></span>
                <input
                  ref={searchRef}
                  type="search"
                  aria-label="搜索组件"
                  placeholder="搜索组件"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                />
                {query && (
                  <button type="button" aria-label="清空搜索" onClick={() => { setQuery(''); searchRef.current?.focus(); }}>
                    <IconClose size={14} color="currentColor" />
                  </button>
                )}
              </div>
              <nav className="catalog-nav" aria-label="组件导航">
                <a className="overview-link" href="#" aria-current={!detail && !search ? 'page' : undefined} onClick={() => setQuery('')}>全部组件</a>
                {categories.map(({ id, label }) => {
                  const members = matches.filter((demo) => demo.category === id);
                  return members.length > 0 && (
                    <div className="nav-group" key={id}>
                      <p>{label}</p>
                      <ul>
                        {members.map((demo) => (
                          <li key={demo.name}>
                            <a
                              href={routeFor(demo.name)}
                              aria-current={detail === demo && !search ? 'page' : undefined}
                              onClick={() => setQuery('')}
                            >{demo.name}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </nav>
            </aside>
            <main>
              {detail && !search
                ? <ComponentDetails key={detail.name} demo={detail} />
                : <Overview matches={matches} filtering={!!search} clearSearch={() => { setQuery(''); searchRef.current?.focus(); }} />}
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
