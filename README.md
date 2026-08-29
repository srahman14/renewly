<div align="center">
  <img src="./public/icons/watermark-logo-light.png" alt="renewly-logo"/>
</div>

A shared dashboard for small teams to track every paid tool and contract they use, cost, renewal date, owner, and cancellation notice window, with alerts before auto-renewal traps hit.

## Why this exists

Most "subscription tracker" tools stop at storing a renewal date. That's not actually the hard part, and it's not what costs teams money. The thing that costs money is missing the window in which you're *allowed* to cancel, because real contracts don't say "renews on X," they say things like:

- "Auto-renews annually unless cancelled 60 days before the renewal date"
- "Rolling monthly, 30-day notice, but notice can only be given on the 1st of the month"
- Notice windows that themselves change after the first renewal

Renewly's actual job is computing a derived **last-safe-cancellation-date** from a renewal date plus a notice rule correctly, across edge cases like month-end dates and leap years — rather than just holding a date someone typed in. Everything else (org accounts, contract CRUD, member management) is necessary scaffolding in service of that, not the product itself.

The secondary goal, once contracts exist as structured data rather than a spreadsheet: answer "what's our total recurring spend, how is it trending, and what's coming due next quarter" — the question a spreadsheet answers badly and a real tool should answer well.

## Core features

**Contracts**
- Full CRUD — create, view, edit, cancel, mute, delete — all RLS-scoped to the org, all optimistically updated via TanStack Query.
- Multi-owner support: a contract can have several members tagged as owner via a searchable, avatar-driven multi-select.

**Organizations & members**
- Every account gets its own org automatically at signup (the "org of one" pattern) — individual and team accounts share one data model rather than branching into separate schemas.
- Org members page: view all members, change roles, remove members — owner-only actions, enforced at the database level via RLS, not just hidden in the UI.

**Team invites**
- Owners invite by email with a role attached; invite creates a token-based link.
- Recipient sees an org preview (name, inviter, role) before signing in — including a definitive warning if accepting will remove them from a workspace they're currently in.
- Accepting is atomic: if the invitee was previously a solo member of their own org, that org is cleanly migrated away from (and cleaned up if they were its only member) in a single transaction — no partial states possible.
- Invite emails send via Resend; a copyable link is always shown as a fallback regardless of email delivery outcome.
- Duplicate invites and invites to existing members are both rejected at the database level, not just the UI.

**Account & profile**
- Profile editing (name, account type).
- Account deletion, with real handling for the "what happens to my org" question: cascades if you're a sole owner, blocked with a clear message if you co-own a multi-person org (ownership transfer isn't built yet), and a clean membership removal if you're a regular member.

## Tech stack

- **Framework:** Next.js (App Router), TypeScript
- **Backend:** Supabase (Postgres + Auth + Row Level Security)
- **Client state:** Zustand — auth/session only
- **Server state:** TanStack Query — everything that comes from the database
- **Styling:** Tailwind CSS, Base UI (`@base-ui/react`), shadcn-ui conventions
- **Email:** Resend
- **Fonts:** Fraunces (display), Work Sans (body), IBM Plex Mono (dates, numbers, tokens)

## Architecture

```
Supabase Auth
      │
      ▼
Zustand (useAuthStore)
  • user, session — client-owned state only
      │ userId
      ▼
TanStack Query
  • profile, contracts, org members, invites, orgs
  • owns all fetching, caching, and mutation of server data
      │
      ▼
Services (lib/services/*.service.ts)
  • the only code that talks to Supabase directly
      │
      ├─── ordinary CRUD ──────► Supabase client, protected by RLS
      │
      └─── privileged actions ─► app/api/* route handlers
                                     │
                                     ▼
                                Supabase admin client (service-role, server-only)
```

**The rule that governs the services/API split:** if an operation can be safely expressed as an RLS-protected query, it's a service function called directly from the client — no API route. A route handler only exists when an operation genuinely needs something the browser can't have: a service-role key (account deletion), a third-party secret (Resend), or an atomic multi-table transaction, which is handled via a `SECURITY DEFINER` Postgres function where possible rather than a route at all (invite acceptance is the reference example — see Data model below).

