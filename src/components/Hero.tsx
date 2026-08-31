"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContractCard } from "../components/landing/ContractCard";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, mobile, reduceMotion } = context.conditions!;

          // =========================================
          // REDUCED MOTION
          // =========================================

          if (reduceMotion) {
            gsap.set("[data-hero='statement']", {
              opacity: 1,
              y: 0,
            });

            gsap.set("[data-hero='container']", {
              opacity: 1,
              scale: 1,
            });

            gsap.set("[data-hero='card']", {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            });

            gsap.set("[data-hero='stage-copy']", {
              opacity: 1,
              x: 0,
            });

            return;
          }

          // =========================================
          // DESKTOP
          // =========================================

          if (desktop) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,

                start: "top top",

                /*
                 * IMPORTANT
                 *
                 * We are deliberately ending the animation
                 * before the very end of the Hero.
                 *
                 * This prevents the completed scene from
                 * sitting there for another 1–2 seconds.
                 */
                end: "65% top",

                scrub: 0.7,
              },
            });

            // =========================================
            // INITIAL STATES
            // =========================================

            gsap.set("[data-hero='statement']", {
              opacity: 0,
              y: 30,
            });

            gsap.set("[data-hero='container']", {
              opacity: 0,
              scale: 0.96,
            });

            gsap.set("[data-hero='card']", {
              opacity: 0,
              x: 0,
              y: -500,
              scale: 0.96,
            });

            gsap.set("[data-hero='stage-copy']", {
              opacity: 0,
              x: -35,
            });

            // =========================================
            // 1. OPENING STATEMENT
            // =========================================

            tl.to("[data-hero='statement']", {
              opacity: 1,
              y: 0,
              duration: 0.22,
              ease: "power2.out",
            });

            // =========================================
            // 2. BREATHING ROOM
            // =========================================

            tl.to(
              {},
              {
                duration: 0.1,
              },
            );

            // =========================================
            // 3. GREEN CONTAINER
            // =========================================

            tl.to("[data-hero='container']", {
              opacity: 1,
              scale: 1,
              duration: 0.16,
              ease: "power3.out",
            });

            // =========================================
            // 4. CARD FALL
            // =========================================
            //
            // The card takes most of the animation time
            // to travel down.
            //
            // This is what makes it feel deliberate rather
            // than like it instantly appears.
            // =========================================

            tl.to("[data-hero='card']", {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.69,
              ease: "power3.inOut",
            });

            // =========================================
            // 5. CARD STARTS LANDING
            // =========================================
            //
            // IMPORTANT:
            //
            // The text starts appearing BEFORE the card
            // has completely finished its landing.
            //
            // This is the key change.
            // =========================================

            tl.to("[data-hero='card']", {
              y: 14,
              duration: 0.18,
              ease: "power2.in",
            });

            // =========================================
            // 6. CARD FINAL LAND + TEXT
            // =========================================

            /*
             * Create a label at the beginning of the
             * final landing movement.
             */
            tl.add("landing");

            // Card finishes its landing.
            tl.to(
              "[data-hero='card']",
              {
                y: 0,
                duration: 0.19,
                ease: "power2.out",
              },
              "landing",
            );

            /*
             * Text starts at EXACTLY the same time.
             *
             * Because both animations use the same
             * "landing" label, they are synchronized.
             */
            tl.to(
              "[data-hero='stage-copy']",
              {
                opacity: 1,
                x: 0,
                duration: 0.14,
                ease: "power3.out",
              },
              "landing",
            );

            // =========================================
            // 7. VERY SHORT HOLD
            // =========================================
            //
            // The scene is now complete.
            //
            // Keep this extremely short so the Hero
            // releases almost immediately.
            // =========================================

            tl.to(
              {},
              {
                duration: 0.04,
              },
            );
          }

          // =========================================
          // MOBILE
          // =========================================

          if (mobile) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",

                /*
                 * Mobile gets the same principle:
                 * finish the animation relatively early.
                 */
                end: "60% top",

                scrub: 0.8,
              },
            });

            // =========================================
            // INITIAL STATES
            // =========================================

            gsap.set("[data-hero='statement']", {
              opacity: 0,
              y: 20,
            });

            gsap.set("[data-hero='container']", {
              opacity: 0,
              scale: 0.97,
            });

            gsap.set("[data-hero='card']", {
              opacity: 0,
              y: -350,
              scale: 0.92,
            });

            gsap.set("[data-hero='stage-copy']", {
              opacity: 0,
              y: 20,
            });

            // =========================================
            // 1. STATEMENT
            // =========================================

            tl.to("[data-hero='statement']", {
              opacity: 1,
              y: 0,
              duration: 0.2,
              ease: "power2.out",
            });

            // =========================================
            // 2. PAUSE
            // =========================================

            tl.to(
              {},
              {
                duration: 0.1,
              },
            );

            // =========================================
            // 3. GREEN STAGE
            // =========================================

            tl.to("[data-hero='container']", {
              opacity: 1,
              scale: 1,
              duration: 0.18,
              ease: "power3.out",
            });

            // =========================================
            // 4. CARD FALL
            // =========================================

            tl.to("[data-hero='card']", {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.58,
              ease: "power3.inOut",
            });

            // =========================================
            // 5. CARD LANDING
            // =========================================

            tl.to("[data-hero='card']", {
              y: 8,
              duration: 0.07,
              ease: "power2.in",
            });

            // =========================================
            // 6. CARD + TEXT TOGETHER
            // =========================================

            tl.add("mobileLanding");

            tl.to(
              "[data-hero='card']",
              {
                y: 0,
                duration: 0.12,
                ease: "power2.out",
              },
              "mobileLanding",
            );

            tl.to(
              "[data-hero='stage-copy']",
              {
                opacity: 1,
                y: 0,
                duration: 0.12,
                ease: "power3.out",
              },
              "mobileLanding",
            );

            // =========================================
            // 7. SHORT HOLD
            // =========================================

            tl.to(
              {},
              {
                duration: 0.04,
              },
            );
          }
        },
      );

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[3500px] w-full bg-paper">
      {/*
       * =========================================
       * STICKY VIEWPORT
       * =========================================
       *
       * The Hero remains in view while its parent
       * section provides the scrolling space.
       */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* =========================================
            OPENING STATEMENT
        ========================================= */}
        <div
          data-hero="statement"
          className="
          absolute
          left-0
          right-0
          top-[15vh]
          z-30
          mx-auto
          max-w-5xl
          px-5
          text-center
          sm:px-8
        "
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40 sm:text-[11px]">
            Renewly
          </p>

          <h1
            className="
            mt-5
            font-display
            text-[clamp(2.7rem,7vw,6.75rem)]
            font-medium
            leading-[0.9]
            tracking-[-0.055em]
            text-ink
          "
          >
            The date that matters
            <br />
            isn&apos;t your renewal date.
          </h1>
        </div>
        {/* =========================================
    GREEN STAGE
========================================= */}
        <div
          data-hero="container"
          className="
          absolute
          bottom-0
          left-1/2
          z-10
          h-[48vh]
          w-[calc(100%-20px)]
          -translate-x-1/2
          overflow-visible
          rounded-t-[32px]
          bg-[#B8D7C3]

          sm:w-[calc(100%-40px)]
          sm:rounded-t-[44px]
        "
        >
          {/* =========================================
      LEFT TEXT
  ========================================= */}

          <div
            data-hero="stage-copy"
            className="
            absolute
            z-10

            /*
            * =====================================
            * TEXT POSITION
            * =====================================
            *
            * This has been moved slightly inward.
            *
            * Increase `left` → move text RIGHT
            * Decrease `left` → move text LEFT
            *
            * The card has also been moved inward
            * so the two elements feel like one
            * composition.
            */
            left-8
            top-1/2

            max-w-[280px]
            -translate-y-1/2

            sm:left-14
            sm:max-w-[320px]

            lg:left-[7%]
            lg:max-w-[360px]

            xl:left-[9%]
          "
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40 sm:text-[11px]">
              The problem
            </p>

            <p className="mt-3 font-display text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-ink sm:text-3xl lg:text-5xl">
              Your renewal date isn&apos;t always the date you need to remember.
            </p>

            <p className="mt-4 max-w-[280px] font-body text-xs leading-5 text-ink/50 sm:text-sm">
              The important date is often buried in the notice period of your
              contract.
            </p>
          </div>

          {/* =========================================
      CONTRACT CARD
  ========================================= */}

          <div
            data-hero="card"
            className="
            absolute
            z-20

            /*
            * =====================================
            * CARD POSITION
            * =====================================
            *
            * The card has been moved LEFT so it
            * sits closer to the copy.
            *
            * Smaller `right` → move card RIGHT
            * Larger `right`  → move card LEFT
            *
            * `top` controls the resting height.
            * This is intentionally unchanged.
            */

            right-[3%]
            top-[18%]

            w-[min(420px,46%)]

            will-change-transform

            sm:right-[4%]
            sm:top-[15%]

            lg:right-[6%]
            lg:top-[12%]

            xl:right-[7%]
          "
          >
            <ContractCard />
          </div>
        </div>
        ```
      </div>
    </section>
  );
}
