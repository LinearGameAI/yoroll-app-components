import { useEffect, useRef, type ReactNode } from 'react';
import { IconBackward } from '@yoroll/rn-icon';
import { useTheme } from '../src';
import { publicOriginal } from './assets';
import { BlockCard, blocks } from './docs';
import { catalogExample } from './demos';
import type { Inventory } from './inventoryData';

const heroArtwork = 'assets/membership/credit-pack-mark.webp';
const guideArtwork = [
  'assets/profile/membership-crown-v2.webp',
  'assets/membership/treat-packs/treat-pile-v1.webp',
  'assets/chat-models/fox-v1.webp',
];
const ButtonPreview = catalogExample('components/button-variants').Preview;
const TabsPreview = catalogExample('components/tabs-segment').Preview;
const PlayPreview = catalogExample('components/play-pill').Preview;
const ProfilePreview = blocks[0].Preview;

function LinkArrow() {
  return <span className="home-arrow" aria-hidden="true"><IconBackward size={15} color="currentColor" /></span>;
}

function artworkUrl(path: string, inventory: Inventory | null) {
  return inventory ? inventory.assets.find((asset) => asset.path === path)?.previewUrl : publicOriginal(path);
}

function drawLight(context: CanvasRenderingContext2D, width: number, height: number, seconds: number) {
  context.clearRect(0, 0, width, height);
  const color = context.createLinearGradient(width * .04, height * .92, width, height * .15);
  color.addColorStop(0, 'rgba(255, 134, 82, 0)');
  color.addColorStop(.22, 'rgba(255, 134, 82, .49)');
  color.addColorStop(.57, 'rgba(255, 174, 148, .57)');
  color.addColorStop(.82, 'rgba(224, 168, 251, .52)');
  color.addColorStop(1, 'rgba(175, 123, 225, 0)');
  context.strokeStyle = color;
  context.lineWidth = .8;

  for (let i = 0; i < 33; i += 1) {
    const spread = i / 32;
    const drift = Math.sin(seconds * .64 + spread * 4.7) * .039;
    context.globalAlpha = .33 + .60 * Math.sin(Math.PI * spread);
    context.beginPath();
    context.moveTo(-width * .10, height * (.79 + spread * .19));
    context.bezierCurveTo(
      width * (.29 + spread * .11), height * (.87 + spread * .13),
      width * (.37 - spread * .07), height * (.26 + spread * .29),
      width * (.60 + spread * .015), height * (.40 + spread * .05 + drift),
    );
    context.bezierCurveTo(
      width * (.83 + spread * .04), height * (.53 + spread * .06 + drift),
      width * (.86 - spread * .10), height * (.17 + spread * .14),
      width * 1.06, height * (.11 + spread * .35),
    );
    context.stroke();
  }
  context.globalAlpha = 1;
}

function HeroLight() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const surface = canvas.current;
    const context = surface?.getContext('2d');
    if (!surface || !context) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let visible = true;
    let frame = 0;
    let lastDraw = 0;
    const paint = (time: number) => {
      if (width && height) drawLight(context, width, height, time / 1000);
    };
    const tick = (time: number) => {
      if (time - lastDraw >= 33) {
        paint(time);
        lastDraw = time;
      }
      frame = window.requestAnimationFrame(tick);
    };
    const sync = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      if (reduced.matches) paint(0);
      else if (visible) frame = window.requestAnimationFrame(tick);
    };
    const resize = () => {
      width = surface.clientWidth;
      height = surface.clientHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.round(width * scale);
      surface.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      paint(reduced.matches ? 0 : performance.now());
    };
    const size = new ResizeObserver(resize);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    resize();
    size.observe(surface);
    visibility.observe(surface);
    reduced.addEventListener('change', sync);
    sync();
    return () => {
      window.cancelAnimationFrame(frame);
      size.disconnect();
      visibility.disconnect();
      reduced.removeEventListener('change', sync);
    };
  }, []);

  return <canvas ref={canvas} className="home-hero-light" aria-hidden="true" />;
}

function HomePreview({ kind, label, href, children }: { kind: string; label: string; href: string; children: ReactNode }) {
  return (
    <article className={`home-preview home-preview-${kind}`}>
      <a className="home-preview-link" href={href}>{label} <LinkArrow /></a>
      <div className="home-preview-content">{children}</div>
    </article>
  );
}

