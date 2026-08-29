// Hand-rolled element styling for MDX body content (no @tailwindcss/typography
// dependency — we want full control since the Hinglish/English boxes need to
// visually stand apart from plain prose, not blend into a generic ".prose").
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

export function h1(props: ComponentPropsWithoutRef<"h1">) {
  return (
    <h1
      {...props}
      className={cn(
        "mt-0 scroll-mt-24 font-[family-name:var(--font-display)] text-[2rem] font-medium tracking-tight",
        props.className,
      )}
    />
  );
}
export function h2(props: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      {...props}
      className={cn(
        "mt-12 scroll-mt-24 border-b border-border pb-2 text-[1.6rem] font-semibold tracking-tight",
        props.className,
      )}
    />
  );
}
export function h3(props: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3 {...props} className={cn("mt-9 scroll-mt-24 text-[1.28rem] font-semibold tracking-tight", props.className)} />
  );
}
export function h4(props: ComponentPropsWithoutRef<"h4">) {
  return <h4 {...props} className={cn("mt-7 scroll-mt-24 text-[1.08rem] font-semibold", props.className)} />;
}
export function p(props: ComponentPropsWithoutRef<"p">) {
  return <p {...props} className={cn("my-4 text-[1.0625rem] leading-[1.85] text-foreground/90", props.className)} />;
}
export function ul(props: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      {...props}
      className={cn(
        "my-4 list-disc space-y-2 pl-6 text-[1.0625rem] leading-[1.85] text-foreground/90 marker:text-muted-foreground/60",
        props.className,
      )}
    />
  );
}
export function ol(props: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      {...props}
      className={cn(
        "my-4 list-decimal space-y-2 pl-6 text-[1.0625rem] leading-[1.85] text-foreground/90 marker:text-muted-foreground/60",
        props.className,
      )}
    />
  );
}
export function li(props: ComponentPropsWithoutRef<"li">) {
  return <li {...props} className={cn("pl-1", props.className)} />;
}
export function a(props: ComponentPropsWithoutRef<"a">) {
  // Heading anchor links (rehype-autolink-headings, "# " suffix) get a
  // muted low-key treatment instead of the normal blue-underline link
  // style — they're a copy-link affordance, not body-text prose.
  if (props.className?.includes("anchor-link")) {
    return (
      <a
        {...props}
        className={cn(
          "font-normal text-muted-foreground/40 no-underline transition-colors hover:text-sky-600 dark:hover:text-sky-400",
          props.className,
        )}
      />
    );
  }
  return (
    <a
      {...props}
      className={cn(
        "font-medium text-sky-600 underline decoration-sky-600/30 underline-offset-4 transition-colors hover:decoration-sky-600 dark:text-sky-400 dark:decoration-sky-400/30 dark:hover:decoration-sky-400",
        props.className,
      )}
    />
  );
}
export function blockquote(props: ComponentPropsWithoutRef<"blockquote">) {
  return (
    <blockquote {...props} className={cn("my-4 border-l-2 border-border pl-4 italic text-muted-foreground", props.className)} />
  );
}
export function hr(props: ComponentPropsWithoutRef<"hr">) {
  return <hr {...props} className={cn("my-8 border-border", props.className)} />;
}
export function strong(props: ComponentPropsWithoutRef<"strong">) {
  return <strong {...props} className={cn("font-semibold text-foreground", props.className)} />;
}
export function code(props: ComponentPropsWithoutRef<"code">) {
  return (
    <code
      {...props}
      className={cn(
        "rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground/90",
        props.className,
      )}
    />
  );
}
export function table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border shadow-[var(--shadow-card)]">
      <table {...props} className={cn("w-full border-collapse text-[0.95rem]", props.className)} />
    </div>
  );
}
export function thead(props: ComponentPropsWithoutRef<"thead">) {
  return <thead {...props} className={cn("bg-secondary/70", props.className)} />;
}
export function th(props: ComponentPropsWithoutRef<"th">) {
  return <th {...props} className={cn("border-b border-border px-3 py-2 text-left font-semibold text-foreground", props.className)} />;
}
export function td(props: ComponentPropsWithoutRef<"td">) {
  return <td {...props} className={cn("border-b border-border/60 px-3 py-2 align-top text-foreground/90", props.className)} />;
}
