"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksScene() {
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

          /*
           * =========================================
           * REDUCED MOTION
           * =========================================
           */

          if (reduceMotion) {
            gsap.set("[data-how='eyebrow']", {
              opacity: 1,
              y: 0,
            });

            gsap.set("[data-how='copy']", {
              opacity: 1,
              x: 0,
            });

            gsap.set("[data-how='card']", {
              opacity: 1,
              scale: 1,
            });

            gsap.set("[data-how='image-frame']", {
              opacity: 1,
              scale: 1,
            });

            gsap.set("[data-how='state-1']", {
              opacity: 1,
              y: 0,
            });

            gsap.set("[data-how='state-2']", {
              opacity: 0,
              y: 20,
            });

            gsap.set("[data-how='state-3']", {
              opacity: 0,
              y: 20,
            });

            gsap.set("[data-how='state-4']", {
              opacity: 0,
              y: 20,
            });

            return;
          }

          /*
           * =========================================
           * DESKTOP
           * =========================================
           */

          if (desktop) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=3400",
                scrub: 0.9,
                pin: true,
                anticipatePin: 1,
              },
            });

            /*
             * -----------------------------------------
             * INITIAL STATES
             * -----------------------------------------
             */

            gsap.set("[data-how='eyebrow']", {
              opacity: 0,
              y: 20,
            });

            gsap.set("[data-how='copy']", {
              opacity: 0,
              x: -35,
            });

            gsap.set("[data-how='card']", {
              opacity: 0,
              scale: 0.94,
            });

            gsap.set("[data-how='dots']", {
              opacity: 0,
              scale: 0.94,
            });

            /*
             * IMPORTANT:
             *
             * The image starts hidden.
             * It is animated in at exactly the same
             * time as the card.
             */

            gsap.set("[data-how='image-frame']", {
              opacity: 0,
              scale: 0.94,
            });

            for (let i = 1; i <= 4; i++) {
              gsap.set(`[data-how='state-${i}']`, {
                opacity: 0,
                y: 25,
              });

              gsap.set(`[data-how='dot-${i}']`, {
                scale: 1,
                opacity: 0.25,
              });
            }

            /*
             * -----------------------------------------
             * INTRO
             * -----------------------------------------
             */

            tl.to("[data-how='eyebrow']", {
              opacity: 1,
              y: 0,
              duration: 0.1,
              ease: "power3.out",
            });

            tl.to("[data-how='copy']", {
              opacity: 1,
              x: 0,
              duration: 0.16,
              ease: "power3.out",
            });

            /*
             * -----------------------------------------
             * CARD + IMAGE APPEAR TOGETHER
             * -----------------------------------------
             */

            tl.to(
              "[data-how='card']",
              {
                opacity: 1,
                scale: 1,
                duration: 0.18,
                ease: "power3.out",
              },
              "<",
            );

            tl.to(
              "[data-how='dots']",
              {
                opacity: 1,
                scale: 1,
                duration: 0.18,
                ease: "power3.out",
              },
              "<",
            );

            tl.to(
              "[data-how='image-frame']",
              {
                opacity: 1,
                scale: 1,
                duration: 0.18,
                ease: "power3.out",
              },
              "<",
            );

            /*
             * -----------------------------------------
             * STATE 1
             * -----------------------------------------
             */

            tl.to("[data-how='state-1']", {
              opacity: 1,
              y: 0,
              duration: 0.14,
              ease: "power3.out",
            });

            tl.to("[data-how='dot-1']", {
              scale: 1.45,
              opacity: 1,
              duration: 0.07,
            });

            /*
             * LONG HOLD
             *
             * The user has plenty of scroll distance
             * to actually read this state.
             */

            tl.to(
              {},
              {
                duration: 0.42,
              },
            );

            /*
             * -----------------------------------------
             * STATE 1 → STATE 2
             * -----------------------------------------
             */

            tl.to("[data-how='state-1']", {
              opacity: 0,
              y: -30,
              duration: 0.13,
              ease: "power2.in",
            });

            tl.to(
              "[data-how='state-2']",
              {
                opacity: 1,
                y: 0,
                duration: 0.15,
                ease: "power3.out",
              },
              "-=0.04",
            );

            tl.to(
              "[data-how='dot-1']",
              {
                scale: 1,
                opacity: 0.25,
                duration: 0.06,
              },
              "<",
            );

            tl.to(
              "[data-how='dot-2']",
              {
                scale: 1.45,
                opacity: 1,
                duration: 0.06,
              },
              "<",
            );

            /*
             * LONG HOLD
             */

            tl.to(
              {},
              {
                duration: 0.42,
              },
            );

            /*
             * -----------------------------------------
             * STATE 2 → STATE 3
             * -----------------------------------------
             */

            tl.to("[data-how='state-2']", {
              opacity: 0,
              y: -30,
              duration: 0.13,
              ease: "power2.in",
            });

            tl.to(
              "[data-how='state-3']",
              {
                opacity: 1,
                y: 0,
                duration: 0.15,
                ease: "power3.out",
              },
              "-=0.04",
            );

            tl.to(
              "[data-how='dot-2']",
              {
                scale: 1,
                opacity: 0.25,
                duration: 0.06,
              },
              "<",
            );

            tl.to(
              "[data-how='dot-3']",
              {
                scale: 1.45,
                opacity: 1,
                duration: 0.06,
              },
              "<",
            );

            /*
             * LONG HOLD
             */

            tl.to(
              {},
              {
                duration: 0.42,
              },
            );

            /*
             * -----------------------------------------
             * STATE 3 → STATE 4
             * -----------------------------------------
             */

            tl.to("[data-how='state-3']", {
              opacity: 0,
              y: -30,
              duration: 0.13,
              ease: "power2.in",
            });

            tl.to(
              "[data-how='state-4']",
              {
                opacity: 1,
                y: 0,
                duration: 0.15,
                ease: "power3.out",
              },
              "-=0.04",
            );

            tl.to(
              "[data-how='dot-3']",
              {
                scale: 1,
                opacity: 0.25,
                duration: 0.06,
              },
              "<",
            );

            tl.to(
              "[data-how='dot-4']",
              {
                scale: 1.45,
                opacity: 1,
                duration: 0.06,
              },
              "<",
            );

            /*
             * FINAL HOLD
             */

            tl.to(
              {},
              {
                duration: 0.3,
              },
            );
          }

          /*
           * =========================================
           * MOBILE
           * =========================================
           */

          if (mobile) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=3000",
                scrub: 0.9,
                pin: true,
                anticipatePin: 1,
              },
            });

            gsap.set("[data-how='eyebrow']", {
              opacity: 0,
              y: 15,
            });

            gsap.set("[data-how='copy']", {
              opacity: 0,
              y: 20,
            });

            gsap.set("[data-how='card']", {
              opacity: 0,
              scale: 0.94,
            });

            gsap.set("[data-how='dots']", {
              opacity: 0,
              scale: 0.94,
            });

            gsap.set("[data-how='image-frame']", {
              opacity: 0,
              scale: 0.94,
            });

            for (let i = 1; i <= 4; i++) {
              gsap.set(`[data-how='state-${i}']`, {
                opacity: 0,
                y: 20,
              });

              gsap.set(`[data-how='dot-${i}']`, {
                scale: 1,
                opacity: 0.25,
              });
            }

            /*
             * INTRO
             */

            tl.to("[data-how='eyebrow']", {
              opacity: 1,
              y: 0,
              duration: 0.1,
            });

            tl.to("[data-how='copy']", {
              opacity: 1,
              y: 0,
              duration: 0.14,
              ease: "power3.out",
            });

            /*
             * CARD + IMAGE TOGETHER
             */

            tl.to(
              "[data-how='card']",
              {
                opacity: 1,
                scale: 1,
                duration: 0.16,
                ease: "power3.out",
              },
              "<",
            );

            tl.to(
              "[data-how='dots']",
              {
                opacity: 1,
                scale: 1,
                duration: 0.16,
                ease: "power3.out",
              },
              "<",
            );

            tl.to(
              "[data-how='image-frame']",
              {
                opacity: 1,
                scale: 1,
                duration: 0.16,
                ease: "power3.out",
              },
              "<",
            );

            /*
             * STATES
             */

            for (let i = 1; i <= 4; i++) {
              tl.to(`[data-how='state-${i}']`, {
                opacity: 1,
                y: 0,
                duration: 0.12,
                ease: "power3.out",
              });

              tl.to(`[data-how='dot-${i}']`, {
                scale: 1.4,
                opacity: 1,
                duration: 0.06,
              });

              if (i < 4) {
                /*
                 * Longer mobile hold.
                 */

                tl.to(
                  {},
                  {
                    duration: 0.38,
                  },
                );

                tl.to(`[data-how='state-${i}']`, {
                  opacity: 0,
                  y: -22,
                  duration: 0.11,
                  ease: "power2.in",
                });

                tl.to(
                  `[data-how='state-${i + 1}']`,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 0.13,
                    ease: "power3.out",
                  },
                  "-=0.03",
                );

                tl.to(
                  `[data-how='dot-${i}']`,
                  {
                    scale: 1,
                    opacity: 0.25,
                    duration: 0.06,
                  },
                  "<",
                );

                tl.to(
                  `[data-how='dot-${i + 1}']`,
                  {
                    scale: 1.4,
                    opacity: 1,
                    duration: 0.06,
                  },
                  "<",
                );
              }
            }

            tl.to(
              {},
              {
                duration: 0.2,
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
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-paper"
    >
      <div
        className="
          relative
          flex
          h-screen
          w-full
          items-center
          px-6
          sm:px-10
          lg:px-[8%]
        "
      >
        {/* =========================================
            EYEBROW
        ========================================= */}

        <div
          data-how="eyebrow"
          className="
            absolute
            left-6
            top-[10vh]
            sm:left-10
            lg:left-[8%]
          "
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40 sm:text-[11px]">
            How Renewly works
          </p>
        </div>

        {/* =========================================
            LEFT COPY
        ========================================= */}

        <div
          data-how="copy"
          className="
            relative
            z-10
            w-[42%]
            max-w-[520px]
            pr-8

            max-md:absolute
            max-md:left-6
            max-md:top-[17vh]
            max-md:w-[calc(100%-48px)]
            max-md:max-w-none
            max-md:pr-0
          "
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40 sm:text-[11px]">
            From contract to action
          </p>

          <h2
            className="
              mt-4
              font-display
              text-[clamp(2.5rem,5vw,5.5rem)]
              font-medium
              leading-[0.92]
              tracking-[-0.05em]
              text-ink
            "
          >
            We turn contracts
            <br />
            into dates you
            <br />
            can act on.
          </h2>

          <p
            className="
              mt-6
              max-w-[400px]
              font-body
              text-sm
              leading-6
              text-ink/50

              max-md:max-w-[330px]
            "
          >
            Renewly finds the important dates hidden inside your contracts,
            connects the terms together, and tells you when you actually need to
            act.
          </p>
        </div>

        {/* =========================================
            CARD + IMAGE WRAPPER
        ========================================= */}

        <div
          className="
            absolute
            right-[9%]
            top-1/2
            z-20
            w-[min(500px,43vw)]
            -translate-y-1/2

            max-md:left-6
            max-md:right-6
            max-md:top-auto
            max-md:bottom-[8vh]
            max-md:w-auto
            max-md:translate-y-0
          "
        >
          {/* =======================================
              IMAGE FRAME

              Only LEFT + BOTTOM borders are visible.

              The image itself is hidden until the
              card enters.
          ======================================= */}

          <div
            data-how="image-frame"
            className="
              pointer-events-none
              absolute
              -bottom-10
              -left-10
              h-[calc(100%+32px)]
              w-[calc(100%+32px)]
              overflow-hidden
              rounded-[12px]
            "
          >
            <img
              src="/assets/nature-2.webp"
              alt=""
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                opacity-80
              "
            />
          </div>

          {/* =======================================
              CARD
          ======================================= */}

          <div
            data-how="card"
            className="
              relative
              overflow-hidden
              rounded-[12px]
              p-2
            "
          >
            <div
              className="
                relative
                min-h-[540px]
                overflow-hidden
                rounded-[5px]
                border
                border-ink/10
                bg-white

                max-md:min-h-[460px]
              "
            >
              {/* ===================================
                  STATE 1 — FIND IT
              =================================== */}

              <div
                data-how="state-1"
                className="absolute inset-0 flex flex-col"
              >
                <div className="flex items-center justify-between px-7 pt-7">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                    Contract
                  </span>

                  <span className="rounded-full bg-teal/10 px-2 py-0.5 font-mono text-[10px] text-teal">
                    Analysed
                  </span>
                </div>

                <div className="px-7 pt-6">
                  <p className="font-display text-3xl font-medium tracking-[-0.03em] text-ink">
                    Figma — Enterprise
                  </p>

                  <p className="mt-1 font-body text-sm text-ink/45">
                    Design team · Annual contract
                  </p>
                </div>

                <div className="my-7 h-px bg-line/70" />

                <div className="space-y-6 px-7">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
                      Renewal date
                    </p>

                    <p className="mt-1 font-mono text-xl text-ink">
                      Mar 14, 2027
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
                      Notice period
                    </p>

                    <p className="mt-1 font-mono text-xl text-ink">60 days</p>
                  </div>
                </div>

                <div className="mt-auto px-7 pb-7">
                  <div className="rounded-[4px] bg-paper-muted px-5 py-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
                      Important terms found
                    </p>

                    <p className="mt-1 font-body text-sm text-ink/65">
                      4 dates · 3 obligations · 1 renewal
                    </p>
                  </div>
                </div>
              </div>

              {/* ===================================
                  STATE 2 — UNDERSTAND IT
              =================================== */}

              <div
                data-how="state-2"
                className="absolute inset-0 flex flex-col opacity-0"
              >
                <div className="flex items-center justify-between px-7 pt-7">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                    Contract logic
                  </span>

                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-700">
                    Calculated
                  </span>
                </div>

                <div className="px-7 pt-6">
                  <p className="font-display text-3xl font-medium tracking-[-0.03em] text-ink">
                    The date that matters
                  </p>

                  <p className="mt-1 font-body text-sm text-ink/45">
                    Calculated from your contract terms
                  </p>
                </div>

                <div className="my-7 h-px bg-line/70" />

                <div className="space-y-4 px-7">
                  <div className="rounded-[4px] border border-line/70 bg-paper-muted px-5 py-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
                      Renewal
                    </p>

                    <p className="mt-1 font-mono text-lg text-ink">
                      Mar 14, 2027
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <span className="font-mono text-xs text-ink/30">
                      − 60 days
                    </span>
                  </div>

                  <div className="rounded-[4px] bg-navy px-5 py-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber-light/80">
                      Action date
                    </p>

                    <p className="mt-1 font-mono text-2xl text-paper">
                      Jan 13, 2027
                    </p>
                  </div>
                </div>

                <div className="mt-auto px-7 pb-7">
                  <p className="font-body text-sm leading-5 text-ink/50">
                    Renewly connects the dates for you.
                  </p>
                </div>
              </div>

              {/* ===================================
                  STATE 3 — NEVER MISS IT
              =================================== */}

              <div
                data-how="state-3"
                className="absolute inset-0 flex flex-col opacity-0"
              >
                <div className="flex items-center justify-between px-7 pt-7">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                    Action
                  </span>

                  <span className="rounded-full bg-teal/10 px-2 py-0.5 font-mono text-[10px] text-teal">
                    Ready
                  </span>
                </div>

                <div className="px-7 pt-6">
                  <p className="font-display text-3xl font-medium tracking-[-0.03em] text-ink">
                    Don't let it renew quietly.
                  </p>

                  <p className="mt-1 font-body text-sm text-ink/45">
                    Your next action is clear.
                  </p>
                </div>

                <div className="my-7 h-px bg-line/70" />

                <div className="px-7">
                  <div className="rounded-[5px] bg-navy p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-amber-light/70">
                      Cancellation deadline
                    </p>

                    <p className="mt-2 font-mono text-3xl text-paper">
                      Jan 13, 2027
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-paper/10 pt-4">
                      <span className="font-body text-xs text-paper/50">
                        Time remaining
                      </span>

                      <span className="font-mono text-xs text-amber-light">
                        42 days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto px-7 pb-7">
                  <button
                    type="button"
                    className="
                      w-full
                      rounded-[4px]
                      bg-ink
                      px-4
                      py-3
                      font-mono
                      text-[10px]
                      uppercase
                      tracking-[0.1em]
                      text-paper
                    "
                  >
                    Add reminder →
                  </button>
                </div>
              </div>

              {/* ===================================
                  STATE 4 — TEAMS
              =================================== */}

              <div
                data-how="state-4"
                className="absolute inset-0 flex flex-col opacity-0"
              >
                <div className="flex items-center justify-between px-7 pt-7">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                    Workspace
                  </span>

                  <span className="rounded-full bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] text-purple-700">
                    Team
                  </span>
                </div>

                <div className="px-7 pt-6">
                  <p className="font-display text-3xl font-medium tracking-[-0.03em] text-ink">
                    Everything in one place.
                  </p>

                  <p className="mt-1 font-body text-sm text-ink/45">
                    Manage your contracts across every team.
                  </p>
                </div>

                <div className="my-7 h-px bg-line/70" />

                <div className="space-y-3 px-7">
                  <div className="flex items-center justify-between rounded-[5px] border border-line/70 bg-paper-muted px-5 py-4">
                    <div>
                      <p className="font-body text-sm font-medium text-ink">
                        Design
                      </p>

                      <p className="mt-0.5 font-mono text-[10px] text-ink/40">
                        12 contracts
                      </p>
                    </div>

                    <span className="font-mono text-xs text-ink/30">→</span>
                  </div>

                  <div className="flex items-center justify-between rounded-[5px] border border-line/70 bg-paper-muted px-5 py-4">
                    <div>
                      <p className="font-body text-sm font-medium text-ink">
                        Engineering
                      </p>

                      <p className="mt-0.5 font-mono text-[10px] text-ink/40">
                        24 contracts
                      </p>
                    </div>

                    <span className="font-mono text-xs text-ink/30">→</span>
                  </div>

                  <div className="flex items-center justify-between rounded-[5px] border border-line/70 bg-paper-muted px-5 py-4">
                    <div>
                      <p className="font-body text-sm font-medium text-ink">
                        Operations
                      </p>

                      <p className="mt-0.5 font-mono text-[10px] text-ink/40">
                        8 contracts
                      </p>
                    </div>

                    <span className="font-mono text-xs text-ink/30">→</span>
                  </div>
                </div>

                <div className="mt-auto px-7 pb-7">
                  <div className="flex items-center justify-between rounded-[4px] bg-ink px-5 py-4">
                    <span className="font-body text-xs text-paper/60">
                      44 contracts across 3 teams
                    </span>

                    <span className="font-mono text-xs text-paper">
                      View all →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =======================================
              PROGRESS DOTS

              DESKTOP:
              - Outside card
              - Right side
              - Vertical
              - Small gap

              MOBILE:
              - Below card
              - Horizontal
          ======================================= */}

          <div
            data-how="dots"
            className=" absolute left-[calc(100%+20px)] top-1/2 z-30 flex -translate-y-1/2 flex-col items-center justify-center gap-2 max-md:left-[calc(100%+12px)] "
          >
            {" "}
            <span
              data-how="dot-1"
              className="block h-[6px] w-[6px] shrink-0 rounded-full bg-ink"
            />{" "}
            <span
              data-how="dot-2"
              className="block h-[6px] w-[6px] shrink-0 rounded-full bg-ink"
            />{" "}
            <span
              data-how="dot-3"
              className="block h-[6px] w-[6px] shrink-0 rounded-full bg-ink"
            />{" "}
            <span
              data-how="dot-4"
              className="block h-[6px] w-[6px] shrink-0 rounded-full bg-ink"
            />{" "}
          </div>
        </div>
      </div>
    </section>
  );
}
