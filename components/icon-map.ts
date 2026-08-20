// Central place resolving section.icon strings (stored as plain data in
// sections.config.ts) to actual lucide-react components.
import {
  Network,
  Plug,
  Database,
  Languages,
  BookOpen,
  Layers,
  GitBranch,
  MessagesSquare,
  ShieldCheck,
  Trophy,
  FolderGit2,
  GitMerge,
  History,
  GitPullRequest,
  type LucideIcon,
} from "lucide-react";

export const sectionIconMap: Record<string, LucideIcon> = {
  Network,
  Plug,
  Database,
  Languages,
  GitBranch,
};

export const moduleIconMap: Record<string, LucideIcon> = {
  fundamentals: BookOpen,
  "scalability-basics": Layers,
  "data-layer": Database,
  "distributed-systems": GitBranch,
  "communication-async": MessagesSquare,
  "reliability-ops": ShieldCheck,
  "case-studies": Trophy,
  foundations: FolderGit2,
  "branching-collaboration": GitMerge,
  "history-safety": History,
  "github-workflow": GitPullRequest,
};
