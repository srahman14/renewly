import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Status, urgency, getCategoryIcon, getCategoryBadgeClass } from "@/lib/contracts";

export function DeadlinePill({ daysLeft }: { daysLeft: number }) {
  const level = urgency(daysLeft);

  if (level === "critical") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-navy bg-navy px-2.5 py-1 font-mono text-[11px] text-amber-light">
        {daysLeft}d left
      </span>
    );
  }

  if (level === "soon") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/30 bg-amber/10 px-2.5 py-1 font-mono text-[11px] text-amber">
        {daysLeft}d left
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-2.5 py-1 font-mono text-[11px] text-teal">
      {daysLeft}d left
    </span>
  );
}

export function StatusDot({ status }: { status: Status }) {
  const color =
    status === "active"
      ? "bg-teal"
      : status === "flagged"
      ? "bg-amber"
      : "bg-ink/25";

  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />;
}

export function CategoryBadge({ category }: { category: string }) {
  const Icon = getCategoryIcon(category);
  const badgeClass = getCategoryBadgeClass(category);

  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] ${badgeClass}`}>
      <Icon className="h-3 w-3" />
      {category || "Uncategorised"}
    </span>
  );
}

// "⋯" row menu: Edit / Cancel (soft — sets status to cancelled) / Delete permanently (hard delete)
export function ActionsMenu({
  onEdit,
  onCancel,
  onDeletePermanently,
  isCancelled,
}: {
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