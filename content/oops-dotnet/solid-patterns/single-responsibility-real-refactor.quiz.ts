import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "srp-1",
    question: "Single Responsibility Principle ka sahi definition kya hai?",
    options: [
      "Ek class me sirf ek hi method hona chahiye",
      "Ek class ka sirf ek hi reason to change hona chahiye — sirf ek actor/business concern usko modify karwaye",
      "Ek class me sirf ek hi field hona chahiye",
      "Ek class ko kabhi bhi doosri class ke saath collaborate nahi karna chahiye",
    ],
    correctIndex: 1,
    explanation:
      "SRP ka actual definition Robert Martin ne diya: class ka ek hi reason to change hona chahiye, matlab ek hi actor/stakeholder usko modify karwa sake. Ye method count ya field count se related nahi hai (options A, C galat). Option D bhi galat hai — SRP-split classes zaroor collaborate karti hain (jaise orchestrator pattern), bas har ek ka apna ek concern hota hai.",
    difficulty: "easy",
  },
  {
    id: "srp-2",
    question: "Ek UserRegistrationService class validation, DB persistence, aur email notification teeno karti hai. Isme kitne 'reasons to change' hain, aur SRP kya kehta hai?",
    options: [
      "Ek reason to change hai kyunki sab registration flow ka hi part hai — SRP violate nahi hoti",
      "Teen alag reasons to change hain (validation rules, storage strategy, notification mechanism) — SRP violate hoti hai",
      "SRP sirf UI code pe apply hota hai, backend services pe nahi",
      "Zero reasons to change hain kyunki class already kaam kar rahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Teen alag stakeholders is class ko modify karwa sakte hain — business (validation), DBA/infra (persistence), marketing/infra (notification). Ye teen independent reasons to change hain, isliye SRP violation hai chahe 'sab registration ka hi part' lage. Option A galat hai kyunki 'ek hi flow ka part hona' aur 'ek hi reason to change hona' alag cheezein hain. Option C aur D factually galat statements hain.",
    difficulty: "medium",
  },
  {
    id: "srp-3",
    question: "SRP follow karne ke baad, alag-alag responsibilities (validator, repository, notifier) ko wapas coordinate kaun karta hai?",
    options: [
      "Koi nahi, calling code ko manually sab wire karna padta hai",
      "Ek thin orchestrator class jo interfaces pe depend karti hai aur flow ko sequence karti hai",
      "Har class khud automatically doosri classes ko call kar leti hai",
      "Ye zaroorat hi khatam ho jaati hai SRP follow karne ke baad",
    ],
    correctIndex: 1,
    explanation:
      "SRP-split classes ko wapas ek saath kaam karwane ke liye ek orchestrator class chahiye (jaise reference example ka UserRegistrationService) jo constructor-injected interfaces pe depend karti hai aur flow sequence karti hai. Option A defeat karta hai purpose (indirection bina benefit ke). Option C aur D factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "srp-4",
    question: "SRP apply karte waqt sabse common over-application mistake kya hai?",
    options: [
      "Har chhoti cheez ko bhi alag class me split kar dena bina genuine independent reason to change ke, jisse sirf unnecessary indirection badhta hai",
      "Interfaces ka use karna",
      "Constructor injection use karna",
      "Ek class me multiple methods rakhna",
    ],
    correctIndex: 0,
    explanation:
      "SRP ek judgment call hai — har responsibility ko forcibly alag class me todna, bina ye poochhe ki 'kya ye genuinely independently change hogi,' unnecessary complexity add karta hai bina real testability/maintainability benefit ke. Options B aur C SRP implement karne ke tools hain, mistakes nahi. Option D SRP violation ka indicator nahi hai (dekho question 1's explanation).",
    difficulty: "hard",
  },
];

export default quiz;
