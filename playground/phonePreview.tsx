import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { SafeAreaFrameContext, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { OverlayViewportContext, type OverlayLayerProps } from '../src/components/overlayHost';
import { useTheme } from '../src/theme';
import './phonePreview.css';

const phoneSize = { width: 375, height: 812 };
const phoneFrame = { x: 0, y: 0, ...phoneSize };
const phoneInsets = { top: 44, right: 0, bottom: 34, left: 0 };
const phoneFrameStyle = {
  width: 'min(100%, ' + phoneSize.width + 'px)',
  aspectRatio: phoneSize.width + ' / ' + phoneSize.height,
};

const PhoneLayersContext = createContext<{
  target: HTMLDivElement | null;
  top: HTMLDivElement | null;
  register: (layer: HTMLDivElement, placement: OverlayLayerProps['placement']) => () => void;
} | null>(null);

function revealLayer(layer: HTMLDivElement, placement: OverlayLayerProps['placement']) {
  const view = window.visualViewport;
  const headerHeight = parseFloat(getComputedStyle(layer).getPropertyValue('--header-height')) || 0;
  const visibleTop = (view?.offsetTop ?? 0) + headerHeight + 12;
  const visibleBottom = (view?.offsetTop ?? 0) + (view?.height ?? window.innerHeight) - 12;
  const { top, bottom, height } = layer.getBoundingClientRect();
  if (top >= visibleTop && bottom <= visibleBottom) return;
  let offset: number;
  if (height <= visibleBottom - visibleTop) {
    offset = top < visibleTop ? top - visibleTop : bottom - visibleBottom;
  } else if (placement === 'bottom') {
    offset = bottom - visibleBottom;
  } else if (placement === 'top') {
    offset = top - visibleTop;
  } else {
    offset = (top + bottom - visibleTop - visibleBottom) / 2;
  }
  window.scrollBy({ top: offset, behavior: 'instant' });
}

function PhoneLayer({ children, label, placement, onRequestClose }: OverlayLayerProps) {
  const { target, top, register } = useContext(PhoneLayersContext)!;
  const ref = useRef<HTMLDivElement>(null);
  const active = top !== null && top === ref.current;

  useLayoutEffect(() => {
    if (ref.current) return register(ref.current, placement);
  }, [target, placement, register]);

  useLayoutEffect(() => {
    if (active) ref.current?.focus({ preventScroll: true });
  }, [active]);

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (!active || (event.key !== 'Escape' && event.key !== 'Tab')) return;
    event.stopPropagation();
    if (event.key === 'Escape') {
      event.preventDefault();
      onRequestClose();
      return;
    }
    const layer = event.currentTarget;
    const focusable = Array.from(layer.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]'))
      .filter((node) => node.tabIndex >= 0 && !node.matches(':disabled, [aria-disabled="true"]') && node.getClientRects().length);
    const first = focusable[0];
    const last = focusable.at(-1);
    const focused = document.activeElement;
    if (focused === layer || focused === (event.shiftKey ? first : last) || !focusable.length) {
      event.preventDefault();
      (event.shiftKey ? last : first)?.focus();
    }
  }

  return target && createPortal(
    <div ref={ref} className="phone-overlay-layer" role="dialog" aria-label={label} aria-modal={active || undefined} aria-hidden={!active || undefined}
      inert={!active} tabIndex={-1} onKeyDown={handleKeys}>{children}</div>,
    target,
  );
}

const overlayViewport = { height: phoneSize.height, Layer: PhoneLayer };

function PhoneStatus({ onDark }: { onDark: boolean }) {
  return <div className="phone-status" data-on-dark={onDark} aria-hidden="true">
    <span className="phone-time">9:41</span>
    <span className="phone-notch" />
    <span className="phone-status-icons">
      <span className="phone-signal"><i /><i /><i /><i /></span>
      <span className="phone-wifi" />
      <span className="phone-battery" />
    </span>
  </div>;
}

export function PhonePreview({ label, statusOverArtwork, children }: { label: string; statusOverArtwork: boolean; children: ReactNode }) {
  const { mode } = useTheme();
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const [top, setTop] = useState<HTMLDivElement | null>(null);
  const layers = useRef<HTMLDivElement[]>([]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const resize = (width: number) => setScale(width / phoneSize.width);
    resize(frame.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => resize(entry.contentRect.width));
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const register = useCallback((layer: HTMLDivElement, placement: OverlayLayerProps['placement']) => {
    const previousFocus = document.activeElement;
    const previousScroll = window.scrollY;
    revealLayer(layer, placement);
    const scrollOnOpen = window.scrollY;
    layers.current.push(layer);
    setTop(layer);
    return () => {
      const wasTop = layers.current.at(-1) === layer;
      layers.current = layers.current.filter((node) => node !== layer);
      const next = layers.current.at(-1) ?? null;
      setTop(next);
      if (!wasTop || !(previousFocus instanceof HTMLElement)) return;
      requestAnimationFrame(() => {
        const focused = document.activeElement;
        if ((layers.current.at(-1) ?? null) === next && (focused === document.body || focused === next)
          && previousFocus.isConnected && !previousFocus.closest('[inert]')) {
          previousFocus.focus({ preventScroll: true });
          if (frameRef.current?.isConnected && scrollOnOpen !== previousScroll && window.scrollY === scrollOnOpen) {
            window.scrollTo({ top: previousScroll, behavior: 'instant' });
          }
        }
      });
    };
  }, []);

  return <div ref={frameRef} className="page-phone" role="group" aria-label={label} style={phoneFrameStyle}>
    <div className="page-phone-screen">
      <div className="page-phone-viewport" style={{ ...phoneSize, transform: 'scale(' + scale + ')' }}>
        <SafeAreaFrameContext.Provider value={phoneFrame}>
          <SafeAreaInsetsContext.Provider value={phoneInsets}>
            <OverlayViewportContext.Provider value={overlayViewport}>
              <PhoneLayersContext.Provider value={{ target, top, register }}>
                <div className="phone-app" inert={top !== null} aria-hidden={top !== null || undefined}>{children}</div>
                <div ref={setTarget} className="phone-overlay-target" />
              </PhoneLayersContext.Provider>
            </OverlayViewportContext.Provider>
          </SafeAreaInsetsContext.Provider>
        </SafeAreaFrameContext.Provider>
        <PhoneStatus onDark={mode === 'dark' || statusOverArtwork} />
        <div className="phone-home-indicator" aria-hidden="true" />
      </div>
    </div>
  </div>;
}
