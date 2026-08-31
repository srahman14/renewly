// components/landing/CalculationScene.tsx

"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CalculationScene() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2200",
          scrub: 1,
          pin: true,
        },
      });

      tl
        // Initial state
        .from("[data-calc='eyebrow']", {
          y: 30,
          opacity: 0,
        })

        // Renewal date
        .from(
          "[data-calc='renewal']",
          {
            y: 60,
            opacity: 0,
            scale: 0.9,
          },
          "<0.1",
        )

        // Draw calculation line
        .from(
          "[data-calc='line']",
          {
            scaleY: 0,
            transformOrigin: "top",
          },
          "+=0.1",
        )

        // Notice window
        .from(
          "[data-calc='notice']",
          {
            x: 40,
            opacity: 0,
          },
          "-=0.1",
        )

        // Safe date
        .from(
          "[data-calc='safe']",
          {
            y: 70,
            opacity: 0,
            scale: 0.9,
          },
          "+=0.1",
        )

        // Final emphasis
        .to("[data-calc='safe']", {
          scale: 1.08,
          duration: 0.25,
        })

        .to(
          "[data-calc='label']",
          {
            opacity: 1,
            y: 0,
          },
          "<",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-navy text-paper"
    >
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-5xl">
          <div data-calc="eyebrow" className="mb-20 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/40">
              The calculation
            </p>

            <h2 className="mt-4 font-display text-4xl font-medium tracking-[-0.04em] sm:text-6xl">
              Work backwards from the date.
            </h2>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-12">
            {/* Renewal */}
            <div data-calc="renewal" className="text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/40">
                Renewal date
              </p>

              <p className="mt-3 font-mono text-3xl sm:text-5xl">Mar 14</p>

              <p className="mt-1 font-mono text-sm text-paper/40">2027</p>
            </div>

            {/* Calculation */}
            <div className="relative flex h-40 w-24 flex-col items-center justify-center">
              <div
                data-calc="line"
                className="absolute h-full w-px bg-amber-light/50"
              />

              <div
                data-calc="notice"
                className="relative z-10 rounded-full border border-amber-light/30 bg-navy px-3 py-1.5"
              >
                <span className="font-mono text-[11px] text-amber-light">
                  − 60 days
                </span>
              </div>
            </div>

            {/* Result */}
            <div
              data-calc="safe"
              className="rounded-md border border-amber-light/20 bg-paper px-6 py-7 text-ink shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)]"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40">
                Last safe date
              </p>

              <p className="mt-3 font-mono text-3xl sm:text-5xl">Jan 13</p>

              <p className="mt-1 font-mono text-sm text-ink/40">2027</p>

              <p
                data-calc="label"
                className="mt-5 font-mono text-[11px] uppercase tracking-[0.1em] text-teal"
              >
                ✓ Don&apos;t miss this date
              </p>
            </div>
          </div>

          <p className="mx-auto mt-20 max-w-xl text-center font-body text-base leading-7 text-paper/45">
            Renewly reads the notice period in your contract and works backwards
            from the renewal date to find the last day you can act.
          </p>
        </div>
      </div>
    </section>
  );
}
