import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "github-pull-request-workflow-1",
    question: "External open-source contributor jinke paas repo pe direct write access nahi hai, unhe PR kholne ke liye kya karna padega?",
    options: [
      "Directly repo me naya branch create karna, GitHub automatically access de deta hai",
      "Pehle repo ko apne account me fork karna, wahan branch banake kaam karna, phir fork se upstream repo me PR kholna",
      "Repo admin se password maangna",
      "PR sirf admins hi kholte hain, contributors sirf comment kar sakte hain",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai -- fork workflow external contributors ke liye standard hai kyunki unhe original repo pe direct write access nahi milta; fork ek independent copy hai jaha wo freely kaam kar sakte hain, phir wahan se PR kholte hain upstream repo me. Options 1, 3, aur 4 factually galat hain.",
    difficulty: "easy",
  },
  {
    id: "github-pull-request-workflow-2",
    question: "Reviewer ne PR pe ek line-comment diya. Author ne fix kar diya. Aage kya sahi step hai?",
    options: [
      "Force-push karke history rewrite karo taaki fix purane commit me merge dikhe",
      "Naya commit banao aur usi branch pe push karo -- PR automatically update ho jaayega",
      "Nayi PR banani padegi from scratch",
      "PR ko close karke dobara khud khud milega",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai -- fix ko naya commit banao aur push karo usi source branch pe, PR automatically naya commit reflect kar dega. Force-push (option 1) reviewer ka context break karta hai. Options 3 aur 4 unnecessary aur galat approach hain.",
    difficulty: "easy",
  },
  {
    id: "github-pull-request-workflow-3",
    question: "Squash-merge strategy use karne ka primary trade-off kya hai merge-commit ke comparison me?",
    options: [
      "Squash-merge CI checks skip kar deta hai",
      "Squash-merge main branch pe clean single-commit history deta hai, lekin individual commit-level granularity target branch pe lost ho jaati hai",
      "Squash-merge sirf private repos me available hai",
      "Squash-merge automatically saare reviewers ko remove kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai -- squash-merge PR ke saare commits ko ek single commit me combine kar deta hai target branch pe, jisse history clean aur revert-friendly rehti hai, lekin individual chhote commits ka granular history main pe nahi milta (though PR page pe abhi bhi visible rehta hai). Options 1, 3, aur 4 factually incorrect hain.",
    difficulty: "medium",
  },
  {
    id: "github-pull-request-workflow-4",
    question: "Draft PR banane ka primary purpose kya hai?",
    options: [
      "Draft PR CI checks nahi chalata, isliye faster hai",
      "Draft PR ek explicit signal deta hai ki kaam abhi review-ready nahi hai, jabki CI aur comments abhi bhi kaam karte hain",
      "Draft PR sirf repo admins bana sakte hain",
      "Draft PR automatically 24 ghante baad delete ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Sahi jawab option 2 hai -- draft PR normal PR jaisa hi functional hai (CI chalta hai, comments ho sakte hain) lekin explicitly reviewers ko batata hai ki formal review abhi maang nahi rahe, sirf early visibility chahiye. Options 1, 3, aur 4 galat hain.",
    difficulty: "medium",
  },
];

export default quiz;
