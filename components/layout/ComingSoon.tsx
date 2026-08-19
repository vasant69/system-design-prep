import type { LucideIcon } from "lucide-react";

// Shared shell for routes that are wired up (real URL, real nav entry) but
// whose feature ships in a later phase — Interview Mode, Revision, Progress,
// Search all use this in Phase 1.
export function ComingSoon({
  icon: Icon,
  title,
  description,
  phase,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
        <Icon className="h-6 w-6" />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <div className="mt-6 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
        Ships in {phase}
      </div>
    </div>
  );
}
