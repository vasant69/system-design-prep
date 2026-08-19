import { Search } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <ComingSoon
      icon={Search}
      title="Search"
      description="Client-side fuzzy search across every topic's title, tags, and definitions, plus a Cmd/Ctrl+K command palette to jump anywhere instantly."
      phase="Phase 2"
    />
  );
}
