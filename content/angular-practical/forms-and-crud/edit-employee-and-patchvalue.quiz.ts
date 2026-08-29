import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "edit-employee-and-patchvalue-1",
    question: "Edit form ko API data se bharne ke liye `patchValue` `setValue` se kab better hai?",
    options: [
      "Kabhi nahi",
      "`patchValue` sirf diye gaye fields set karta hai aur baaki chhod deta hai — hydration me ideal, kyunki form me kabhi API response se zyada controls ho sakte hain; `setValue` missing/extra key par throw karta hai",
      "`setValue` faster hai isliye wahi use karo",
      "Dono bilkul same hain",
    ],
    correctIndex: 1,
    explanation:
      "Edit form me `patchValue(employee)` safe hai kyunki `employee` me har control ki value ho ya na ho. `setValue` strict hai — har control chahiye, warna error.",
    difficulty: "easy",
  },
  {
    id: "edit-employee-and-patchvalue-2",
    question: "Edit form me `patchValue({ departmentId, roleId })` seedha karne par `roleId` null ho jaata hai. Kyun?",
    options: [
      "`roleId` invalid hai",
      "`departmentId` set hone par uska `valueChanges` handler chalta hai jo `roleId` ko reset kar deta hai (dependent-dropdown logic). Fix: roles pehle load karo, phir `patchValue(..., { emitEvent: false })`",
      "`patchValue` numbers support nahi karta",
      "API galat data bhej raha hai",
    ],
    correctIndex: 1,
    explanation:
      "Dependent field ka `valueChanges` handler hydration ke dauran fire hoke `roleId` clear kar deta hai. Options pehle populate karo aur patch ko `{ emitEvent: false }` se silent rakho — yeh classic edit-form race hai.",
    difficulty: "hard",
  },
  {
    id: "edit-employee-and-patchvalue-3",
    question: "Successful save ke BAAD `form.markAsPristine()` kyun call karte hain?",
    options: [
      "Performance ke liye",
      "Warna `router.navigate` par `CanDeactivate` unsaved-changes guard `form.dirty` (jo save se pehle ke edits se true hai) dekhkar 'Discard changes?' prompt de deta hai — jabki form just-saved hai",
      "Form ko reset karne ke liye",
      "API ko dobara call karne ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Save ke baad form technically 'dirty' hi rehta hai (user ne edit kiya tha). Redirect par guard misfire karega. `markAsPristine()` batata hai 'ab saved hai, koi unsaved change nahi'.",
    difficulty: "medium",
  },
  {
    id: "edit-employee-and-patchvalue-4",
    question: "Edit save par `PUT` sirf changed fields ke saath bhejna kyun risky hai?",
    options: [
      "`PUT` slow hota hai",
      "`PUT` poore resource ko replace karta hai — jo fields aap nahi bhejте wo server par null/default ban sakte hain. Full DTO bhejo, ya sirf-changed fields ke liye `PATCH` use karo",
      "`PUT` sirf create ke liye hai",
      "Koi risk nahi",
    ],
    correctIndex: 1,
    explanation:
      "`PUT` = full replace. Partial `PUT` unintended data loss deta hai. Full DTO from `getRawValue()` ke saath `PUT`, ya dirty controls ka diff ke saath `PATCH` — API contract ke hisaab se.",
    difficulty: "medium",
  },
];

export default quiz;
