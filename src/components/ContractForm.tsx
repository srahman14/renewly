"use client";

import { useState } from "react";
import {
  Contract,
  CATEGORIES,
  MAX_NOTICE_DAYS,
  isNoticeDaysReasonable,
  parseDateOnly,
  toDateOnlyString,
} from "@/lib/contracts";
import { format } from "date-fns";
import { ChevronDownIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  initialData: Contract | null;
  onSave: (contract: Contract) => void;
  onClose: () => void;
}

export default function ContractForm({ initialData, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    company: initialData?.company ?? "",
    name: initialData?.name ?? "",
    monthlySpend: initialData?.monthlySpend?.toString() ?? "",
    cycle: initialData?.cycle ?? "",
    // Always kept as a plain "YYYY-MM-DD" string end to end — never a
    // locale-formatted display string, never round-tripped through
    // toISOString(). parseDateOnly/toDateOnlyString here defensively
    // re-normalise it even if older stored data is in the old broken
    // display-string format, so editing a contract saved before this fix
    // still recovers the right date instead of failing to parse.
    renewalDate: initialData?.renewsOn
      ? toDateOnlyString(parseDateOnly(initialData.renewsOn))
      : "",
    owner: initialData?.owner ?? "",
    team: initialData?.team ?? "",
    category: initialData?.category ?? "",
    noticeDays: initialData?.noticeDays?.toString() ?? "",
    url: initialData?.url ?? "",
  });

  const [error, setError] = useState("");

  // The native <input type="url"> constraint requires a full scheme
  // (https://) to count as valid — a bare domain like "spotify.com" fails
  // that check and silently blocks form submission. Rather than force
  // people to type https:// themselves, accept the bare form and add it
  // here. Only touches the value if no scheme is already present, so a
  // deliberately-entered http:// link isn't rewritten.
  function normaliseUrl(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  function update(field: string, value: string | number | null) {
    setForm((previous) => ({
      ...previous,
      [field]: value ?? "",
    }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.company ||
      form.monthlySpend === "" ||
      form.monthlySpend === null ||
      !form.cycle ||
      !form.renewalDate ||
      !form.owner ||
      !form.category ||
      form.noticeDays === "" ||
      form.noticeDays === null
    ) {
      setError("Please complete all required fields.");

      return;
    }

    // A notice period longer than the billing cycle itself is
    // impossible to satisfy — there's no point in the cycle where
    // enough runway is left to give that much notice, so the deadline
    // would land in the past for every cycle, forever. Reject it here
    // rather than letting it get created.
    if (
      !isNoticeDaysReasonable(
        Number(form.noticeDays),
        form.cycle as Contract["cycle"],
      )
    ) {
      setError(
        `Notice period can't exceed ${MAX_NOTICE_DAYS[form.cycle as Contract["cycle"]]} days for a ${form.cycle} contract.`,
      );

      return;
    }

    const renewalDate = parseDateOnly(form.renewalDate);

    const daysLeft = Math.max(
      0,
      Math.ceil(
        (renewalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      ),
    );

    const contract: Contract = {
      id: initialData?.id ?? crypto.randomUUID(),

      company: form.company,

      name: form.name,

      owner: form.owner,

      team: form.team,

      category: form.category,

      url: form.url.trim() ? normaliseUrl(form.url) : undefined,

      monthlySpend: Number(form.monthlySpend),

      cycle: form.cycle as Contract["cycle"],

      // Plain "YYYY-MM-DD" — the single source of truth every date
      // function in lib/contracts.ts expects. Previously this stored a
      // locale-formatted display string ("4 Sept 2026"), which nothing
      // downstream could parse reliably. form.renewalDate is already
      // kept in this exact shape by the calendar's onSelect below, so
      // there's nothing left to convert here.
      renewsOn: form.renewalDate,

      noticeDays: Number(form.noticeDays),

      // Legacy field, not read anywhere pages actually compute from
      // (see lib/contracts.ts) — kept only so the type still matches.
      // Stored as a plain date string too now, for consistency.
      deadline: toDateOnlyString(
        new Date(renewalDate.getTime() - Number(form.noticeDays) * 86400000),
      ),

      daysLeft,

      // Urgency (flagged/soon/clear) is computed live from
      // renewsOn/noticeDays everywhere it's actually used — see
      // urgencyFromContract in lib/contracts.ts. The only status value
      // that matters as *stored* data is "cancelled" (a soft-cancel a
      // person explicitly chose), so preserve that across edits and
      // otherwise just default to "active" rather than guessing at a
      // "flagged" state that'll immediately go stale.
      status: initialData?.status ?? "active",

      // keep the original creation date when editing, stamp a new one when adding
      createdAt: initialData?.createdAt ?? new Date().toISOString(),
    };

    onSave(contract);
  }

  function clearForm() {
    setForm({
      company: "",
      name: "",
      monthlySpend: "",
      cycle: "",
      renewalDate: "",
      owner: "",
      team: "",
      category: "",
      noticeDays: "",
      url: "",
    });

    setError("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-medium text-ink">
              {initialData ? "Edit Contract" : "Add Contract"}
            </h2>
            <p className="text-sm text-muted-foreground">Add the contract details to track key dates, stay ahead of renewals, and avoid missed deadlines. </p>
          </div>

          <button
            onClick={onClose}
            className="text-ink/50 hover:text-ink cursor-pointer"
          >
            <X />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="flex items-center justfiy-start gap-2">
            <div>
              <label className="text-sm text-foreground">Company name *</label>

              <input
                placeholder="Spotify"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-foreground">Contract name</label>

              <input
                placeholder="Premium Membership"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
            </div>
          </div>

          <label className="text-sm text-foreground">Monthly Cost</label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="21.99"
            value={form.monthlySpend}
            onChange={(e) =>
              update(
                "monthlySpend",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="w-full rounded border px-3 py-2"
          />

          <label className="text-sm text-foreground">Billing Cycle</label>
          <Select
            value={form.cycle}
            onValueChange={(value) => update("cycle", value)}
          >
            <SelectTrigger className="w-full rounded border px-3 py-5">
              <SelectValue placeholder="Monthly/Quartely/Annual" />
            </SelectTrigger>

            <SelectContent className={"p-2"}>
              <SelectItem value="Monthly">Monthly</SelectItem>

              <SelectItem value="Quarterly">Quarterly</SelectItem>

              <SelectItem value="Annual">Annual</SelectItem>
            </SelectContent>
          </Select>

          <label className="text-sm text-foreground">Category</label>
          <Select
            value={form.category}
            onValueChange={(value) => update("category", value)}
          >
            <SelectTrigger className="w-full rounded border px-3 py-5">
              <SelectValue placeholder="12+ Categories..." />
            </SelectTrigger>

            <SelectContent>
              {CATEGORIES.map(({ value, label, icon: Icon }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-ink/60" />
                    {label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 items-center justify-start flex-wrap">
            <div className="flex-1">
              <label className="text-sm text-foreground">Owner/s</label>

              <input
                placeholder="Owner *"
                value={form.owner}
                onChange={(e) => update("owner", e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-sm text-foreground">Renewal date</label>

              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="justify-between text-left font-normal px-3 py-5"
                    >
                      {form.renewalDate ? (
                        format(parseDateOnly(form.renewalDate), "PPP")
                      ) : (
                        <span className="text-gray-500">
                          Pick renewal date *
                        </span>
                      )}

                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  }
                />

                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={
                      form.renewalDate
                        ? parseDateOnly(form.renewalDate)
                        : undefined
                    }
                    // A renewal date is always meant to be the next upcoming charge —
                    // a past date isn't valid input, it's just bad data that would
                    // force getNextRenewalDate to silently guess how many cycles to
                    // roll forward to reach something real. Block it here instead.
                    disabled={{
                      before: new Date(new Date().setHours(0, 0, 0, 0)),
                    }}
                    onSelect={(date) => {
                      // toDateOnlyString reads the calendar's local date components
                      // directly — never toISOString(), which converts through UTC
                      // and shifts the date back a day in any positive-offset
                      // timezone (BST included). This is the actual fix for the
                      // "calendar always picks a day behind" bug.
                      update("renewalDate", date ? toDateOnlyString(date) : "");
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <label className="text-sm text-foreground">Team/s</label>
          <input
            placeholder="Team (optional)"
            value={form.team}
            onChange={(e) => update("team", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />

          <label className="text-sm text-foreground">Link</label>
          <input
            type="text"
            placeholder="Management/cancellation link (optional)"
            value={form.url}
            onChange={(e) => update("url", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />

          <label className="text-sm text-foreground">Notice Days</label>
          <input
            type="number"
            min="0"
            placeholder="Cancellation notice days *"
            value={form.noticeDays}
            onChange={(e) =>
              update(
                "noticeDays",
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            className="w-full rounded border px-3 py-2"
          />

          {form.cycle && (
            <p className="text-xs text-ink/40">
              Up to {MAX_NOTICE_DAYS[form.cycle as Contract["cycle"]]} days for
              a {form.cycle.toLowerCase()} contract.
            </p>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-between gap-3 pt-6">
            <div className="flex gap-2">
              <Button
                onClick={clearForm}
                variant={"destructive"}
                className="rounded-md cursor-pointer border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                Clear
              </Button>

              <Button
                onClick={onClose}
                variant={"ghost"}
                className="rounded-md cursor-pointer border border-ink/20 px-4 py-2 text-sm font-medium text-ink/60 transition hover:bg-ink/5 hover:text-ink"
              >
                Cancel
              </Button>
            </div>

            <Button
              type="submit"
              variant={"default"}
              className="rounded-md cursor-pointer bg-ink px-5 py-2 text-sm font-medium text-white transition hover:bg-navy"
            >
              Save Contract
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
