"use client";

import { useState } from "react";

const links = [
  { label: "Purpose", href: "#purpose" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/85 text-zinc-100 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10" aria-label="Primary">
        <a href="#top" className="flex items-center gap-2 text-lg font-bold tracking-tight" onClick={() => setOpen(false)}>
          <span className="grid size-7 place-items-center rounded-lg bg-lime-300 text-sm text-zinc-950">R</span>
          renewly
        </a>

        <div className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
          {links.map((link) => <a key={link.href} href={link.href} className="transition-colors hover:text-white">{link.label}</a>)}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <a href="/login" className="text-sm text-zinc-400 transition-colors hover:text-white">Sign in</a>
          <a href="/register" className="rounded-full bg-lime-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-lime-200 active:scale-95">Start for free <span aria-hidden>→</span></a>
        </div>

        <button type="button" className="grid size-10 place-items-center rounded-full border border-white/15 text-white transition hover:bg-white/10 md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span className="flex w-4 flex-col gap-1.5"><i className={`h-px w-4 bg-current transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} /><i className={`h-px w-4 bg-current transition-opacity ${open ? "opacity-0" : ""}`} /><i className={`h-px w-4 bg-current transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} /></span>
        </button>
      </nav>

      {open && <div className="border-t border-white/10 bg-[#101012] px-5 py-5 sm:px-8 md:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-1"><p className="mb-2 text-[10px] font-medium uppercase tracking-[.16em] text-lime-300">Explore Renewly</p>{links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-base text-zinc-300 transition hover:bg-white/[.06] hover:text-white">{link.label}</a>)}<div className="mt-4 grid grid-cols-2 gap-3"><a href="/login" onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-4 py-3 text-center text-sm font-medium text-white">Sign in</a><a href="/register" onClick={() => setOpen(false)} className="rounded-full bg-lime-300 px-4 py-3 text-center text-sm font-semibold text-zinc-950">Start free →</a></div></div></div>}
    </header>
  );
}