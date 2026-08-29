import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "interpolation-and-property-binding-1",
    question: "`{{ employee.firstName }}` (interpolation) ka output kya hota hai?",
    options: [
      "Ek DOM property set hoti hai",
      "Value ko string me convert karke, HTML-escape karke, element ke text content me daala jaata hai",
      "Ek event listener attach hota hai",
      "Value ko `innerHTML` me daala jaata hai (HTML render hota hai)",
    ],
    correctIndex: 1,
    explanation:
      "Interpolation value ko string banata hai aur `textContent` ki tarah render karta hai, HTML escape karke — isliye `<b>` text dikhega, bold nahi (XSS-safe). Option A property binding hai. Option C event binding. Option D galat — interpolation `innerHTML` use nahi karta, isliye safe hai.",
    difficulty: "easy",
  },
  {
    id: "interpolation-and-property-binding-2",
    question: "`<button [disabled]=\"isSaving\">` aur `<button disabled=\"{{ isSaving }}\">` me kya farak hai?",
    options: [
      "Koi farak nahi",
      "`[disabled]=\"isSaving\"` boolean property set karta hai (false = enabled). `disabled=\"{{ isSaving }}\"` string deta hai — `\"false\"` bhi truthy hai, to button hamesha disabled",
      "`disabled=\"{{ isSaving }}\"` zyada modern aur recommended hai",
      "`[disabled]` sirf forms ke andar kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Property binding `[disabled]` ko real boolean milta hai. Interpolation attribute me string bhejti hai; `disabled` attribute ki presence hi matter karti hai aur `\"false\"` string truthy hai — button stuck-disabled. Isliye boolean properties ke liye hamesha `[ ]`. Option C ulta hai — wo pattern buggy hai.",
    difficulty: "medium",
  },
  {
    id: "interpolation-and-property-binding-3",
    question: "`[attr.colspan]=\"span\"` kyun likhte hain, seedha `[colspan]=\"span\"` kyun nahi?",
    options: [
      "`[colspan]` purana syntax hai",
      "`colspan` ka koi DOM property nahi hota (ya standard nahi hai) — jab element ki matching JS property na ho to `[attr.]` use karte hain (aria-*, data-*, colspan, SVG attrs)",
      "`[attr.]` performance ke liye faster hai",
      "Dono bilkul same hain, style preference",
    ],
    correctIndex: 1,
    explanation:
      "Property binding tabhi kaam karta hai jab element ki JS property ho. `colspan`, `aria-label`, `data-*`, aur zyadatar SVG attributes ke liye DOM property nahi hoti, isliye `[attr.name]` se seedha HTML attribute set karte hain. Option A/C/D galat.",
    difficulty: "medium",
  },
  {
    id: "interpolation-and-property-binding-4",
    question: "Interpolation aur property binding me kya common hai?",
    options: [
      "Dono two-way binding hain",
      "Dono one-way hain — data class se view ki taraf jaata hai, aur value badalne par view auto-update hota hai",
      "Dono sirf strings ke saath kaam karte hain",
      "Dono ke liye `FormsModule` import karna padta hai",
    ],
    correctIndex: 1,
    explanation:
      "Interpolation aur property binding dono one-way class-to-view hain aur change detection par re-evaluate hote hain. Option A galat — two-way alag syntax `[( )]`. Option C galat — property binding koi bhi type le sakti hai. Option D galat — ye core template syntax hai, `FormsModule` sirf `ngModel` ke liye chahiye.",
    difficulty: "easy",
  },
];

export default quiz;
