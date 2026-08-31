import { InterviewQuestionBank } from "@/components/interview/InterviewQuestionBank";

export const metadata = {
  title: "Interview Mode",
  description:
    "Full Stack interview prep — the complete question bank (SQL, Angular, Node.js, ASP.NET Core, system design, DSA, and cross-cutting engineering) with interviewer follow-ups.",
};

export default function InterviewModePage() {
  return <InterviewQuestionBank />;
}
