import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "directives-1",
    question: "`*ngIf=\"condition\"` internally kaunse element me desugar hota hai?",
    options: [
      "`<ng-container [ngIf]=\"condition\">`",
      "`<ng-template [ngIf]=\"condition\">` jise NgIf directive ViewContainerRef ke through insert/remove karti hai",
      "`<div style.display=\"condition ? block : none\">`",
      "Koi desugaring nahi hoti, ye ek native HTML feature hai",
    ],
    correctIndex: 1,
    explanation: "*ngIf syntactic sugar hai jo `<ng-template>` me expand hota hai. NgIf directive is template ko ViewContainerRef ke through conditionally DOM me insert ya remove karti hai — ye display:none jaisa CSS toggle nahi karta, DOM node ko actually add/remove karta hai.",
    difficulty: "medium",
  },
  {
    id: "directives-2",
    question: "Ek bade `*ngFor` list me `trackBy` na hone se kya problem aati hai jab underlying array ek naye reference se replace hoti hai (jaise fresh API data)?",
    options: [
      "Kuch nahi, Angular automatically optimize kar deta hai",
      "Angular saare DOM nodes ko destroy karke phir se create karta hai, chahe individual items same ho — scroll position, focus, animations reset ho jaate hain",
      "List render hona band ho jaata hai",
      "Sirf naye items render hote hain, purane automatically reuse ho jaate hain",
    ],
    correctIndex: 1,
    explanation: "Bina trackBy ke, Angular default me items ko reference se compare karta hai. Naya array reference aane pe wo saare purane items ko unknown treat karta hai aur poori list destroy-recreate karta hai — jisse UI state (scroll, focus) reset hoti hai aur performance impact hota hai. trackBy ek unique identity function deta hai taaki sirf actually changed items re-render ho.",
    difficulty: "medium",
  },
  {
    id: "directives-3",
    question: "Ek hi HTML element pe `*ngIf` aur `*ngFor` dono ek saath lagane ki koshish karne pe kya hota hai, aur fix kya hai?",
    options: [
      "Ye perfectly kaam karta hai, koi issue nahi",
      "Angular compile error deta hai kyunki ek element sirf ek structural directive rakh sakta hai; fix hai unmein se ek ko `<ng-container>` wrapper me move karna",
      "Sirf ngIf execute hota hai, ngFor silently ignore ho jaata hai",
      "Runtime pe crash hota hai, compile time pe nahi",
    ],
    correctIndex: 1,
    explanation: "Har structural directive apna khud ka <ng-template> banane ki koshish karta hai, aur ek element do alag ng-template wraps nahi le sakta — isliye ye compile-time restriction hai. Standard fix ek directive ko <ng-container> (jo apna DOM element add nahi karta) me move karna hai.",
    difficulty: "hard",
  },
  {
    id: "directives-4",
    question: "Ek custom attribute directive banate waqt (jaise focus pe background highlight karna), kaunse do Angular building blocks typically use hote hain?",
    options: [
      "ViewChild aur ContentChild",
      "ElementRef (DOM element ka reference paane ke liye) aur @HostListener (us element pe events sunne ke liye)",
      "Input aur Output decorators",
      "TemplateRef aur ViewContainerRef",
    ],
    correctIndex: 1,
    explanation: "Attribute directives typically ElementRef se host element ka direct DOM reference lete hain aur @HostListener se us element pe events (jaise focus, blur, click) sunte hain, phir directly DOM ko manipulate karte hain. TemplateRef/ViewContainerRef structural directives banane me use hote hain, ye attribute directive ka typical pattern nahi hai.",
    difficulty: "medium",
  },
];

export default quiz;
