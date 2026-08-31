"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    eyebrow: "Find",
    title: "Everything starts with the contract.",
    description:
      "Upload your agreements and keep the information that matters together. No more searching through inboxes, folders or scattered documents.",
    image: "/assets/nature-2.webp",
    imageAlt: "Contract document",
  },
  {
    number: "02",
    eyebrow: "Understand",
    title: "Renewly finds the dates hidden inside.",
    description:
      "Renewal dates, notice periods and important obligations are connected together so you can see when action is actually required.",
    image: "/assets/explosion.webp",
    imageAlt: "Calendar showing important dates",
  },
  {
    number: "03",
    eyebrow: "Act",
    title: "Your team knows what happens next.",
    description:
      "Give every contract an owner, keep teams organised and make sure important dates don't quietly pass by.",
    image: "/assets/nature-2.webp",
    imageAlt: "Team workspace",
  },
];

export default function PurposeScene() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /*
       * =========================================
       * INTRO
       * =========================================
       */

      gsap.fromTo(
        "[data-purpose='intro']",
        {
          opacity: 0,
          y: 45,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-purpose='intro']",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /*
       * =========================================
       * STEP ANIMATIONS
       * =========================================
       */

      const steps = gsap.utils.toArray<HTMLElement>("[data-purpose='step']");

      steps.forEach((step) => {
        const image = step.querySelector("[data-purpose='image']");

        const imageInner = step.querySelector("[data-purpose='image-inner']");

        const content = step.querySelector("[data-purpose='content']");

        const number = step.querySelector("[data-purpose='number']");

        const line = step.querySelector("[data-purpose='line']");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });

        /*
         * Content
         */

        tl.fromTo(
          content,
          {
            opacity: 0,
            x: -35,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
          },
        );

        /*
         * Number
         */

        tl.fromTo(
          number,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.5",
        );

        /*
         * Image frame
         */

        tl.fromTo(
          image,
          {
            opacity: 0,
            scale: 0.94,
            y: 35,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.55",
        );

        /*
         * Image itself moves slightly
         * inside the frame.
         */

        if (imageInner) {
          tl.fromTo(
            imageInner,
            {
              scale: 1.08,
            },
            {
              scale: 1,
              duration: 1.1,
              ease: "power2.out",
            },
            "<",
          );
        }

        /*
         * Divider line
         */

        tl.fromTo(
          line,
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.55",
        );
      });

      /*
       * =========================================
       * CLOSING STATEMENT
       * =========================================
       */

      gsap.fromTo(
        "[data-purpose='closing']",
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-purpose='closing']",
            start: "top 80%",
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
          STEPS
      ========================================= */}

      <div
        className="
          mx-auto
          mt-32
          max-w-7xl

          sm:mt-44

          lg:mt-56
        "
      >
        {STEPS.map((step, index) => {
          const reversed = index % 2 !== 0;

          return (
            <div
              key={step.number}
              data-purpose="step"
              className={`
                relative
                grid
                grid-cols-1
                gap-12
                border-t
                border-line/70
                py-16

                md:grid-cols-2
                md:items-center
                md:gap-16
                md:py-24

                lg:gap-28
                lg:py-32

                ${reversed ? "md:[&>div:first-child]:order-2" : ""}
              `}
            >
              {/* ===================================
                  CONTENT
              =================================== */}

              <div data-purpose="content" className="relative">
                <div className="flex items-center justify-between">
                  <span
                    data-purpose="number"
                    className="
                      font-mono
                      text-[10px]
                      uppercase
                      tracking-[0.12em]
                      text-ink/30
                    "
                  >
                    {step.number}
                  </span>

                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/30">
                    {step.eyebrow}
                  </span>
                </div>

                <div
                  data-purpose="line"
                  className="
                    mt-5
                    h-px
                    w-full
                    bg-line/70
                  "
                />

                <h3
                  className="
                    mt-8
                    max-w-xl
                    font-display
                    text-[clamp(2.5rem,4vw,5rem)]
                    font-medium
                    leading-[0.92]
                    tracking-[-0.05em]
                    text-ink
                  "
                >
                  {step.title}
                </h3>

                <p
                  className="
                    mt-7
                    max-w-md
                    font-body
                    text-sm
                    leading-6
                    text-ink/50

                    sm:text-base
                    sm:leading-7
                  "
                >
                  {step.description}
                </p>
              </div>

              {/* ===================================
                  IMAGE
              =================================== */}

              <div
                data-purpose="image"
                className="
                  relative
                  aspect-[4/3]
                  w-full
                  overflow-hidden
                  rounded-[8px]
                  border
                  border-ink/10
                  bg-paper-muted
                  shadow-[0_30px_70px_-40px_rgba(18,20,28,0.4)]
                "
              >
                <img
                  data-purpose="image-inner"
                  src={step.image}
                  alt={step.imageAlt}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    will-change-transform
                  "
                />

                {/* Subtle overlay */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-ink/15
                    via-transparent
                    to-transparent
                  "
                />

                {/* Image index */}

                <div
                  className="
                    absolute
                    bottom-4
                    left-4
                    rounded-full
                    border
                    border-white/30
                    bg-white/70
                    px-3
                    py-1.5
                    backdrop-blur-sm
                  "
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/60">
                    {step.eyebrow}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================
          CLOSING
      ========================================= */}

      <div
        data-purpose="closing"
        className="
          mx-auto
          mt-20
          max-w-7xl
          border-t
          border-line/70
          pt-10

          sm:mt-32
          sm:pt-12
        "
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h3
            className="
              max-w-3xl
              font-display
              text-[clamp(2.5rem,5vw,5.5rem)]
              font-medium
              leading-[0.9]
              tracking-[-0.055em]
              text-ink
            "
          >
            Know what matters.
            <br />
            Act before it matters.
          </h3>

          <p className="max-w-xs font-body text-sm leading-6 text-ink/45">
            One place for your contracts, dates, teams and the actions that
            follow.
          </p>
        </div>
      </div>
    </section>
  );
}
