// Central place resolving section.icon strings (stored as plain data in
// sections.config.ts) to actual lucide-react components.
import { Network, Plug, Database, Languages, type LucideIcon } from "lucide-react";

export const sectionIconMap: Record<string, LucideIcon> = {
  Network,
  Plug,
  Database,
  Languages,
};
