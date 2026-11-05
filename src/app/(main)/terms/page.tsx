import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for using Renewly.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of use"
      updated="5 November 2026"
      intro={
        <p>
          Renewly is a free portfolio project. By creating an account you agree to the points
          below.
        </p>
      }
    >
      <section>
        <h2>Use it as a helper, not a guarantee</h2>
        <p>
          Renewly works out deadlines from the dates and notice periods you enter. Check the
          details against your actual contract. We&apos;re not responsible for a renewal you miss
          or a charge you didn&apos;t cancel.
        </p>
      </section>

      <section>
        <h2>Your account</h2>
        <ul>
          <li>Keep your password to yourself. You&apos;re responsible for what happens under your account.</li>
          <li>Only invite people you trust into your workspace. They can see its contracts.</li>
          <li>Don&apos;t use Renewly to send spam or to try to reach other people&apos;s data.</li>
        </ul>
      </section>

      <section>
        <h2>No warranty</h2>
        <p>
          The service is provided as it is, without uptime promises. Features can change, and
          accounts that break these terms can be removed.
        </p>
      </section>
    </LegalPage>
  );
}
