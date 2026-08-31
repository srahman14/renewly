// components/landing/HeroScene.tsx

"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContractCard } from "./ContractCard";

gsap.registerPlugin(ScrollTrigger);

export function HeroScene() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=1800",
            scrub: 1,
            pin: true,
          },
        });

        tl
          // Hero copy moves away
          .to("[data-gsap='hero-copy']", {
            y: -180,
            opacity: 0,
            duration: 0.35,
          })

          // Contract moves toward centre
          .to(
            "[data-gsap='contract']",
            {
              y: -80,
              scale: 1.08,
              duration: 0.35,
            },
            "<",
          )

          // Renewal date becomes prominent
          .to(
            "[data-gsap='renewal-date']",
            {
              scale: 1.25,
              y: -10,
              duration: 0.25,
            },
            "-=0.1",
          )

          // Notice window visually activates
          .to("[data-gsap='notice-window']", {
            backgroundColor: "rgba(18, 20, 28, 0.06)",
            duration: 0.2,
          })

          // Safe date emerges
          .fromTo(
            "[data-gsap='safe-date']",
            {
              y: 40,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.35,
            },
          )

          // Emphasise result
          .to("[data-gsap='safe-date']", {
            scale: 1.05,
            duration: 0.2,
          });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.from("[data-gsap='hero-copy']", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.from("[data-gsap='contract']", {
          y: 50,
          opacity: 0,
          duration: 0.9,
          delay: 0.15,
          ease: "power3.out",
        });
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-paper"
    >
      <div className="relative h-full w-full">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-24 lg:px-12">
          <div className="grid w-full items-center gap-16 lg:grid-cols-[1fr_0.8fr]">
            {/* Editorial copy */}
            <div data-gsap="hero-copy" className="max-w-2xl">
              <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/40">
                Contract intelligence
              </p>

              <h1 className="font-display text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.055em] text-ink">
                The date that matters
                <span className="block text-ink/35">
                  isn&apos;t your renewal date.
                </span>
              </h1>

              <p className="mt-8 max-w-lg font-body text-lg leading-7 text-ink/55">
                Renewly works backwards from your contract terms to find the
                last safe day to cancel.
              </p>
            </div>

            {/* Product */}
            <div
              data-gsap="contract"
              className="flex justify-center lg:justify-end"
            >
              <ContractCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
