import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { IconAngleright, IconSearch } from '@yoroll/rn-icon';
import { screenExamples } from 'app-page-recipes';
import { DirectoryHeading, Segmented, SourceLink } from './controls';
import { CodeBlock, routeFor } from './docs';
import { ScreenComposition } from './examples/screens/screen-composition';
import type { ScreenState } from './examples/screens/screenModel';
import { availablePreviewStates, componentsForPage, componentsForPart, findPage, pageEntries, pageGroups, pageHref, pageKinds, sourceRevision, type PageEntry } from './pageData';
import './pages.css';

declare const __APP_INVENTORY__: boolean;
const previewStates = [
  { key: 'ready', label: '正常' }, { key: 'loading', label: '加载' }, { key: 'empty', label: '空态' }, { key: 'error', label: '失败' },
] as const;
const views = [{ key: 'preview', label: '交互预览' }, { key: 'code', label: '代码' }] as const;
const filters = [{ key: 'all', label: '全部' }, { key: 'screens', label: '产品页面' }, { key: 'structure', label: '其他路由' }] as const;
const productCount = pageEntries.filter((entry) => entry.kind === 'screen').length;

function ComponentLinks({ names }: { names: string[] }) {
  return <div className="page-component-links">
    {names.map((name) => <a key={name} href={routeFor(name)}><code>{name}</code></a>)}
  </div>;
}

export function PagesDirectory() {
  const [group, setGroup] = useState('all');
  const [filter, setFilter] = useState<typeof filters[number]['key']>('all');
  const [query, setQuery] = useState('');
  const matches = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return pageEntries.filter((entry) => {
      if (group !== 'all' && entry.group !== group) return false;
      if (filter === 'screens' && entry.kind !== 'screen' || filter === 'structure' && entry.kind === 'screen') return false;
      const haystack = [entry.title, entry.route, entry.source[0], ...componentsForPage(entry),
        ...(entry.parts ?? []).map(({ part }) => part.label), ...(entry.states ?? [])].join(' ').toLowerCase();
      return words.every((word) => haystack.includes(word));
    });
  }, [filter, group, query]);

  return <>
    <DirectoryHeading title="App 页面索引" action={<span className="directory-count" aria-live="polite">{matches.length} / {pageEntries.length} 个路由</span>}>
      从 {productCount} 个产品页面查到交互预览、组件和 App 源码。复用入口会指向共用的页面。
    </DirectoryHeading>
    <div className="page-filter">
      <label className="search-box page-search">
        <span className="search-icon" aria-hidden="true"><IconSearch size={17} color="currentColor" /></span>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
          aria-label="搜索 App 页面" placeholder="搜索页面、组件或路由" />
      </label>
      <select aria-label="页面分组" value={group} onChange={(event) => setGroup(event.target.value)}>
        <option value="all">全部分组</option>
        {pageGroups.map(({ id, label }) => <option value={id} key={id}>{label}</option>)}
      </select>
      <Segmented items={filters} value={filter} onChange={setFilter} label="路由类型" />
    </div>
    {!matches.length && <div className="empty"><p>没有匹配的页面。</p>
      <button type="button" onClick={() => { setQuery(''); setGroup('all'); setFilter('all'); }}>清空筛选</button></div>}
    {pageGroups.map(({ id, label }) => {
      const entries = matches.filter((entry) => entry.group === id);
      if (!entries.length) return null;
      return <section className="page-group" key={id}>
        <h2>{label}</h2>
        <ul className="page-grid">{entries.map((entry) => <li key={entry.id}>
          <a className="page-tile" href={pageHref(entry.id)}>
            <span className="page-tile-label">{pageKinds[entry.kind]}{entry.target ? <span> · {findPage(entry.target)?.title}</span> : null}</span>
            <strong>{entry.title}</strong>
            <code>{entry.route}</code>
            <span className="page-tile-arrow" aria-hidden="true"><IconAngleright size={16} color="currentColor" /></span>
          </a>
        </li>)}</ul>
      </section>;
    })}
  </>;
}

const phoneSize = { width: 375, height: 812 };
const phoneFrameStyle = {
  width: 'min(100%, ' + phoneSize.width + 'px)',
  aspectRatio: phoneSize.width + ' / ' + phoneSize.height,
};

function PhonePreview({ label, children }: { label: string; children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const resize = (width: number) => setScale(width / phoneSize.width);
    resize(frame.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => resize(entry.contentRect.width));
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className="page-phone" role="group" aria-label={label} style={phoneFrameStyle}>
      <div className="page-phone-viewport" style={{ ...phoneSize, transform: 'scale(' + scale + ')' }}>
        {children}
      </div>
    </div>
  );
}

