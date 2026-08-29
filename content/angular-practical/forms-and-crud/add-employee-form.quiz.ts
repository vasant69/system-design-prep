import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "add-employee-form-1",
    question: "Submit par form invalid hone par pehla kaam kya karna chahiye?",
    options: [
      "Kuch nahi, bas return kar do",
      "`form.markAllAsTouched()` call karo aur return karo — taaki un fields ke errors bhi dikh jaayein jinhe user ne kabhi touch nahi kiya",
      "Poora form reset kar do",
      "API call kar do phir bhi",
    ],
    correctIndex: 1,
    explanation:
      "Error messages `invalid && touched` par gate hote hain. Untouched-but-invalid fields chup rehte hain, aur user samajh nahi paata submit kyun kaam nahi kar raha. `markAllAsTouched()` sab errors reveal kar deta hai.",
    difficulty: "easy",
  },
  {
    id: "add-employee-form-2",
    question: "Disabled `roleId` control ke saath, submit par form data kaise nikalte hain?",
    options: [
      "`form.value` — wo sab kuch deta hai",
      "`form.getRawValue()` — `form.value` disabled controls ko OMIT kar deta hai; `getRawValue()` unhe bhi include karta hai",
      "Har control ko manually `.value` se padho",
      "`form.controls` ko `JSON.stringify` karo",
    ],
    correctIndex: 1,
    explanation:
      "Angular disabled controls ko `form.value` se hatata hai (assumption: disabled = not submitted). Agar aapko phir bhi wo value chahiye (jaise ek roleId jo temporarily disabled tha), `getRawValue()` use karo.",
    difficulty: "medium",
  },
  {
    id: "add-employee-form-3",
    question: "Server `422` field errors (`{ errors: { email: [\"already registered\"] } }`) ko kaise surface karte hain?",
    options: [
      "Ek 'Save failed' toast",
      "Har field par `form.get(field)?.setErrors({ server: msgs[0] })` — error us control ke paas inline dikhta hai jaha user dekh raha hai",
      "Console me log karo",
      "Poora form reset karke user ko dobara bharne do",
    ],
    correctIndex: 1,
    explanation:
      "Generic toast bekaar hai. `setErrors({ server: msg })` se error us specific control par aata hai; `<app-field-error>` use render kar deta hai. Non-field errors (`err.message`) ke liye ek form-level banner.",
    difficulty: "medium",
  },
  {
    id: "add-employee-form-4",
    question: "Submit button ko kin conditions par disable karna chahiye?",
    options: [
      "Sirf `form.invalid`",
      "`form.invalid || form.pending || saving()` — invalid inputs, async validator abhi chal raha (`pending`), ya request in-flight (`saving`) — teenon par disable",
      "Kabhi disable mat karo",
      "Sirf `saving()`",
    ],
    correctIndex: 1,
    explanation:
      "`form.pending` chhodne se user async email-check ke beech submit kar deta hai. `saving` chhodne se double-submit. Teenon conditions cover karo.",
    difficulty: "medium",
  },
];

export default quiz;
