// Visual identity per section — used across home, section, and topic pages
// so each area of the site reads as its own "world" instead of everything
// being the same neutral gray.
//
// Every class string below is a full literal (never composed at runtime via
// template strings) — Tailwind's build-time scanner only finds classes that
// appear as literal text in source, so e.g. `hoverBorder` is written out in
// full here rather than as `` `hover:${border}` `` in a component.
export type SectionTheme = {
  gradient: string;
  iconBg: string;
  iconColor: string;
  border: string;
  hoverBorder: string;
  text: string;
  ring: string;
  progressBar: string;
};

const THEMES: Record<string, SectionTheme> = {
  "system-design": {
    gradient: "from-sky-500/20 via-sky-500/5 to-transparent",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-400",
    border: "border-sky-500/30",
    hoverBorder: "hover:border-sky-500/40",
    text: "text-sky-400",
    ring: "ring-sky-500/40",
    progressBar: "bg-sky-400",
  },
  "api-design": {
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    border: "border-violet-500/30",
    hoverBorder: "hover:border-violet-500/40",
    text: "text-violet-400",
    ring: "ring-violet-500/40",
    progressBar: "bg-violet-400",
  },
  databases: {
    gradient: "from-teal-500/20 via-teal-500/5 to-transparent",
    iconBg: "bg-teal-500/15",
    iconColor: "text-teal-400",
    border: "border-teal-500/30",
    hoverBorder: "hover:border-teal-500/40",
    text: "text-teal-400",
    ring: "ring-teal-500/40",
    progressBar: "bg-teal-400",
  },
  "english-learning": {
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    border: "border-amber-500/30",
    hoverBorder: "hover:border-amber-500/40",
    text: "text-amber-400",
    ring: "ring-amber-500/40",
    progressBar: "bg-amber-400",
  },
  git: {
    gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-400",
    border: "border-orange-500/30",
    hoverBorder: "hover:border-orange-500/40",
    text: "text-orange-400",
    ring: "ring-orange-500/40",
    progressBar: "bg-orange-400",
  },
};

const FALLBACK: SectionTheme = THEMES["system-design"];

export function getSectionTheme(sectionSlug: string): SectionTheme {
  return THEMES[sectionSlug] ?? FALLBACK;
}

// Per-module accent within system-design, so the module list on the section
// page and the hero band on topic pages read as distinct "chapters" too.
const MODULE_THEMES: Record<string, SectionTheme> = {
  fundamentals: THEMES["system-design"],
  "scalability-basics": {
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/30",
    hoverBorder: "hover:border-emerald-500/40",
    text: "text-emerald-400",
    ring: "ring-emerald-500/40",
    progressBar: "bg-emerald-400",
  },
  "data-layer": {
    gradient: "from-teal-500/20 via-teal-500/5 to-transparent",
    iconBg: "bg-teal-500/15",
    iconColor: "text-teal-400",
    border: "border-teal-500/30",
    hoverBorder: "hover:border-teal-500/40",
    text: "text-teal-400",
    ring: "ring-teal-500/40",
    progressBar: "bg-teal-400",
  },
  "distributed-systems": {
    gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    iconBg: "bg-indigo-500/15",
    iconColor: "text-indigo-400",
    border: "border-indigo-500/30",
    hoverBorder: "hover:border-indigo-500/40",
    text: "text-indigo-400",
    ring: "ring-indigo-500/40",
    progressBar: "bg-indigo-400",
  },
  "communication-async": {
    gradient: "from-fuchsia-500/20 via-fuchsia-500/5 to-transparent",
    iconBg: "bg-fuchsia-500/15",
    iconColor: "text-fuchsia-400",
    border: "border-fuchsia-500/30",
    hoverBorder: "hover:border-fuchsia-500/40",
    text: "text-fuchsia-400",
    ring: "ring-fuchsia-500/40",
    progressBar: "bg-fuchsia-400",
  },
  "reliability-ops": {
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    border: "border-amber-500/30",
    hoverBorder: "hover:border-amber-500/40",
    text: "text-amber-400",
    ring: "ring-amber-500/40",
    progressBar: "bg-amber-400",
  },
  "case-studies": {
    gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-400",
    border: "border-rose-500/30",
    hoverBorder: "hover:border-rose-500/40",
    text: "text-rose-400",
    ring: "ring-rose-500/40",
    progressBar: "bg-rose-400",
  },
  foundations: {
    gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-400",
    border: "border-orange-500/30",
    hoverBorder: "hover:border-orange-500/40",
    text: "text-orange-400",
    ring: "ring-orange-500/40",
    progressBar: "bg-orange-400",
  },
  "branching-collaboration": {
    gradient: "from-blue-500/20 via-blue-500/5 to-transparent",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    border: "border-blue-500/30",
    hoverBorder: "hover:border-blue-500/40",
    text: "text-blue-400",
    ring: "ring-blue-500/40",
    progressBar: "bg-blue-400",
  },
  "history-safety": {
    gradient: "from-purple-500/20 via-purple-500/5 to-transparent",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
    border: "border-purple-500/30",
    hoverBorder: "hover:border-purple-500/40",
    text: "text-purple-400",
    ring: "ring-purple-500/40",
    progressBar: "bg-purple-400",
  },
  "github-workflow": {
    gradient: "from-slate-500/20 via-slate-500/5 to-transparent",
    iconBg: "bg-slate-500/15",
    iconColor: "text-slate-400",
    border: "border-slate-500/30",
    hoverBorder: "hover:border-slate-500/40",
    text: "text-slate-400",
    ring: "ring-slate-500/40",
    progressBar: "bg-slate-400",
  },
};

export function getModuleTheme(moduleId: string): SectionTheme {
  return MODULE_THEMES[moduleId] ?? FALLBACK;
}
