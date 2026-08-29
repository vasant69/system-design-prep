export function SiteFooter() {
  return (
    <footer data-site-chrome className="mt-auto border-t border-border bg-secondary/20 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1.5 px-4 text-center text-xs text-muted-foreground sm:px-6">
        <span className="font-medium text-foreground/70">System Design Prep</span>
        <span>
          Personal interview-prep build. Content lives as MDX files, progress lives in your browser — nothing leaves
          your device.
        </span>
      </div>
    </footer>
  );
}
