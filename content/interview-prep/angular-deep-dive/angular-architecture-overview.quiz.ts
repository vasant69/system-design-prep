import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "aao-1",
    question: "Angular aur React ke beech sabse fundamental architectural difference kya hai?",
    options: [
      "Angular sirf mobile apps ke liye hai, React sirf web ke liye",
      "Angular ek full framework hai (routing/forms/HTTP/DI built-in), React ek rendering library hai jiske upar stack compose karna padta hai",
      "React TypeScript support nahi karta, Angular karta hai",
      "Dono bilkul same hain, sirf syntax alag hai",
    ],
    correctIndex: 1,
    explanation:
      "Angular batteries-included framework hai — routing, forms, HTTP client, DI sab built-in. React sirf UI rendering library hai, baaki (routing, state management) alag libraries se add karna padta hai. Dono web ke liye use hote hain (A galat). React bhi TypeScript support karta hai (C galat). Ye sirf syntax difference nahi, architectural philosophy alag hai (D galat).",
    difficulty: "easy",
  },
  {
    id: "aao-2",
    question: "Angular component me `@Input` aur `@Output` ka data flow direction kya hota hai?",
    options: [
      "Dono directions me free-flow, koi restriction nahi",
      "@Input se data parent se child me jaata hai, @Output se events child se parent me aate hain",
      "@Input child se parent, @Output parent se child",
      "Ye dono sirf services ke liye hote hain, components ke liye nahi",
    ],
    correctIndex: 1,
    explanation:
      "Angular ka unidirectional data flow model: data neeche jaata hai (parent → child via @Input), events upar aate hain (child → parent via @Output). Ye debugging aasan banata hai. Free-flow (A) galat hai — Angular specifically directional hai. Reversed direction (C) galat hai. @Input/@Output components ke liye hote hain, services ke liye nahi (D galat).",
    difficulty: "easy",
  },
  {
    id: "aao-3",
    question: "Standalone components (Angular 14+) NgModules se kaise different hain?",
    options: [
      "Standalone components purane codebases me kaam nahi karte",
      "Standalone components apne dependencies khud declare karte hain (imports array), NgModule wrapper ki zaroorat nahi padti",
      "Standalone components sirf testing ke liye use hote hain",
      "NgModules ab completely deprecated hain aur kaam nahi karte",
    ],
    correctIndex: 1,
    explanation:
      "Standalone component apne `imports` array me khud apni dependencies declare karta hai, koi NgModule declaration/imports wrapper nahi chahiye. Ye purane NgModule-based code ke saath co-exist kar sakte hain migration ke dauraan (A galat). Sirf testing ke liye nahi hain, production code ke liye bhi (C galat). NgModules deprecated nahi hain, abhi bhi supported hain, bas naye projects me recommended nahi (D galat).",
    difficulty: "medium",
  },
  {
    id: "aao-4",
    question: "AOT (Ahead-of-Time) compilation Angular me kya fayda deta hai?",
    options: [
      "Sirf bundle size kam karta hai, aur kuch nahi",
      "Templates build time pe hi JavaScript me compile ho jaate hain — faster browser startup aur template errors build time pe hi pakde jaate hain",
      "AOT sirf development mode me use hota hai, production me nahi",
      "AOT ka koi practical fayda nahi hai, sirf legacy option hai",
    ],
    correctIndex: 1,
    explanation:
      "AOT templates ko build time pe compile kar deta hai, isliye browser ko runtime pe compile nahi karna padta (faster startup) aur template syntax errors build time pe hi pakde jaate hain (runtime pe nahi). Ye sirf bundle size ke baare me nahi hai (A incomplete). AOT Angular 9+ se dev aur prod dono me default hai (C galat). Iska real, measurable fayda hai (D galat).",
    difficulty: "medium",
  },
];

export default quiz;
