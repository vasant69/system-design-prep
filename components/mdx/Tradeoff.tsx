import { Check, X } from "lucide-react";

export function Tradeoff({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">Pros</div>
        <ul className="space-y-2 text-sm leading-relaxed text-foreground/90">
          {pros.map((pro) => (
            <li key={pro} className="flex gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-red-500/25 bg-red-500/[0.06] p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-300">Cons</div>
        <ul className="space-y-2 text-sm leading-relaxed text-foreground/90">
          {cons.map((con) => (
            <li key={con} className="flex gap-2">
              <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
