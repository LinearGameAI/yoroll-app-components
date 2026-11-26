import { useState } from 'react';
import { darkTokens, lightTokens, useTheme } from '../src';
import { ArtworkInventory, inventoryArtwork } from './assets';
import { CopyButton, DirectoryHeading, Segmented, SourceLink } from './controls';
import type { Inventory } from './inventoryData';

const sections = [
  { key: 'source', label: '组件与样式', href: '#app' },
  { key: 'typography', label: '字体与字号', href: '#app-typography' },
  { key: 'assets', label: '素材图库', href: '#app-assets' },
  { key: 'motion', label: '动效调用', href: '#app-motion' },
] as const;
export type InventoryView = typeof sections[number]['key'];
const sourceGroups = [
  { key: 'all', label: '全部' }, { key: 'shared', label: '共享组件' },
  { key: 'route', label: '路由' }, { key: 'feature', label: '业务 UI' }, { key: 'native', label: '原生' },
] as const;
const typographyProps = new Set(['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing']);
const initialLimit = 36;

function matchesQuery(query: string, values: string[]) {
  const keywords = query.trim().toLowerCase().split(/\s+/);
  const combined = values.join(' ').toLowerCase();
  return keywords.every((keyword) => combined.includes(keyword));
}

function normalizedColor(value: string) {
  const text = value.trim().replace(/^['"]|['"]$/g, '').replace(/\s+/g, '').toLowerCase();
  if (/^#[\da-f]{3,4}$/.test(text)) return '#' + [...text.slice(1)].map((digit) => digit + digit).join('');
  const rgb = /^(rgba?)\(([\d.,]+)\)$/.exec(text);
  if (rgb) return `${rgb[1]}(${rgb[2].split(',').map(Number).join(',')})`;
  if (text === 'white') return '#ffffff';
  if (text === 'black') return '#000000';
  return text;
}

function MoreResults({ count, limit, onMore }: { count: number; limit: number; onMore: () => void }) {
  if (!count) return <p className="empty">没有匹配的记录。</p>;
  return count > limit ? <button className="directory-more" type="button" onClick={onMore}>显示更多</button> : null;
}

function SourceView({ inventory }: { inventory: Inventory }) {
  const { mode } = useTheme();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<typeof sourceGroups[number]['key']>('all');
  const [limit, setLimit] = useState(initialLimit);
  const { revision, sources } = inventory;
  const colors = inventory.themeColors[mode];
  const tokensByValue = new Map<string, string[]>();
  for (const [name, value] of Object.entries(colors)) {
    const key = normalizedColor(value);
    tokensByValue.set(key, [...(tokensByValue.get(key) ?? []), name]);
  }
  const shown = sources.filter((source) => (group === 'all' || source.group === group) && matchesQuery(query, [
    source.path, ...source.components.map((component) => component.name), ...source.tokens, ...source.icons, ...source.assets,
    ...source.styles.flatMap((style) => style.values.map((pair) => pair.name + ' ' + pair.value)),
  ]));
  return (
    <>
      <div className="directory-toolbar">
        <input type="search" aria-label="搜索 App 源码" placeholder="搜索组件、文件、样式或 Token" value={query} onChange={(e) => { setQuery(e.currentTarget.value); setLimit(initialLimit); }} />
        <Segmented items={sourceGroups} value={group} onChange={(value) => { setGroup(value); setLimit(initialLimit); }} label="App UI 类型" />
      </div>
      <p className="directory-count" aria-live="polite">{shown.length} 个文件</p>
      <div className="index-list">
        {shown.slice(0, limit).map((source) => (
          <details className="index-entry" key={source.path}>
            <summary><strong>{source.components[0]?.name ?? source.path.split('/').at(-1)}</strong><code>{source.path}</code></summary>
            <div className="index-content">
              <div className="reference-title">
                <SourceLink path={source.path} revision={revision}>打开源码</SourceLink>
                <CopyButton code={source.path} label="复制路径" />
              </div>
              {source.components.length > 0 && <div className="index-chips">
                {source.components.map(({ name, line }) => <SourceLink key={line + name} path={source.path} line={line} revision={revision}>{name}</SourceLink>)}
              </div>}
              {source.tokens.length > 0 && <div>
                <h3>引用的主题 Token</h3>
                <div className="index-chips">
                  {source.tokens.map((name) => <code key={name}>{name} {colors[name]}</code>)}
                </div>
              </div>}
              {source.icons.length > 0 && <div><h3>图标</h3><div className="index-chips">{source.icons.map((name) => <code key={name}>{name}</code>)}</div></div>}
              {source.assets.length > 0 && <div>
                <h3>引用的图素</h3>
                <ul className="source-files">{source.assets.map((path) => (
                  <li key={path}><SourceLink path={path} revision={revision}>{path}</SourceLink></li>
                ))}</ul>
              </div>}
              {source.styles.length > 0 && <div>
                <h3>样式与布局</h3>
                <div className="spec-list">
                  {source.styles.map(({ name, line, values }, index) => (
                    <div key={line + name + index}>
                      <SourceLink path={source.path} revision={revision} line={line}>{name} · L{line}</SourceLink>
                      <code>{values.map(({ name, value }) => {
                        const exactMatches = tokensByValue.get(normalizedColor(value));
                        return `${name}: ${value}${exactMatches ? `（等值 ${exactMatches.join(' / ')}）` : ''}`;
                      }).join(' · ')}</code>
                    </div>
                  ))}
                </div>
              </div>}
            </div>
          </details>
        ))}
      </div>
      <MoreResults count={shown.length} limit={limit} onMore={() => setLimit(limit + initialLimit)} />
    </>
  );
}

function TypographyView({ inventory }: { inventory: Inventory }) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(initialLimit);
  const shown = inventory.sources.flatMap(({ path, styles }) => styles.flatMap((style) => {
    const values = style.values.filter(({ name }) => typographyProps.has(name));
    return values.length && matchesQuery(query, [path, style.name, ...values.map(({ name, value }) => name + ' ' + value)])
      ? [{ path, name: style.name, line: style.line, values }] : [];
  }));
  return (
    <>
      <div className="directory-toolbar">
        <input type="search" aria-label="搜索 App 排版" placeholder="搜索文件、字族、字号或行高" value={query} onChange={(event) => {
          setQuery(event.currentTarget.value);
          setLimit(initialLimit);
        }} />
        <a className="inline-source" href="#tokens/typography">查看字级与 Token 映射</a>
      </div>
      <p className="directory-count" aria-live="polite">{shown.length} 处排版样式</p>
      <div className="index-list">
        {shown.slice(0, limit).map(({ path, name, line, values }, index) => (
          <article className="index-entry index-content" key={path + line + index}>
            <div className="reference-title"><code>{name}</code><SourceLink path={path} line={line} revision={inventory.revision}>L{line}</SourceLink></div>
            <code className="source-path">{path}</code>
            <div className="index-chips">
              {values.map(({ name, value }, index) => <code key={name + index}>{name}: {value}</code>)}
            </div>
          </article>
        ))}
      </div>
      <MoreResults count={shown.length} limit={limit} onMore={() => setLimit(limit + initialLimit)} />
    </>
  );
}

function MotionView({ inventory }: { inventory: Inventory }) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(initialLimit);
  const shown = inventory.sources.flatMap((source) => source.motions
    .filter((motion) => matchesQuery(query, [source.path, motion.api,
      ...motion.settings.map((pair) => pair.name + ' ' + pair.value)]))
    .map((motion) => ({ path: source.path, ...motion })));
  return (
    <>
      <div className="directory-toolbar">
        <input type="search" aria-label="搜索 App 动效" placeholder="搜索文件、API、时长或缓动" value={query} onChange={(e) => { setQuery(e.currentTarget.value); setLimit(initialLimit); }} />
      </div>
      <p className="directory-count" aria-live="polite">{shown.length} 处动效调用</p>
      <div className="index-list">
        {shown.slice(0, limit).map(({ path, api, line, settings }, index) => (
          <article className="index-entry index-content" key={path + line + index}>
            <div className="reference-title"><code>{api}</code><SourceLink path={path} line={line} revision={inventory.revision}>L{line}</SourceLink></div>
            <code className="source-path">{path}</code>
            {!!settings.length && <div className="index-chips">
              {settings.map(({ name, value }, index) => <code key={name + index}>{name}: {value}</code>)}
            </div>}
          </article>
        ))}
      </div>
      <MoreResults count={shown.length} limit={limit} onMore={() => setLimit(limit + initialLimit)} />
    </>
  );
}

export function AppInventoryPage({ view, inventory, assetFamily }: { view: InventoryView; inventory: Inventory | null; assetFamily?: string }) {
  const tokenDrift = inventory && (['dark', 'light'] as const).flatMap((mode) => {
    const library: Record<string, string> = mode === 'dark' ? darkTokens : lightTokens;
    return [...new Set([...Object.keys(library), ...Object.keys(inventory.themeColors[mode])])]
      .filter((key) => library[key] !== inventory.themeColors[mode][key])
      .map((key) => `${mode}.${key}`);
  });
  return (
    <>
      <DirectoryHeading title={view === 'assets' ? 'App 素材图库' : 'App 完整索引'} action={view === 'assets'
        ? <a className="inline-source" href="#assets/styles">视觉风格与延展提示词</a> : undefined}>
        {inventory ? <>当前 checkout <code>{inventory.revision.slice(0, 8)}</code>{inventory.changed ? ' · 含工作区修改' : ''}。{view === 'assets'
          ? '素材原图、使用位置和已归档的生成提示词。'
          : '浏览组件源码、排版、样式、图素和动效调用。'}</> : '从当前 App checkout 读取目录。'}
      </DirectoryHeading>
      <nav className="directory-tabs" aria-label="App 索引内容">
        {sections.map((section) => <a key={section.key} href={section.href} aria-current={view === section.key ? 'page' : undefined}>{section.label}</a>)}
      </nav>
      {!inventory && <p className="empty" role="alert">索引加载失败。请重新从 App checkout 生成。</p>}
      {inventory && (
        <>
          {(inventory.missing.length > 0) && <p className="directory-note">{inventory.missing.length} 个源码文件在当前 checkout 缺失。</p>}
          {!!tokenDrift?.length && <p className="directory-note">当前 checkout 与组件库的 Token 差异 · {tokenDrift.join('、')}</p>}
          {view === 'source' && <SourceView inventory={inventory} />}
          {view === 'typography' && <TypographyView inventory={inventory} />}
          {view === 'assets' && <ArtworkInventory assets={inventoryArtwork(inventory)} route="#app-assets" family={assetFamily} revision={inventory.revision} />}
          {view === 'motion' && <MotionView inventory={inventory} />}
        </>
      )}
    </>
  );
}