function HomeHero({ inventory }: { inventory: Inventory | null }) {
  const { tokens } = useTheme();
  const image = artworkUrl(heroArtwork, inventory);
  return (
    <section className="home-hero" aria-labelledby="page-title">
      <div className="home-hero-art" aria-hidden="true">
        <div className="home-hero-glow" />
        <HeroLight />
      </div>
      <header className="home-hero-copy">
        <div>
          <p className="home-platform">React Native · Expo</p>
          <h1 id="page-title" tabIndex={-1}>Yoroll App <span>组件库</span></h1>
          <p className="home-lede">试用 App 组件，查阅设计 Token 与图素。</p>
        </div>
        <div className="home-actions">
          <a className="home-action home-action-primary" href="#components">浏览组件 <LinkArrow /></a>
          <a className="home-action" href="#start">接入指南</a>
          {inventory && <a className="home-action" href="#app">App 索引</a>}
        </div>
      </header>
      <div className="home-hero-previews" role="group" aria-label="交互预览">
        <HomePreview kind="buttons" label="按钮" href="#ybutton"><ButtonPreview /></HomePreview>
        <HomePreview kind="tabs" label="页签" href="#ytab"><TabsPreview /></HomePreview>
        <HomePreview kind="profile" label="资料表单" href="#blocks/profile-form"><ProfilePreview /></HomePreview>
        <HomePreview kind="play" label="播放按钮" href="#yplaypill"><PlayPreview /></HomePreview>
        <div className="home-preview-accent">
          {image && <a className="home-hero-image" href="#assets/rewards" aria-label="浏览糖果、任务与奖励图素">
            <img src={image} alt="" width={512} height={512} />
          </a>}
          <div className="home-hero-palette" aria-label="品牌色 Token">
            {(['orange', 'orange7'] as const).map((token) => (
              <a href={`#tokens/${token}`} key={token}>
                <span aria-hidden="true" style={{ background: tokens[token] }} />
                <code>{token}</code>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DesignGuides({ inventory }: { inventory: Inventory | null }) {
  const { tokens } = useTheme();
  return (
    <section className="home-section" aria-labelledby="home-design">
      <div className="home-section-title"><h2 id="home-design">设计规范</h2></div>
      <div className="home-guide-grid">
        <a className="home-guide home-guide-tokens" href="#tokens">
          <div className="home-guide-visual home-type-art" aria-hidden="true">
            <span>Aa</span>
            <div>{[tokens.orange, tokens.orange7, tokens.orange2, tokens.textPrimary, tokens.bgTertiary].map((color) => (
              <i key={color} style={{ background: color }} />
            ))}</div>
          </div>
          <div className="home-guide-text"><div><strong>设计 Token</strong><p>色彩、字体与字号、尺寸、渐变与阴影</p></div><LinkArrow /></div>
        </a>
        <a className="home-guide home-guide-motion" href="#motion">
          <div className="home-guide-visual home-motion-art" aria-hidden="true">
            <div className="home-motion-trail">{Array.from({ length: 5 }, (_, index) => <i key={index} />)}</div>
          </div>
          <div className="home-guide-text"><div><strong>动效</strong><p>时长、缓动与可播放示意</p></div><LinkArrow /></div>
        </a>
        <a className="home-guide home-guide-art" href="#assets">
          <div className="home-guide-visual home-gallery-art" aria-hidden="true">
            {guideArtwork.map((path) => {
              const url = artworkUrl(path, inventory);
              return url && <img key={path} src={url} alt="" width={126} height={126} loading="lazy" decoding="async" />;
            })}
          </div>
          <div className="home-guide-text"><div><strong>图素</strong><p>App 素材原图、风格与生成提示词</p></div><LinkArrow /></div>
        </a>
      </div>
    </section>
  );
}

export function DocsHome({ inventory }: { inventory: Inventory | null }) {
  return (
    <>
      <HomeHero inventory={inventory} />
      <section className="home-section" aria-labelledby="home-examples">
        <div className="home-section-title">
          <h2 id="home-examples">组合示例</h2>
          <a className="home-section-link" href="#blocks">查看全部组合 <LinkArrow /></a>
        </div>
        <div className="block-grid home-block-grid">{blocks.slice(1).map((block) => <BlockCard block={block} key={block.id} />)}</div>
      </section>
      <DesignGuides inventory={inventory} />
    </>
  );
}
