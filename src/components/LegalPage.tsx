import type { ReactNode } from "react";

// Shared shell for /privacy and /terms — same type scale as /sources.
export default function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm font-medium uppercase tracking-wide text-navy">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight text-zinc-900 md:text-4xl">
        {title}
      </h1>
      <p className="mt-2 font-mono text-xs text-zinc-500">Last updated {updated}</p>
      <div className="mt-6 max-w-xl leading-relaxed text-zinc-600">{intro}</div>
      <div className="mt-14 space-y-10 [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-zinc-900 [&_li]:mt-1.5 [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-zinc-600 [&_section]:border-b [&_section]:border-zinc-200 [&_section]:pb-10 [&_section:last-child]:border-none [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-zinc-600">
        {children}
      </div>
    </div>
  );
}
