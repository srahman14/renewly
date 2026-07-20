"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        {/* Logo */}

        <Link
          href="/dashboard"
          className="font-display text-xl font-medium tracking-tight text-ink"
        >
          Renewly
        </Link>

        {/* Desktop navigation */}

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/dashboard"
            className="font-body text-[15px] font-medium text-ink"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/contracts"
            className="font-body text-[15px] text-ink/60 transition-colors hover:text-ink"
          >
            Contracts
          </Link>

          <Link
            href="/dashboard/alerts"
            className="font-body text-[15px] text-ink/60 transition-colors hover:text-ink"
          >
            Alerts
          </Link>

          <Link
            href="/dashboard/settings"
            className="font-body text-[15px] text-ink/60 transition-colors hover:text-ink"
          >
            Settings
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Avatar */}

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy font-mono text-[13px] text-amber-light">
            U
          </div>

          {/* Mobile menu button */}

          <button onClick={() => setOpen(!open)} className="md:hidden text-ink">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}

      {open && (
        <div className="border-t border-line bg-paper px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            <Link
              href="/dashboard"
              className="font-body text-ink"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/contracts"
              className="font-body text-ink/60"
              onClick={() => setOpen(false)}
            >
              Contracts
            </Link>

            <Link
              href="/dashboard/alerts"
              className="font-body text-ink/60"
              onClick={() => setOpen(false)}
            >
              Alerts
            </Link>

            <Link
              href="/dashboard/settings"
              className="font-body text-ink/60"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>

            <button className="mt-3 rounded bg-ink px-4 py-2 text-sm text-paper">
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
