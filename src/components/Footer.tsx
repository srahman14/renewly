const productLinks = [
  { label: "Purpose", href: "#purpose" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

const companyLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "mailto:hello@renewly.app" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#09090b] text-zinc-100">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="grid gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[1.25fr_.65fr_.65fr] lg:pb-16">
          <div className="max-w-sm">
            <a href="#top" className="flex items-center gap-2 text-lg font-bold tracking-tight"><span className="grid size-7 place-items-center rounded-lg bg-lime-300 text-sm text-zinc-950">R</span> renewly</a>
            <p className="mt-5 text-sm leading-relaxed text-zinc-400">Make every recurring payment an intentional choice—not a surprise on your bank statement.</p>
            <a href="/register" className="mt-6 inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-lime-200 active:scale-95">Build my dashboard <span className="ml-1">↗</span></a>
          </div>

          <FooterGroup title="Product" links={productLinks} />
          <FooterGroup title="Company" links={companyLinks} />
        </div>

        <div className="flex flex-col gap-5 pt-7 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Renewly. Keep what you love. Lose what you forgot.</p>
          <div className="flex items-center gap-5"><a href="https://x.com" className="transition hover:text-white">X</a><a href="https://linkedin.com" className="transition hover:text-white">LinkedIn</a><a href="mailto:hello@renewly.app" className="transition hover:text-white">Email</a></div>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return <div><h2 className="text-xs font-semibold uppercase tracking-[.16em] text-lime-300">{title}</h2><div className="mt-5 flex flex-col gap-3">{links.map((link) => <a key={link.href} href={link.href} className="w-fit text-sm text-zinc-400 transition hover:text-white">{link.label}</a>)}</div></div>;
}