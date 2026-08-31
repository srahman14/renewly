"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        "[data-cta='image']",
        {
          opacity: 0,
          scale: 1.04,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },
      );

      tl.fromTo(
        "[data-cta='content']",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.6",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        bg-paper
        px-5
        py-24

        sm:px-8
        sm:py-32

        lg:px-[8%]
        lg:py-40
      "
    >
      <div className="mx-auto max-w-6xl">
        {/* =========================================
            IMAGE + CTA
            =========================================
            
            The image IS the container.
            There is intentionally:
            - no background colour
            - no outer border
            - no separate image section
        ========================================= */}

        <div
          data-cta="image"
          className="
            relative
            min-h-[560px]
            overflow-hidden
            rounded-[28px]

            sm:min-h-[620px]
            sm:rounded-[40px]

            lg:min-h-[680px]
            lg:rounded-[48px]
          "
        >
          {/* =======================================
              BACKGROUND IMAGE
          ======================================= */}

          <img
            src="/assets/explosion.webp"
            alt=""
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />

          {/* =======================================
              IMAGE OVERLAY
              
              Keeps the typography readable without
              turning the scene into a solid colour.
          ======================================= */}

          <div
            className="
              absolute
              inset-0
              bg-black/25
            "
          />

          {/* =======================================
              CONTENT
          ======================================= */}

          <div
            data-cta="content"
            className="
              relative
              z-10
              flex
              min-h-[560px]
              flex-col
              items-center
              justify-center
              px-6
              py-20
              text-center

              sm:min-h-[620px]
              sm:px-10

              lg:min-h-[680px]
              lg:px-16
            "
          >
            <p
              className="
                font-mono
                text-[10px]
                uppercase
                tracking-[0.14em]
                text-white/65

                sm:text-[11px]
              "
            >
              Ready to take control?
            </p>

            <h2
              className="
                mt-5
                max-w-4xl
                font-display
                text-[clamp(3rem,6vw,6.5rem)]
                font-medium
                leading-[0.88]
                tracking-[-0.06em]
                text-white
              "
            >
              Know what matters
              <br />
              before it matters.
            </h2>

            <p
              className="
                mx-auto
                mt-7
                max-w-lg
                font-body
                text-sm
                leading-6
                text-white/70

                sm:text-base
                sm:leading-7
              "
            >
              Keep your contracts, teams and important dates in one place.
            </p>

            {/* =====================================
                ACTIONS
            ===================================== */}

            <div
              className="
                mt-8
                flex
                flex-col
                items-center
                justify-center
                gap-3

                sm:flex-row
              "
            >
              <a
                href="#"
                className="
                  group
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  gap-3
                  rounded-full
                  bg-white
                  px-6
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.1em]
                  text-ink
                  transition-transform
                  duration-300

                  hover:-translate-y-0.5
                "
              >
                Get started
                <span
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </a>

              <a
                href="#"
                className="
                  inline-flex
                  h-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/30
                  bg-white/10
                  px-6
                  font-mono
                  text-[10px]
                  uppercase
                  tracking-[0.1em]
                  text-white/80
                  backdrop-blur-sm
                  transition-colors
                  duration-300

                  hover:border-white/50
                  hover:bg-white/15
                  hover:text-white
                "
              >
                See how it works
              </a>
            </div>
          </div>

          {/* =======================================
              CORNER LABELS
          ======================================= */}

          <div
            className="
              absolute
              left-5
              top-5
              z-20

              sm:left-8
              sm:top-8
            "
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
              Renewly
            </p>
          </div>

          <div
            className="
              absolute
              bottom-5
              right-5
              z-20

              sm:bottom-8
              sm:right-8
            "
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-white/45">
              Contracts under control
            </p>
          </div>
        </div>

        {/* =========================================
            SMALL FOOTER LINE
        ========================================= */}

        <div
          className="
            mt-7
            flex
            flex-col
            gap-2

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/25">
            Know what matters. Before it matters.
          </p>

          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/25">
            Renewly
          </p>
        </div>
      </div>
    </section>
  );
}
