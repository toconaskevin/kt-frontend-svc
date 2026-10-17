"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

type CompetencyCycleProps = {
  items: string[];
};

const SLOT_MS = 2400;
const SLIDE_MS = 800;
const ROW = 40;
const VIEW_H = 280;

export function CompetencyCycle({ items }: CompetencyCycleProps) {
  const names = items.map((item) => item.trim()).filter(Boolean);
  const count = names.length;
  const [step, setStep] = useState(count);
  const [smooth, setSmooth] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || count < 2) return;
    const id = window.setInterval(() => {
      setSmooth(true);
      setStep((current) => current + 1);
    }, SLOT_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, count]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || count < 2 || step < count * 2) return;
    let done = false;
    const snap = () => {
      if (done) return;
      done = true;
      flushSync(() => setSmooth(false));
      void el.offsetHeight;
      flushSync(() => {
        setStep((current) => (current >= count * 2 ? current - count : current));
      });
      void el.offsetHeight;
      window.requestAnimationFrame(() => setSmooth(true));
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.target === el && event.propertyName === "transform") snap();
    };
    el.addEventListener("transitionend", onEnd);
    const timeout = window.setTimeout(snap, SLIDE_MS + 80);
    return () => {
      done = true;
      el.removeEventListener("transitionend", onEnd);
      window.clearTimeout(timeout);
    };
  }, [step, count]);

  if (count === 0) return null;

  const loop = count < 2 || reduceMotion ? names : [...names, ...names, ...names];
  const y = VIEW_H / 2 - (step * ROW + ROW / 2);

  return (
    <div className="competency-cycle">
      <p className="section-kicker competency-cycle-label">Core competencies</p>
      <p className="sr-only">{names.join(", ")}</p>
      {count < 2 || reduceMotion ? (
        <ul className="competency-stack is-static">
          {names.map((name, index) => (
            <li key={name} className={index === 0 ? "is-active" : undefined}>
              <span className="competency-rail-dot" aria-hidden="true" />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="competency-rail" aria-hidden="true">
          <ol
            ref={trackRef}
            className={`competency-rail-track${smooth ? "" : " is-instant"}`}
            style={{ transform: `translateY(${y}px)` }}
          >
            {loop.map((name, index) => {
              const distance = Math.abs(index - step);
              const opacity =
                distance === 0 ? 1 : distance === 1 ? 0.7 : distance === 2 ? 0.38 : distance === 3 ? 0.16 : 0;
              return (
                <li
                  key={`${name}-${index}`}
                  className={`competency-rail-row${index === step ? " is-active" : ""}`}
                  style={{ opacity }}
                >
                  <span className="competency-rail-dot" />
                  <span className="competency-rail-label">{name}</span>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
