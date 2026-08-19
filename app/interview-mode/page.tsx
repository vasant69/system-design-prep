import { Mic } from "lucide-react";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata = { title: "Interview Mode" };

export default function InterviewModePage() {
  return (
    <ComingSoon
      icon={Mic}
      title="Interview Mode"
      description="Pick topics or modules and get random interview questions, one at a time, with a model-answer reveal and a Confident / Shaky / No idea self-rating."
      phase="Phase 3"
    />
  );
}
