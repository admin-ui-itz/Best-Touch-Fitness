"use client";

import { createElement, useCallback, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  as?: "div" | "section" | "article" | "li" | "figure";
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
  id?: string;
};

/**
 * Subtle entrance transition driven by IntersectionObserver.
 * CSS (globals.css) only hides content when html[data-js] is set and honours
 * prefers-reduced-motion, so this is purely progressive enhancement.
 */
export function Reveal({ as: Tag = "div", children, className, delay = 0, id }: RevealProps) {
  // Callback ref (React 19 supports returning a cleanup) so no ref object is
  // read during render and the observer is tied to the element's lifetime.
  const ref = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.inview = "true";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.inview = "true";
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;

  return createElement(Tag, { ref, "data-reveal": "", className, style, id }, children);
}
