"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FOOTER_LINKS = [
  { label: "Purpose", href: "#purpose" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Register", href: "/register" },
];

const COMPANY_LINKS = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "T&Cs", href: "/terms" },
  { label: "Contact", href: "mailto:hello@renewly.app" },
];

const SUPPORT_LINKS = [
  { label: "Help", href: "#" },
  { label: "FAQ", href: "#faq" },
];

const SOCIALS = [
  { label: "X", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /*
         * =========================================
         * LINK COLUMNS
         * =========================================
         */

        gsap.fromTo(
          "[data-footer='links']",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );

        /*
         * =========================================
         * BOTTOM INFORMATION ROW
         * =========================================
         */

        gsap.fromTo(
          "[data-footer='meta']",
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "[data-footer='meta']",
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );

        /*
         * =========================================
         * WATERMARK
         *
         * The actual image rises very slightly
         * into position.
         * =========================================
         */

        gsap.fromTo(
          "[data-footer='watermark']",
          {
            y: 45,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: "[data-footer='watermark']",
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      return () => mm.revert();
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="
        w-full
        overflow-hidden
        bg-ink
        text-paper
      "
    >
      {/* =========================================
    PRODUCT / COMPANY / SUPPORT
========================================= */}
      <div
        data-footer="links"
        className="
    mx-auto
    flex
    max-w-7xl
    flex-col
    gap-14
    px-6
    py-14

    sm:px-10
    sm:py-16

    lg:flex-row
    lg:items-start
    lg:justify-between
    lg:px-12
    lg:py-20
  "
      >
        {/* =======================================
      LEFT SIDE — SUPPORTING MESSAGE
  ======================================= */}

        <div className="max-w-xs">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-paper/30">
            Renewly
          </p>

          <p
            className="
        mt-4
        font-display
        text-2xl
        font-medium
        leading-[1]
        tracking-[-0.035em]
        text-paper/90

        sm:text-3xl
      "
          >
            Contracts,
            <br />
            without the chaos.
          </p>

          <p className="mt-4 max-w-[240px] font-body text-sm leading-5 text-paper/35">
            Know what matters before it matters.
          </p>
        </div>

        {/* =======================================
      RIGHT SIDE — NAVIGATION
  ======================================= */}

        <div
          className="
      grid
      grid-cols-3
      gap-8

      sm:gap-x-16

      lg:gap-x-24
    "
        >
          {/* Product */}

          <div className="flex flex-col gap-3">
            <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/30">
              Product
            </p>

            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="
            w-fit
            font-body
            text-sm
            text-paper/60
            transition-colors
            duration-200
            hover:text-paper
          "
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Company */}

          <div className="flex flex-col gap-3">
            <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/30">
              Company
            </p>

            {COMPANY_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="
            w-fit
            font-body
            text-sm
            text-paper/60
            transition-colors
            duration-200
            hover:text-paper
          "
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Support */}

          <div className="flex flex-col gap-3">
            <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-paper/30">
              Support
            </p>

            {SUPPORT_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="
            w-fit
            font-body
            text-sm
            text-paper/60
            transition-colors
            duration-200
            hover:text-paper
          "
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* =========================================
          COPYRIGHT / LEGAL / SOCIALS
          
          Everything sits on ONE LINE on desktop.
      ========================================= */}
      <div
        data-footer="meta"
        className="
          border-t
          border-white/10
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            gap-5
            px-6
            py-6

            sm:px-10

            md:flex-row
            md:items-center
            md:justify-between

            lg:px-12
          "
        >
          {/* Copyright */}

          <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.08em] text-paper/30">
            © 2025 Renewly. All rights reserved.
          </p>

          {/* Legal + Social */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-6
              gap-y-3
            "
          >
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  font-mono
                  text-[9px]
                  uppercase
                  tracking-[0.08em]
                  text-paper/35
                  transition-colors
                  hover:text-paper
                "
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* =========================================
          WATERMARK LOGO
          
          IMPORTANT:
          This is an IMAGE, not text.
          
          Replace the src with your actual
          Renewly watermark asset.
      ========================================= */}
      <div
        data-footer="watermark"
        className="
          relative
          mt-10
          w-full
          px-4
          pb-3

          sm:mt-12
          sm:px-6
          sm:pb-5

          lg:mt-16
          lg:px-8
          lg:pb-6
        "
      >
        <img
          src="/icons/watermark-logo-light_upscaled.webp"
          alt="Renewly"
          className="
            block
            h-auto
            w-full
            object-contain
            object-bottom
          "
        />
      </div>
    </footer>
  );
}
