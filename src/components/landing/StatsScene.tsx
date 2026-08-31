"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    value: "69%",
    label:
      "of software contracts include an auto-renewal clause with a 30–90 day cancellation notice window",
    color: "bg-[#B8E3DE]", // soft turquoise
  },
  {
    value: "25%",
    label:
      "average overspend on SaaS when contracts and entitlements aren't centrally tracked",
    color: "bg-[#fff]", // pale blue
  },
  {
    value: "25",
    label: "active subscriptions the typical company is juggling at once",
    color: "bg-[#fff]", // muted lavender
  },
  {
    value: "51%",
    label:
      "of enterprise SaaS licenses go completely unused — the highest waste rate on record",
    color: "bg-[#B8E3DE]", // warm sand
  },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /*
       * =========================================
       * INTRO
       * =========================================
       */

      gsap.fromTo(
        "[data-stats='intro']",
        {
          opacity: 0,
          y: 35,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-stats='intro']",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /*
       * =========================================
       * STAT REVEALS
       * =========================================
       */

      const items = gsap.utils.toArray<HTMLElement>("[data-stats='item']");

      items.forEach((item) => {
        const number = item.querySelector("[data-stats='number']");
        const label = item.querySelector("[data-stats='label']");
        const line = item.querySelector("[data-stats='line']");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        /*
         * Number
         */

        tl.fromTo(
          number,
          {
            opacity: 0,
            y: 45,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
        );

        /*
         * Line
         */

        tl.fromTo(
          line,
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            duration: 0.55,
            ease: "power3.out",
          },
          "-=0.45",
        );

        /*
         * Supporting text
         */

        tl.fromTo(
          label,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.3",
        );
      });

      /*
       * =========================================
       * CLOSING STATEMENT
       * =========================================
       */

      gsap.fromTo(
        "[data-stats='closing']",
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-stats='closing']",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
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
        px-6
        sm:px-10
        lg:px-[8%]
      "
    >
      {/* =========================================
          INTRO
      ========================================= */}

      <div data-stats="intro" className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40 sm:text-[11px]">
            The problem
          </p>

          <h2
            className="
              mt-5
              font-display
              text-[clamp(3rem,6vw,6.5rem)]
              font-medium
              leading-[0.88]
              tracking-[-0.06em]
              text-ink
            "
          >
            The numbers
            <br />
            tell the story.
          </h2>
        </div>
      </div>

      {/* =========================================
          STATS GRID
          Each stat is one complete colored block.
          No gaps between blocks.
      ========================================= */}

      <div
        className="
          mx-auto
          mt-24
          max-w-7xl
          overflow-hidden
          rounded-xl

          sm:mt-32
          lg:mt-40
        "
      >
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {STATS.map((stat, index) => (
            <div
              key={stat.value + index}
              data-stats="item"
              className={`
                ${stat.color}
                relative
                min-h-[420px]
                overflow-hidden
                p-6

                sm:min-h-[460px]
                sm:p-8

                lg:min-h-[420px]
                lg:p-10

                border-b
                border-ink/10

                sm:[&:nth-child(odd)]:border-r
                sm:[&:nth-child(3)]:border-b-0
                sm:[&:nth-child(4)]:border-b-0
              `}
            >
              {/* Index */}

              <div className="mb-10 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                  0{index + 1}
                </span>
              </div>

              {/* Number */}

              <p
                data-stats="number"
                className="
                  font-display
                  text-[clamp(5rem,10vw,10rem)]
                  font-medium
                  leading-[0.78]
                  tracking-[-0.08em]
                  text-ink
                "
              >
                {stat.value}
              </p>

              {/* Line */}

              <div
                data-stats="line"
                className="
                  mt-10
                  h-px
                  w-full
                  origin-left
                  bg-ink/30
                "
              />

              {/* Description */}

              <p
                data-stats="label"
                className="
                  mt-5
                  max-w-[360px]
                  font-body
                  text-sm
                  leading-6
                  text-ink/65

                  lg:text-[15px]
                  lg:leading-6
                "
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          CLOSING STATEMENT
      ========================================= */}

      <div
        data-stats="closing"
        className="
          mx-auto
          mt-24
          max-w-7xl
          pb-24

          sm:mt-32
          sm:pb-32
        "
      >
        <p
          className="
            max-w-2xl
            font-display
            text-2xl
            font-medium
            leading-tight
            tracking-[-0.03em]
            text-ink/70

            sm:text-3xl
          "
        >
          The problem isn't knowing what you spend.
          <br />
          It's knowing what matters next.
        </p>
      </div>
    </section>
  );
}
