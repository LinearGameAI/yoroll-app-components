import { useState } from 'react';
import { IconBackward, IconCheck } from '@yoroll/rn-icon';
import { useTheme } from '../src';
import { publicOriginal } from './assets';
import type { Inventory } from './inventoryData';

const heroArtwork = './homepage/material-study.webp';
const brandAccent = 'assets/membership/credit-pack-mark.webp';
const swatches = [
  { token: 'orange', label: '橙色' },
  { token: 'orange7', label: '粉色' },
  { token: 'orange2', label: '浅桃色' },
] as const;
const tabOptions = ['精选', '收藏', '最近'] as const;

function LinkArrow() {
  return <span className="home-arrow" aria-hidden="true"><IconBackward size={15} color="currentColor" /></span>;
}

function ButtonSample() {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <article className="home-slot home-slot-buttons">
      <h2>按钮</h2>
      <div className="home-sample-actions">
        <button type="button" onClick={() => setConfirmed(true)} aria-pressed={confirmed} className="home-sample-confirm">
          {confirmed && <IconCheck size={15} color="currentColor" />}
          {confirmed ? '已确认' : '确认'}
        </button>
        <button type="button" onClick={() => setConfirmed(false)} className="home-sample-reset">重置</button>
      </div>
    </article>
  );
}

function ColorSample() {
  const { tokens } = useTheme();
  const [selected, setSelected] = useState<(typeof swatches)[number]['token']>('orange');
  return (
    <article className="home-slot home-slot-colors">
      <h2>配色</h2>
      <div className="home-swatches" role="group" aria-label="配色示意">
        {swatches.map(({ token, label }) => (
          <button type="button" key={token} aria-label={label} aria-pressed={selected === token} onClick={() => setSelected(token)}
            style={{ background: tokens[token] }}>
            {selected === token && <IconCheck size={16} color="#272023" />}
          </button>
        ))}
      </div>
      <a className="home-color-value" href={`#tokens/${selected}`}>
        <code>{selected}</code><code>{tokens[selected]}</code>
      </a>
    </article>
  );
}

function TabSample() {
  const [active, setActive] = useState<(typeof tabOptions)[number]>('精选');
  return (
    <article className="home-slot home-slot-tabs">
      <h2>页签</h2>
      <div className="home-sample-tabs" role="group" aria-label="页签示意">
        {tabOptions.map((label) => (
          <button type="button" key={label} aria-pressed={active === label} onClick={() => setActive(label)}>{label}</button>
        ))}
      </div>
    </article>
  );
}

function MotionSample() {
  const [run, setRun] = useState(0);
  return (
    <article className="home-slot home-slot-motion">
      <div className="home-slot-heading">
        <h2>动效</h2>
        <button type="button" className="home-motion-play" aria-label="播放动效示意" onClick={() => setRun((current) => current + 1)}>
          播放
        </button>
      </div>
      <div className="home-motion-path" aria-hidden="true">
        <i /><i /><i /><i />
        <span key={run} className={run ? 'home-motion-playing' : undefined} />
      </div>
    </article>
  );
}

function HomeShowcase({ inventory }: { inventory: Inventory | null }) {
  const accent = inventory ? inventory.assets.find((asset) => asset.path === brandAccent)?.previewUrl : publicOriginal(brandAccent);
  return (
    <section className="home-showcase" aria-label="首页展示占位">
      <div className="home-board">
        <a className="home-board-art" href="#assets">
          <img src={heroArtwork} alt="" width={1440} height={960} fetchPriority="high" />
          <div className="home-art-caption">
            <div><h2>视觉素材</h2><p>材质与配色示意</p></div>
            <span className="home-art-link"><LinkArrow /></span>
          </div>
        </a>
        <div className="home-board-column home-board-left">
          <ButtonSample />
          <ColorSample />
        </div>
        <div className="home-board-column home-board-right">
          <TabSample />
          <MotionSample />
        </div>
      </div>
      <div className="home-showcase-footer">
        <div className="home-showcase-caption">
          {accent && <a href="#assets/rewards" aria-label="浏览糖果、任务与奖励图素"><img src={accent} alt="" width={32} height={32} /></a>}
          <span>展示占位</span>
        </div>
        <a className="home-section-link" href="#blocks">查看组合示例 <LinkArrow /></a>
      </div>
    </section>
  );
}

const resourceLinks = [
  { href: '#tokens', title: '设计 Token', description: '色彩、字体与字号、尺寸、渐变与阴影' },
  { href: '#motion', title: '动效', description: '时长、缓动与可播放示意' },
  { href: '#assets', title: '图素', description: 'App 原图、风格与生成提示词' },
];

export function DocsHome({ inventory }: { inventory: Inventory | null }) {
  return (
    <>
      <header className="home-intro">
        <p className="home-platform">React Native · Expo</p>
        <h1 id="page-title" tabIndex={-1}>Yoroll App <span>组件库</span></h1>
        <p className="home-lede">组件、设计 Token、动效与图素。</p>
        <div className="home-actions">
          <a className="home-action home-action-primary" href="#components">浏览组件 <LinkArrow /></a>
          <a className="home-action" href="#pages">按 App 页面查找</a>
          {inventory && <a className="home-action" href="#app">App 索引</a>}
        </div>
      </header>
      <HomeShowcase inventory={inventory} />
      <section className="home-resources" aria-labelledby="home-design">
        <h2 id="home-design">设计规范</h2>
        <div className="home-resource-grid">
          {resourceLinks.map(({ href, title, description }) => (
            <a key={href} className="home-resource" href={href}>
              <div><strong>{title}</strong><p>{description}</p></div><LinkArrow />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
