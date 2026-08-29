import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "custom-pipes-1",
    question: "Custom pipe class me kya hona zaroori hai?",
    options: [
      "Ek `render()` method",
      "`@Pipe({ name: '...' })` decorator aur ek `transform(value, ...args)` method (PipeTransform implement karke)",
      "Ek `@Component` decorator",
      "Ek constructor jo HttpClient inject karein",
    ],
    correctIndex: 1,
    explanation:
      "Pipe = `@Pipe({ name })` + `transform(value, ...args)` jo display value return karti hai. `implements PipeTransform` type safety deta hai. Standalone pipe ko component ke `imports` me add karna padta hai.",
    difficulty: "easy",
  },
  {
    id: "custom-pipes-2",
    question: "Pure pipe (default) `transform` ko kab dobara call karta hai?",
    options: [
      "Har change-detection cycle me",
      "Sirf jab piped value ya koi argument ki identity badle (primitive: value; object: reference) — warna cached result",
      "Har 1 second me",
      "Kabhi nahi, sirf ek baar",
    ],
    correctIndex: 1,
    explanation:
      "Pure pipe input identity par memoize karta hai — reference/value same to `transform` skip aur cached output. Isliye object ko in-place mutate karne par pure pipe update nahi hota. Impure (`pure: false`) har CD cycle me chalta hai.",
    difficulty: "medium",
  },
  {
    id: "custom-pipes-3",
    question: "Ek `timeAgo` pure pipe \"2 min ago\" dikha raha hai jo 10 minute baad bhi wahi hai. Kyun?",
    options: [
      "Pipe me bug hai",
      "Pure pipe sirf input (`createdAt`) badalne par re-run hota hai; time apne aap aage badhne se re-run nahi hota. Fix: ek interval/signal se component ko periodically re-render karao, ya (chhoti list) impure banao",
      "`timeAgo` pipe Angular me support nahi",
      "Browser ka clock galat hai",
    ],
    correctIndex: 1,
    explanation:
      "Pure pipe ka output stale rehta hai jab tak uska input identity na badle. Wall-clock aage badhna input change nahi hai. Ek `interval(60000)` -> signal tick jo template me read ho, component re-render karega aur pipe dobara chalega. Impure banana chhoti lists me theek par bade lists me har CD cycle par chalega.",
    difficulty: "hard",
  },
  {
    id: "custom-pipes-4",
    question: "`transform` method me in me se kya NAHI karna chahiye?",
    options: [
      "Input ko format karke string return karna",
      "Arguments accept karna (`transform(value, limit, trail)`)",
      "HTTP call karna, state mutate karna, ya console.log jaise side effects — pipe ek pure function honi chahiye",
      "`null`/`undefined` input handle karna",
    ],
    correctIndex: 2,
    explanation:
      "Pipe ko apne inputs ka pure function hona chahiye — same input, same output, koi side effect nahi. Side effects change detection ke saath unpredictably chalenge aur testing tod denge. Options A, B, D sab valid pipe practices hain.",
    difficulty: "medium",
  },
];

export default quiz;
