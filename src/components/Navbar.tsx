"use client";

import { useState } from "react";

const NAV_LINKS = [
  { label: "Purpose", href: "#purpose" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-10"
        aria-label="Primary"
      >
        <a
          href="/"
          className="flex items-center gap-2 font-display text-xl font-medium tracking-tight text-ink"
        >
          {/* <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-navy text-[13px] font-mono text-amber-light"
          >
            R
          </span> */}
          Renewly
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-[15px] text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href="/login"
            className="font-body text-[15px] text-ink/70 transition-colors hover:text-ink"
          >
            Sign in
          </a>
          <a
            href="/register"
            className="rounded-[4px] bg-ink px-4 py-2 font-body text-[15px] font-medium text-paper transition-colors hover:bg-navy"
          >
            Get started free
          </a>
        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-line md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="flex flex-col gap-[5px]">
            <span
              className={`h-[1.5px] w-4 bg-ink transition-transform ${open ? "translate-y-[6.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-[1.5px] w-4 bg-ink transition-opacity ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`h-[1.5px] w-4 bg-ink transition-transform ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`}
            />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-paper px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-body text-[15px] text-ink/80"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#hero-cta"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-[4px] bg-ink px-4 py-2 text-center font-body text-[15px] font-medium text-paper"
            >
              Get started free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
