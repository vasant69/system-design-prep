import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "component-anatomy-and-metadata-1",
    question: "`@Component` decorator ka kaam kya hai?",
    options: [
      "Class ko ek service bana deta hai",
      "Class ko metadata deta hai (selector, template, styles, imports, etc.) taaki Angular use component ki tarah use kar sake",
      "Class ko automatically export kar deta hai",
      "Class me sabhi methods ko public bana deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`@Component({...})` ek plain class par metadata attach karta hai — Angular is metadata se jaanta hai selector kya hai, kya render karna hai, kaunsi dependencies chahiye. Option A `@Injectable` ka kaam hai. Option C/D galat — decorator export ya visibility se related nahi.",
    difficulty: "easy",
  },
  {
    id: "component-anatomy-and-metadata-2",
    question: "`encapsulation: ViewEncapsulation.Emulated` (default) kya karta hai?",
    options: [
      "Component ko dusre components se poori tarah hide kar deta hai",
      "Component ke styles ko us component tak scope karta hai — Angular selectors me ek unique attribute add karke, taaki CSS bahar leak na karein",
      "Component ko lazy-load karta hai",
      "Change detection ko OnPush kar deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Emulated encapsulation component ke elements par ek `_ngcontent` attribute add karta hai aur CSS rules ko us attribute se qualify karta hai — isliye styles sirf us component ke andar apply hote hain. Option A galat — ye sirf CSS scoping hai, component visibility nahi. Option C/D unrelated fields hain.",
    difficulty: "medium",
  },
  {
    id: "component-anatomy-and-metadata-3",
    question:
      "`host: { class: \"employee-card\", \"[class.inactive]\": \"!employee.isActive\" }` ka kya matlab hai?",
    options: [
      "Component ke andar ek `<div class=\"employee-card\">` add hota hai",
      "Component ke apne root element par `employee-card` class hamesha lagti hai, aur `inactive` class tab lagti hai jab `employee.isActive` false ho",
      "`employee-card` naam ka ek naya component register hota hai",
      "Ye sirf documentation comment hai, koi asar nahi",
    ],
    correctIndex: 1,
    explanation:
      "`host` bindings component ke host (root) element par lagti hain — static `class`, conditional `[class.x]`, ya `(event)` listeners — bina template me wrapper element add kiye. Option A galat — koi extra div nahi banta, class host par lagti hai. Option C/D galat.",
    difficulty: "medium",
  },
  {
    id: "component-anatomy-and-metadata-4",
    question:
      "Ek OnPush component ka `@Input() employee` object aap `this.employee.name = \"X\"` se mutate karte ho, par view update nahi hota. Kyun?",
    options: [
      "OnPush components me `@Input` allowed nahi",
      "OnPush change detection sirf tab chalti hai jab input ki reference badle (ya event/signal), object ke andar mutation reference nahi badalti",
      "`name` property template me bind nahi hai",
      "OnPush ka matlab component kabhi update nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "OnPush component tabhi re-check hota hai jab: input reference change, component se event, ya us par depend karta signal change. In-place mutation reference nahi badalti, isliye skip. Fix: naya object d/o (`this.employee = { ...this.employee, name: 'X' }`) ya signal use karo. Option D galat — OnPush update hota hai, bas triggers restricted hain.",
    difficulty: "hard",
  },
];

export default quiz;
