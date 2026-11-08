"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { ImgProps } from "@/lib/image-loader";
import { Placeholder } from "./SanityImage";

export type HeroSlide = { img: ImgProps | null; caption?: string; position?: string };

const REDUCED = "(prefers-reduced-motion: reduce)";
const INTERVAL = 7000;
const PRELOAD_AT = 3000;

function subscribeReduced(callback: () => void) {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set([0]));
  const [choice, setChoice] = useState<"play" | "pause" | null>(null);
  const [held, setHeld] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );

  const playing = count > 1 && (choice ? choice === "play" : !reduced);

  const load = useCallback(
    (...slideIndexes: number[]) =>
      setLoaded((current) => new Set([...current, ...slideIndexes.map((i) => (i + count) % count)])),
    [count],
  );

  const go = useCallback(
    (next: number) => {
      setIndex((next + count) % count);
      load(next, next + 1);
    },
    [count, load],
  );

  useEffect(() => {
    if (!playing || held) return;
    const preload = setTimeout(() => load(index + 1), PRELOAD_AT);
    const advance = setTimeout(() => go(index + 1), INTERVAL);
    return () => {
      clearTimeout(preload);
      clearTimeout(advance);
    };
  }, [playing, held, index, go, load]);

  const caption = slides[index]?.caption;
  const buttonClass = "flex h-11 w-11 items-center justify-center hover:bg-burgundy";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Photographs of our work"
      className="relative h-[68svh] overflow-hidden bg-forest lg:h-[min(92svh,60rem)]"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div aria-live={playing ? "off" : "polite"} className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            {slide.img
              ? loaded.has(i) && (
                  <img
                    {...slide.img}
                    alt={slide.img.alt}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : undefined}
                    decoding={i === 0 ? "sync" : "async"}
                    className="h-full w-full object-cover"
                    style={slide.position ? { objectPosition: slide.position } : undefined}
                  />
                )
              : <Placeholder tone={1} className="h-full w-full" />}
          </div>
        ))}
      </div>

      {(count > 1 || caption) && (
        <div className="absolute bottom-16 right-0 z-10 flex items-center bg-ink text-ivory lg:bottom-0">
          {caption && <p className="hidden max-w-xs truncate px-4 text-sm sm:block">{caption}</p>}
          {count > 1 && (
            <>
              <button type="button" className={buttonClass} aria-label="Previous photograph" onClick={() => go(index - 1)}>
                <svg aria-hidden="true" viewBox="0 0 8 14" className="h-3.5 w-2 fill-none stroke-current stroke-[1.5]"><path d="M7 1 1 7l6 6" /></svg>
              </button>
              <ul className="flex">
                {slides.map((_, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      className="flex h-11 w-6 items-center justify-center"
                      aria-label={`Show photograph ${i + 1}`}
                      aria-current={i === index ? "true" : undefined}
                      onClick={() => go(i)}
                    >
                      <span className={`block h-2 w-2 border border-ivory ${i === index ? "bg-ivory" : ""}`} />
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className={buttonClass} aria-label="Next photograph" onClick={() => go(index + 1)}>
                <svg aria-hidden="true" viewBox="0 0 8 14" className="h-3.5 w-2 fill-none stroke-current stroke-[1.5]"><path d="m1 1 6 6-6 6" /></svg>
              </button>
              <button
                type="button"
                className={buttonClass}
                aria-label={playing ? "Pause automatic slideshow" : "Play automatic slideshow"}
                onClick={() => setChoice(playing ? "pause" : "play")}
              >
                <svg aria-hidden="true" viewBox="0 0 12 14" className="h-3.5 w-3 fill-current">
                  {playing ? <path d="M1 0h3.5v14H1zM7.5 0H11v14H7.5z" /> : <path d="M1 0l11 7-11 7z" />}
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
