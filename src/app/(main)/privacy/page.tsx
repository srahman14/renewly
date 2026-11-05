import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Renewly stores, why, and how to delete it.",
};

const REPO_ISSUES = "https://github.com/srahman14/renewly/issues";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="What we store, and why"
      updated="5 November 2026"
      intro={
        <p>
          Renewly is a portfolio project, not a commercial service. It only keeps what it needs
          to track your renewals and remind you about them.
        </p>
      }
    >
      <section>
        <h2>What we store</h2>
        <ul>
          <li>Your name, email address and hashed password, so you can sign in.</li>
          <li>Your account type and, for teams, your company name.</li>
          <li>
            The contracts you add: provider, name, cost, billing cycle, renewal date, notice
            period, owners and any link you save.
          </li>
          <li>Invites you send: the invitee&apos;s email address and role.</li>
          <li>A log of which reminder emails were sent, so nobody gets the same one twice.</li>
        </ul>
      </section>

      <section>
        <h2>Who processes it</h2>
        <ul>
          <li>Supabase hosts the database and handles sign-in.</li>
          <li>Resend sends the reminder and invite emails.</li>
          <li>Vercel hosts the site.</li>
        </ul>
        <p>We don&apos;t sell your data, run ads or use third-party analytics.</p>
      </section>

      <section>
        <h2>Who can see it</h2>
        <p>
          Contracts belong to a workspace. Only members of that workspace can see them, and
          row-level security in the database enforces that, not only the interface.
        </p>
      </section>

      <section>
        <h2>Deleting your data</h2>
        <p>
          Delete your account any time from{" "}
          <Link href="/dashboard/settings" className="text-navy underline underline-offset-2">
            Settings
          </Link>
          . If you&apos;re the only member of your workspace, the workspace and its contracts are
          deleted with it.
        </p>
      </section>

      <section>
        <h2>Questions</h2>
        <p>
          Open an issue on{" "}
          <a
            href={REPO_ISSUES}
            target="_blank"
            rel="noopener noreferrer"
            className="text-navy underline underline-offset-2"
          >
            GitHub
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
