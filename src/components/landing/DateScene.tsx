"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DateScene() {
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

          if (reduceMotion) {
            gsap.set("[data-date='transition']", {
              opacity: 1,
              y: 0,
            });

            gsap.set("[data-date='container']", {
              opacity: 1,
              scale: 1,
            });

            gsap.set("[data-date='copy']", {
              opacity: 1,
              x: 0,
            });

            gsap.set("[data-date='muted-text']", {
              color: "#181A20",
            });

            gsap.set("[data-date='card']", {
              opacity: 1,
              y: 0,
              scale: 1,
            });

            gsap.set("[data-date='renewal']", {
              opacity: 1,
              y: 0,
            });

            gsap.set("[data-date='notice']", {
              opacity: 1,
              y: 0,
            });

            gsap.set("[data-date='safe']", {
              opacity: 1,
              y: 0,
            });

            gsap.set("[data-date='image-frame']", {
              opacity: 1,
              y: 0,
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
                end: "65% top",
                scrub: 0.8,
              },
            });

            // INITIAL STATES

            gsap.set("[data-date='transition']", {
              opacity: 0,
              y: 35,
            });

            gsap.set("[data-date='container']", {
              opacity: 0,
              scale: 0.96,
            });

            gsap.set("[data-date='copy']", {
              opacity: 0,
              x: -30,
            });

            gsap.set("[data-date='muted-text']", {
              color: "rgba(24, 26, 32, 0.30)",
            });

            gsap.set("[data-date='card']", {
              opacity: 0,
              y: 20,
              scale: 0.98,
            });

            gsap.set("[data-date='renewal']", {
              opacity: 0,
              y: 12,
            });

            gsap.set("[data-date='notice']", {
              opacity: 0,
              y: 12,
            });

            gsap.set("[data-date='safe']", {
              opacity: 0,
              y: 12,
            });

            gsap.set("[data-date='image-frame']", {
              opacity: 0,
              scale: 0.94,
            });

            // =========================================
            // 1. TRANSITION
            // =========================================

            tl.to("[data-date='transition']", {
              opacity: 1,
              y: 0,
              duration: 0.18,
              ease: "power3.out",
            });

            // =========================================
            // 2. RED CONTAINER
            // =========================================

            tl.to("[data-date='container']", {
              opacity: 1,
              scale: 1,
              duration: 0.16,
              ease: "power3.out",
            });

            // =========================================
            // 3. COPY
            // =========================================

            tl.to("[data-date='copy']", {
              opacity: 1,
              x: 0,
              duration: 0.18,
              ease: "power3.out",
            });

            // =========================================
            // 4. CARD
            // =========================================

            tl.to(
              "[data-date='image-frame']",
              {
                opacity: 1,
                scale: 1,
                duration: 0.22,
                ease: "power2.out",
              },
              "<",
            );

            tl.to(
              "[data-date='card']",
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.18,
                ease: "power2.out",
              },
              "<",
            );

            // =========================================
            // 5. TEXT FILL
            // =========================================

            tl.to("[data-date='muted-text']", {
              color: "#181A20",
              duration: 0.32,
              ease: "none",
            });

            // =========================================
            // 6. RENEWAL
            // =========================================

            tl.to("[data-date='renewal']", {
              opacity: 1,
              y: 0,
              duration: 0.1,
              ease: "power2.out",
            });

            // =========================================
            // 7. NOTICE
            // =========================================

            tl.to("[data-date='notice']", {
              opacity: 1,
              y: 0,
              duration: 0.1,
              ease: "power2.out",
            });

            // =========================================
            // 8. SAFE DATE
            // =========================================

            tl.to("[data-date='safe']", {
              opacity: 1,
              y: 0,
              duration: 0.14,
              ease: "power3.out",
            });

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
                end: "60% top",
                scrub: 0.8,
              },
            });

            gsap.set("[data-date='transition']", {
              opacity: 0,
              y: 25,
            });

            gsap.set("[data-date='container']", {
              opacity: 0,
              scale: 0.97,
            });

            gsap.set("[data-date='copy']", {
              opacity: 0,
              y: 20,
            });

            gsap.set("[data-date='muted-text']", {
              color: "rgba(24, 26, 32, 0.30)",
            });

            gsap.set("[data-date='card']", {
              opacity: 0,
              y: 15,
              scale: 0.98,
            });

            gsap.set("[data-date='renewal']", {
              opacity: 0,
              y: 10,
            });

            gsap.set("[data-date='notice']", {
              opacity: 0,
              y: 10,
            });

            gsap.set("[data-date='safe']", {
              opacity: 0,
              y: 10,
            });

            tl.to("[data-date='transition']", {
              opacity: 1,
              y: 0,
              duration: 0.16,
              ease: "power3.out",
            });

            tl.to("[data-date='container']", {
              opacity: 1,
              scale: 1,
              duration: 0.16,
              ease: "power3.out",
            });

            tl.to("[data-date='copy']", {
              opacity: 1,
              y: 0,
              duration: 0.16,
              ease: "power3.out",
            });

            tl.to(
              "[data-date='card']",
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.16,
                ease: "power2.out",
              },
              "<",
            );

            tl.to("[data-date='muted-text']", {
              color: "#181A20",
              duration: 0.3,
              ease: "none",
            });

            tl.to("[data-date='renewal']", {
              opacity: 1,
              y: 0,
              duration: 0.09,
            });

            tl.to("[data-date='notice']", {
              opacity: 1,
              y: 0,
              duration: 0.09,
            });

            tl.to("[data-date='safe']", {
              opacity: 1,
              y: 0,
              duration: 0.12,
              ease: "power3.out",
            });

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
    <section ref={sectionRef} className="relative h-[2400px] w-full bg-paper">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* =========================================
            TRANSITION HEADLINE
        ========================================= */}

        <div
          data-date="transition"
          className="
            absolute
            left-0
            right-0
            top-[11vh]
            z-30
            mx-auto
            max-w-4xl
            px-5
            text-center
            sm:px-8
          "
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40 sm:text-[11px]">
            So what actually matters?
          </p>

          <h2
            className="
              mt-3
              font-display
              text-[clamp(2.2rem,5vw,4.75rem)]
              font-medium
              leading-[0.92]
              tracking-[-0.05em]
              text-ink
            "
          >
            The date before the date.
          </h2>
        </div>

        {/* =========================================
            RED CONTAINER
        ========================================= */}

        <div
          data-date="container"
          className="
            absolute
            bottom-0
            left-1/2
            z-10
            h-[58vh]
            w-[calc(100%-20px)]
            -translate-x-1/2
            overflow-hidden
            rounded-t-[32px]
            bg-[#D96C62]

            sm:w-[calc(100%-40px)]
            sm:rounded-t-[44px]
          "
        >
          {/* =========================================
              LEFT COPY
          ========================================= */}

          <div
            data-date="copy"
            className="
              absolute
              left-6
              top-1/2
              z-20
              max-w-[310px]
              -translate-y-1/2

              sm:left-10
              sm:max-w-[380px]

              lg:left-16
              lg:max-w-[440px]

              xl:left-[7%]
            "
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/50 sm:text-[11px]">
              The calculation
            </p>

            <h2
              data-date="muted-text"
              className="
                mt-4
                font-display
                text-3xl
                font-medium
                leading-[0.98]
                tracking-[-0.04em]

                sm:text-4xl
                lg:text-6xl
              "
            >
              Renewal is only the beginning.
            </h2>

            <p className="mt-5 max-w-[320px] font-body text-sm leading-6 text-ink/55">
              What matters is how much notice you need to give before that date
              arrives.
            </p>
          </div>

          {/* =========================================
              IMAGE + CARD GROUP
              
              The image is deliberately larger than
              the card so it creates a thick visual
              frame around it.
          ========================================= */}

          <div
            className="
              absolute
              right-[4%]
              top-[8%]
              z-20
              w-[min(470px,46%)]

              sm:right-[5%]
              sm:top-[7%]

              lg:right-[7%]
              lg:top-[6%]

              xl:right-[8%]
            "
          >
            {/* =====================================
                IMAGE FRAME
                ===================================== */}

            <div
              data-date="image-frame"
              className="
              absolute
              -inset-[18px]
              overflow-hidden
              rounded-[14px]
            bg-black/10
              will-change-transform
            "
            >
              <img
                src="/assets/explosion.webp"
                alt=""
                aria-hidden="true"
                className="
                  h-full
                  w-full
                  object-cover
                  opacity-80
                "
              />

              {/* subtle overlay */}
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* =====================================
                CARD
                ===================================== */}

            <div
              data-date="card"
              className="
                relative
                z-20
                w-full
              "
            >
              <div
                className="
                  overflow-hidden
                  rounded-md
                  border
                  border-ink/10
                  bg-white
                  shadow-[0_25px_55px_-30px_rgba(18,20,28,0.5)]
                "
              >
                {/* HEADER */}

                <div className="flex items-center justify-between px-6 pt-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/40">
                    Contract
                  </span>

                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 font-mono text-[11px] text-red-600">
                    Active
                  </span>
                </div>

                <div className="px-6 pb-5 pt-2">
                  <p className="font-display text-xl font-medium text-ink">
                    Figma — Enterprise
                  </p>

                  <p className="mt-1 font-body text-sm text-ink/50">
                    Design team · Annual contract
                  </p>
                </div>

                <div className="perforated-edge" aria-hidden="true" />

                {/* CALCULATION */}

                <div className="space-y-0 px-5 py-5">
                  {/* RENEWAL */}

                  <div
                    data-date="renewal"
                    className="
                      rounded-[4px]
                      border
                      border-line/70
                      bg-paper-muted
                      px-4
                      py-3
                    "
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
                      Renewal date
                    </p>

                    <p className="mt-1 font-mono text-lg text-ink">
                      Mar 14, 2027
                    </p>
                  </div>

                  {/* MINUS */}

                  <div className="flex h-8 items-center justify-center">
                    <span className="font-mono text-xs text-ink/30">−</span>
                  </div>

                  {/* NOTICE */}

                  <div
                    data-date="notice"
                    className="
                      rounded-[4px]
                      border
                      border-line/70
                      bg-paper-muted
                      px-4
                      py-3
                    "
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
                      Notice period
                    </p>

                    <p className="mt-1 font-mono text-lg text-ink">60 days</p>
                  </div>

                  {/* EQUALS */}

                  <div className="flex h-8 items-center justify-center">
                    <span className="font-mono text-xs text-ink/30">=</span>
                  </div>

                  {/* FINAL DATE */}

                  <div
                    data-date="safe"
                    className="
                      rounded-[4px]
                      bg-navy
                      px-4
                      py-4
                    "
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber-light/80">
                      Date that matters
                    </p>

                    <p className="mt-1 font-mono text-xl text-paper">
                      Jan 13, 2027
                    </p>

                    <p className="mt-2 font-body text-xs text-paper/50">
                      Last safe day to cancel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
