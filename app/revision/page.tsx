import { RotateCcw } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata = { title: "Revision" };

export default function RevisionPage() {
  return (
    <ComingSoon
      icon={RotateCcw}
      title="Revision Queue"
      description="A spaced-repetition queue (1/3/7/21 days) built from anything you rated Shaky or No idea, plus your bookmarks — with a printable cheatsheet mode pulling every Quick Revision block."
      phase="Phase 3"
    />
  );
}
