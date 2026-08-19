import { TrendingUp } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata = { title: "Progress" };

export default function ProgressPage() {
  return (
    <ComingSoon
      icon={TrendingUp}
      title="Progress Dashboard"
      description="Percent complete per module, quiz accuracy, your weakest areas, current streak, and JSON export/import so your progress survives a cleared browser."
      phase="Phase 3"
    />
  );
}
