const FOOTER_LINKS = [
  { label: "Purpose", href: "#purpose" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "mailto:hello@renewly.app" },
];

const SOCIALS = [
  { label: "X", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

export default function Footer() {
  return (
    <footer className="mt-80 bg-ink">
      {/* CTA band */}
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <h2 className="max-w-md font-display text-3xl font-medium leading-[1.15] tracking-tight text-paper sm:text-4xl">
            Stop losing money to dates you didn&apos;t track.
          </h2>
          <p className="mt-4 max-w-sm font-body text-base text-paper/60">
            Add your first contract in under two minutes and get your first
            deadline calculated on the spot.
          </p>
          <a
            href="#hero-cta"
            className="mt-7 inline-block rounded-[4px] bg-amber px-6 py-3 font-body text-[15px] font-medium text-ink transition-colors hover:bg-amber-light"
          >
            Get started free
          </a>
        </div>

        {/* Vector illustration echoing the deadline-card motif */}
        <div className="hidden justify-self-end lg:block" aria-hidden="true">
          <svg
            width="280"
            height="220"
            viewBox="0 0 280 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="40"
              y="10"
              width="200"
              height="150"
              rx="8"
              fill="#1E2A45"
              stroke="#33405E"
            />
            <line
              x1="40"
              y1="46"
              x2="240"
              y2="46"
              stroke="#33405E"
              strokeDasharray="2 6"
            />
            <rect x="60" y="64" width="90" height="8" rx="4" fill="#5FA79A" opacity="0.7" />
            <rect x="60" y="82" width="140" height="6" rx="3" fill="#2B3A5C" />
            <rect x="60" y="96" width="120" height="6" rx="3" fill="#2B3A5C" />
            <rect
              x="60"
              y="118"
              width="160"
              height="30"
              rx="4"
              fill="#DC9F3D"
            />
            <rect x="72" y="126" width="70" height="6" rx="3" fill="#12141C" opacity="0.6" />
            <rect x="72" y="136" width="40" height="5" rx="2.5" fill="#12141C" opacity="0.4" />
            <circle cx="222" cy="30" r="4" fill="#5FA79A" />
            <circle cx="60" cy="30" r="4" fill="#5FA79A" opacity="0.5" />
            <rect
              x="16"
              y="70"
              width="200"
              height="150"
              rx="8"
              fill="#12141C"
              stroke="#33405E"
              strokeWidth="1"
            />
            <line
              x1="16"
              y1="106"
              x2="216"
              y2="106"
              stroke="#33405E"
              strokeDasharray="2 6"
            />
            <rect x="36" y="124" width="70" height="8" rx="4" fill="#DC9F3D" opacity="0.8" />
            <rect x="36" y="142" width="120" height="6" rx="3" fill="#2B3A5C" />
            <rect x="36" y="156" width="100" height="6" rx="3" fill="#2B3A5C" />
            <rect
              x="36"
              y="178"
              width="140"
              height="26"
              rx="4"
              fill="#1F7A6C"
            />
            <rect x="48" y="187" width="60" height="6" rx="3" fill="#F2F3F1" opacity="0.85" />
          </svg>
        </div>
      </div>

      {/* Nav row */}
      <div className="border-t border-line-dark">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:items-start md:justify-between md:px-10">
          <a
            href="#top"
            className="flex items-center gap-2 font-display text-lg font-medium tracking-tight text-paper"
          >
            <span
              aria-hidden="true"
              className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-amber text-[13px] font-mono text-ink"
            >
              R
            </span>
            Renewly
          </a>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-sm text-paper/60 transition-colors hover:text-paper"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div className="border-t border-line-dark">
          <div className="mx-auto flex max-w-content flex-col-reverse items-center gap-4 px-6 py-6 text-center md:flex-row md:justify-between md:px-10 md:text-left">
            <p className="font-mono text-xs text-paper/40">
              © {new Date().getFullYear()} Renewly. All rights reserved.
            </p>
            <div className="flex gap-6">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="font-mono text-xs text-paper/50 transition-colors hover:text-paper"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
