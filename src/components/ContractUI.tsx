import { Bell, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Contract,
  urgencyFromContract,
  daysUntilDeadline,
  daysUntilRenewal,
  deadlineLabel,
  getCategoryIcon,
  getCategoryDotClass,
  SOON_BUFFER_DAYS,
} from "@/lib/contracts";

// Continuous green → amber → red urgency scale, computed per exact day
// count rather than a handful of fixed buckets — so two different day
// counts essentially never land on the same shade within the runway
// that matters (0 to SOON_BUFFER_DAYS days left), instead of everything
// from 1 to 14 days sharing one flat amber tint. Past that runway there's
// nothing left to grade against, so it settles into a calm, constant
// green — this is a computed gradient rather than Tailwind utility
// classes because there's no way to express "one shade per integer day"
// as a fixed set of class names.
function urgencyGradient(days: number) {
  const t = Math.max(0, Math.min(1, 1 - days / SOON_BUFFER_DAYS)); // 0 = far off, 1 = imminent

  // Two-segment hue sweep: green (142°) → amber (38°) for the first half
  // of the runway, then amber → red (0°) for the half closest to the
  // deadline — "sort of red" right at the end, not the whole back half.
  const hue = t <= 0.5 ? 142 - (142 - 38) * (t / 0.5) : 38 - 38 * ((t - 0.5) / 0.5);
  // Kept deliberately light/pastel across the whole range, not just the
  // far end — lightness only drifts from 90% down to 72%, so even "1 day
  // left" stays a soft tint rather than a solid, bold fill. Text stays a
  // darker version of the same hue throughout; never switches to white,
  // since the background never gets dark enough to need it.
  const saturation = 45 + t * 20;
  const lightness = 90 - t * 18;

  return {
    background: `hsl(${hue} ${saturation}% ${lightness}%)`,
    borderColor: `hsl(${hue} ${saturation}% ${Math.max(lightness - 18, 55)}%)`,
    color: `hsl(${hue} ${saturation}% ${Math.max(lightness - 48, 22)}%)`,
  };
}

// Shows days until the cancellation deadline (renewal date minus notice
// period) — not days until the renewal charge itself. Negative means
// you're already past the point where you could've given notice for this
// cycle. Deliberately NOT called "overdue" — nothing is late or unpaid,
// you've just missed the notice window, so the wording says exactly that
// instead of implying a missed charge.
export function DeadlinePill({ contract }: { contract: Contract }) {
  const level = urgencyFromContract(contract);
  const label = deadlineLabel(contract);

  // "Critical" (already past the deadline, locked in for this cycle) is
  // deliberately NOT part of the green→red gradient — it's a different
  // kind of state (nothing left to count down, not "getting worse"), so
  // it keeps its own fixed navy treatment rather than reading as "more
  // red than red."
  if (level === "critical") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-navy bg-navy px-2.5 py-1 font-mono text-[11px] text-amber-light">
        {label}
      </span>
    );
  }

  const days = daysUntilDeadline(contract);
  const style = urgencyGradient(days);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px]"
      style={style}
    >
      {label}
    </span>
  );
}

// Second, separate countdown — this one tracks the actual renewal/charge
// date, not the cancellation deadline. Deliberately only appears in the
// last-day window (renews today or tomorrow) so it reads as a final
// warning rather than competing with DeadlinePill for attention every day.
// Solid + bell + pulse, so it's unmistakably a different signal from the
// cancellation-deadline pill next to it.
export function RenewalWarningBadge({ contract }: { contract: Contract }) {
  if (contract.status === "cancelled") return null;

  const days = daysUntilRenewal(contract);
  if (days < 0 || days > 1) return null;

  const label = days === 0 ? "Renews today" : "Renews tomorrow";

  return (
    <span className="inline-flex items-center gap-1.5 rounded-[4px] bg-amber px-2.5 py-1 font-mono text-[11px] font-medium text-ink">
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/50" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink" />
      </span>
      <Bell className="h-3 w-3" />
      {label}
    </span>
  );
}

// Colour now reflects the computed urgency, not a manually-stored
// "flagged" status — so it always matches what DeadlinePill is showing.
export function StatusDot({ contract }: { contract: Contract }) {
  const color =
    contract.status === "cancelled"
      ? "bg-ink/25"
      : urgencyFromContract(contract) === "critical"
      ? "bg-amber"
      : "bg-teal";

  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />;
}

export function CategoryBadge({ category }: { category: string }) {
  const Icon = getCategoryIcon(category);
  const dotClass = getCategoryDotClass(category);

  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 font-mono text-[11px] text-ink/55">
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
      <Icon className="h-3 w-3 text-ink/45" />
      {category || "Uncategorised"}
    </span>
  );
}

// A permanent delete was previously one click inside a dropdown menu, with
// no confirmation and no undo — a real data-loss risk for something as
// consequential as a tracked contract. Shared here (not duplicated per
// page) so both the dashboard preview and the full contracts list confirm
// the same way.
export function DeleteConfirmDialog({
  contractName,
  onConfirm,
  onCancel,
}: {
  contractName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/40 px-4"
      role="alertdialog"
      aria-modal="true"
      aria-label="Confirm permanent deletion"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-sm rounded-md bg-white p-6 shadow-xl">
        <h3 className="font-display text-lg font-medium text-ink">Delete this contract?</h3>
        <p className="mt-2 font-body text-sm text-ink/60">
          This permanently removes <span className="font-medium text-ink">{contractName}</span> and
          can&apos;t be undone. If you just want to stop tracking it without losing the history, use
          Cancel instead.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[4px] border border-ink/20 px-4 py-2 text-sm font-medium text-ink/60 transition hover:bg-ink/5 hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-[4px] bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
          >
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
}

// "⋯" row menu: View details / Edit / Cancel (soft — sets status to
// cancelled) / Delete permanently (hard delete)
export function ActionsMenu({
  onViewDetails,
  onEdit,
  onCancel,
  onDeletePermanently,
  isCancelled,
}: {
  onViewDetails: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onDeletePermanently: () => void;
  isCancelled: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-[4px] p-1.5 text-ink/50 hover:bg-ink/5 hover:text-ink"
        aria-label="Contract actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onViewDetails}>View details</DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        {!isCancelled && (
          <DropdownMenuItem onClick={onCancel}>Cancel</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDeletePermanently} className="text-red-500">
          Delete permanently
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}