function PagePreview({ entry }: { entry: PageEntry }) {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [state, setState] = useState<ScreenState>('ready');
  const available = availablePreviewStates(entry);
  const states = previewStates.filter(({ key }) => available[key]);
  const example = screenExamples[entry.id];
  if (!example) return null;
  return <section className="page-preview" aria-labelledby="page-preview-title">
    <h2 id="page-preview-title">页面组合</h2>
    <div className="preview-panel">
      <div className="preview-toolbar">
        <Segmented items={views} value={view} onChange={setView} label="页面示例视图" />
      </div>
      {view === 'preview' ? <>
        {states.length > 1 && <div className="page-state-controls">
          <Segmented items={states} value={state} onChange={setState} label="预览页面状态" />
        </div>}
        <div className="page-stage">
          <PhonePreview label={entry.title + '页面预览'}>
            <ScreenComposition recipe={example.recipe} state={state} artworkBase={__APP_INVENTORY__ ? undefined : './artwork/originals/assets/'} uiBase="./app-ui/"
              onBack={() => { window.location.hash = '#pages'; }} onNavigateTab={(id) => { window.location.hash = pageHref(id); }}
              onReset={() => setState('ready')} />
          </PhonePreview>
        </div>
      </> : <div className="page-preview-code">
        <p>下载示例及其页面组合文件，可在 React Native 项目内复用。</p>
        <CodeBlock code={example.code} />
      </div>}
    </div>
    <div className="doc-links"><a className="inline-source" href={'./r/page-' + entry.id + '.json'} download>下载页面 TSX 与依赖</a></div>
  </section>;
}

function LinkedPages({ ids }: { ids: string[] }) {
  return <ul className="linked-pages">{ids.map((id) => {
    const entry = findPage(id);
    return entry ? <li key={id}><a href={pageHref(id)}>{entry.title}</a><code>{entry.route}</code></li> : null;
  })}</ul>;
}

export function PageDetails({ entry }: { entry: PageEntry }) {
  const group = pageGroups.find((item) => item.id === entry.group);
  const aliases = pageEntries.filter((item) => item.kind === 'alias' && item.target === entry.id).map((item) => item.id);
  const target = findPage(entry.target);
  const preview = Boolean(screenExamples[entry.id]);
  const names = componentsForPage(entry);
  return <>
    <div className="breadcrumb"><a href="#pages">App 页面索引</a><span aria-hidden="true">/</span><span>{group?.label}</span></div>
    <DirectoryHeading title={entry.title} action={<span className="directory-count">{pageKinds[entry.kind]}</span>}>
      {entry.note ?? (preview ? '在预览中操作组件，或打开对应的实现与参数。' : '路由入口与原始实现。')}
    </DirectoryHeading>
    <div className="page-route-meta">
      <code>{entry.route}</code>
      <SourceLink path={entry.route} revision={sourceRevision}>路由源码</SourceLink>
      {(entry.source[0] !== entry.route || entry.source[1]) &&
        <SourceLink path={entry.source[0]} line={entry.source[1]} revision={sourceRevision}>页面实现</SourceLink>}
    </div>
    {target && <section className="page-reference">
      <h2>{entry.kind === 'alias' ? '共用页面' : '跳转目标'}</h2>
      <LinkedPages ids={[target.id]} />
      <a className="inline-source" href={pageHref(target.id)}>打开{target.title}预览</a>
    </section>}
    <div className={preview ? 'page-detail-grid' : undefined}>
      {preview && <PagePreview key={entry.id} entry={entry} />}
      <div className="page-reference">
        {!!entry.states?.length && <section>
          <h2>App 中的状态</h2>
          <ul className="page-state-list">{entry.states.map((label) => <li key={label}>{label}</li>)}</ul>
        </section>}
        {!!entry.parts?.length && <section className="page-surfaces">
          <h2>界面区域与组件</h2>
          <ol>{entry.parts.map((group, index) => <li key={group.part.kind + index}>
            <div className="page-surface-title"><h3>{group.part.label}</h3>
              <SourceLink path={group.source[0]} line={group.source[1]} revision={sourceRevision}>App 实现</SourceLink></div>
            <ComponentLinks names={componentsForPart(group)} />
          </li>)}</ol>
        </section>}
        {!!names.length && <section><h2>本页组件</h2><ComponentLinks names={names} /></section>}
        {!!entry.children?.length && <section><h2>关联页面</h2><LinkedPages ids={entry.children} /></section>}
        {!!aliases.length && <section><h2>复用入口</h2><LinkedPages ids={aliases} /></section>}
      </div>
    </div>
  </>;
}