**Why Zustand holds almost nothing:** every attempt to put server-derived data (active org, profile) into Zustand was deliberately reverted during development. Server state belongs in TanStack Query, full stop. Zustand holds `user`/`session` because that's genuinely client-owned; everything else is derived by composing `useAuthStore` → `useUserProfileQuery` → `profile.org_id` at the point of use.

### Data model

- **`orgs`** — one row per organization/workspace.
- **`profiles`** — one row per user, includes `org_id`, `account_type`, onboarding state.
- **`org_members`** — composite key `(org_id, user_id)`, `role` is `owner` or `member`.
- **`contracts`** — the core entity. `owner_ids` is a `uuid[]` referencing members who own that contract (an array, not a join table — simpler for now; revisit if per-member contract visibility becomes a real RLS requirement).
- **`invites`** — pending invitations, keyed by a random `token` (not the row `id`), with `status`, `expires_at`, and DB-level constraints preventing duplicate pending invites or invites to existing members.

Every table is multi-tenant-isolated via **Row Level Security**, scoped through `SECURITY DEFINER` helper functions (`is_org_member`, `is_org_owner`) rather than direct policy subqueries on `org_members` — direct subqueries there caused RLS recursion.

**A structural gotcha worth knowing before touching this schema:** `org_id` exists on both `profiles.org_id` and `org_members.org_id`. These can drift out of sync — this happened once, from manually-inserted test data, and cost a full debugging session to trace back to an RLS policy correctly enforcing a data inconsistency nobody had noticed. Every write path that changes org membership must update both tables in the same transaction. `accept_invite()` is the reference implementation: it updates `profiles.org_id` **before** any operation that could delete the old org, since Postgres cascades on delete and doing this out of order can wipe out a user's entire profile row, not just orphan a column.

## Known limitations

- **Migrations aren't version-controlled.** Schema exists only in the live Supabase project — every table, policy, and function in this README was applied directly via the SQL editor during development. This is the most pressing gap; see Roadmap.
- **No ownership transfer.** An owner of a multi-person org cannot currently delete their account or leave without first manually reassigning ownership via a role change — there's no guided transfer flow.
- **Notice-period deadline engine doesn't exist yet.** This is the actual differentiating feature described above — contracts currently store raw fields (renewal date, notice days, cycle) but nothing computes the derived last-safe-cancellation-date across real edge cases yet.
- **No notification delivery.** No scheduled reminder worker exists. Building one safely requires idempotent job design (a `notifications_sent` ledger, retry/backoff) — not started.
- **Spend analytics is a pure client-side derivation** over the in-memory contracts list. Fine at current scale; would need a Postgres view or RPC if it becomes a real feature at volume.
- **Email deliverability is limited.** Invite emails currently send from Resend's shared test address (`onboarding@resend.dev`), which only delivers to the sending account's own inbox. A verified domain is required before invites can reach arbitrary recipients.
- **RLS policies reflect today's owner/member model only** — not yet reviewed against a more granular permissions system, if one gets built.

## Getting started

```bash
npm install
npm run dev
```

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # server-only — never expose to the client
RESEND_API_KEY=                  # server-only
NEXT_PUBLIC_APP_URL=             # used to build invite links in emails
```

`SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` are only ever read inside `app/api/*` route handlers or `lib/supabase/admin.ts`.

Database schema and RLS policies currently need to be applied by hand via the Supabase SQL editor before running the app against a fresh project, since there's no committed migration history yet (see Known limitations).

### Project structure

```
src/
├── app/
│   ├── api/                # route handlers — only for operations needing server-only secrets
│   ├── dashboard/
│   ├── org/members/
│   ├── invite/[token]/
│   └── ...
├── components/
├── lib/
│   ├── services/            # Supabase access — the only files that import a Supabase client directly
│   ├── queries/               # TanStack Query hooks wrapping the services
│   ├── stores/                 # Zustand — auth/session state only
│   ├── supabase/                # client, server, and admin (service-role) Supabase client factories
│   └── utils/
```
