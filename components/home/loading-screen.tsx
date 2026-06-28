"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";
import styles from "./loading-screen.module.css";

type Stage = { at: number; text: string };

const CAP = 0.9;
const MIN_VISIBLE = 800;
const HOLD = 520;
const FADE = 380;

export function LoadingScreen({
  ready,
  stages = t.home.loading.stages.guest,
}: {
  ready: boolean;
  stages?: Stage[];
}) {
  const [show] = useState(() => !ready);
  const [phase, setPhase] = useState<"running" | "done">("running");
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  const readyRef = useRef(ready);
  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  const rootRef = useRef<HTMLDivElement>(null);
  const markWrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const capRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!show) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let last = 0;
    let p = 0;
    let finished = false;
    let holdTimer = 0;
    let goneTimer = 0;
    const startedAt = performance.now();

    const captionFor = (v: number) => {
      let text = stages[0]?.text ?? "";
      for (const s of stages) if (v >= s.at) text = s.text;
      return text;
    };

    const draw = (v: number) => {
      rootRef.current?.style.setProperty("--p", String(v));
      if (pctRef.current)
        pctRef.current.textContent = String(Math.round(v * 100));
      if (capRef.current) {
        capRef.current.textContent =
          v >= 1 ? t.home.loading.ready : captionFor(v);
      }
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      draw(1);
      setPhase("done");
      holdTimer = window.setTimeout(() => setLeaving(true), HOLD);
      goneTimer = window.setTimeout(() => setGone(true), HOLD + FADE);
    };

    const frame = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const dataReady = readyRef.current && now - startedAt >= MIN_VISIBLE;
      const target = dataReady ? 1 : CAP;
      const k = dataReady ? 7 : reduce ? 6 : 1.9;
      p = target - (target - p) * Math.exp(-k * dt);
      if (dataReady && p > 0.997) p = 1;

      draw(p);
      if (p >= 1) {
        finish();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    draw(0);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(holdTimer);
      window.clearTimeout(goneTimer);
    };
  }, [show, stages]);

  useEffect(() => {
    if (!show) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const place = () => {
      const dot = dotRef.current;
      const wrap = markWrapRef.current;
      const ring = ringRef.current;
      if (!dot || !wrap || !ring) return;
      const d = dot.getBoundingClientRect();
      const w = wrap.getBoundingClientRect();
      const r = (ring.offsetWidth || 10) / 2;

      let inkCenterY = d.height * 0.72;
      if (ctx) {
        const cs = getComputedStyle(dot);
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const m = ctx.measureText(".");
        if (m.fontBoundingBoxAscent && m.actualBoundingBoxAscent != null) {
          const inkTop = m.fontBoundingBoxAscent - m.actualBoundingBoxAscent;
          const inkBottom =
            m.fontBoundingBoxAscent + (m.actualBoundingBoxDescent || 0);
          inkCenterY = (inkTop + inkBottom) / 2;
        }
      }

      ring.style.left = `${d.left - w.left + d.width / 2 - r}px`;
      ring.style.top = `${d.top - w.top + inkCenterY - r}px`;
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place).catch(() => {});
    const retry = window.setTimeout(place, 300);
    return () => {
      window.removeEventListener("resize", place);
      window.clearTimeout(retry);
    };
  }, [show]);

  useEffect(() => {
    if (!show || gone) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [show, gone]);

  if (!show || gone) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      className={cn(styles.root, styles[phase], leaving && styles.leaving)}
    >
      <span className="sr-only">{t.home.loading.a11yStatus}</span>

      <div aria-hidden="true">
        <div className={styles.ambient}>
          <div className={styles.glow} />
        </div>
        <div className={styles.vignette} />
        <div className={styles.grain} />

        <main className={styles.stage}>
          <div className={styles.loader}>
            <div className={styles.markWrap} ref={markWrapRef}>
              <div className={cn(styles.mark, styles.base)}>
                awatch<span className={styles.dot}>.</span>fun
              </div>
              <div className={cn(styles.mark, styles.bright)}>
                awatch
                <span className={styles.dot} ref={dotRef}>
                  .
                </span>
                fun
              </div>
              <span className={styles.recRing} ref={ringRef} />
              <div className={styles.playhead} />
            </div>

            <div className={styles.readout}>
              <div className={styles.track}>
                <div className={styles.fill} />
              </div>
              <div className={styles.row}>
                <span className={styles.caption} ref={capRef}>
                  {stages[0]?.text}
                </span>
                <span className={styles.pct} ref={pctRef}>
                  0
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
