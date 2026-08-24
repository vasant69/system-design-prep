import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "ocp-1",
    question: "Open/Closed Principle ka sahi matlab kya hai?",
    options: [
      "Class ke saare members public hone chahiye, koi private nahi",
      "Naya behavior add karne ke liye naya code likho (extension), existing tested code ko edit mat karo (modification)",
      "Ek class ko kabhi bhi close (seal) nahi karna chahiye",
      "Sab classes ko interfaces implement karna zaroori hai",
    ],
    correctIndex: 1,
    explanation:
      "OCP ka core idea hai: system extension ke liye open ho (naye types/behaviors easily add ho sakein) lekin existing, already-tested code modification ke liye closed ho. Option A public/private se related nahi hai. Option C `sealed` keyword se confuse kar raha hai, jo alag concept hai. Option D bhi galat hai — OCP interfaces ka use encourage karta hai variation points ke liye, lekin 'sab classes' ek absolute rule nahi hai.",
    difficulty: "easy",
  },
  {
    id: "ocp-2",
    question: "Ek DiscountService me har naye discount type ke liye if/else branch add karna padta hai. Ye kis principle ka violation hai, aur fix kya hai?",
    options: [
      "SRP violation hai, fix hai class ko do classes me split karna",
      "OCP violation hai, fix hai Strategy pattern — har discount type apni IDiscountStrategy implementation ban jaaye",
      "Ye koi violation nahi hai, if/else perfectly normal hai",
      "LSP violation hai, fix hai inheritance hierarchy fix karna",
    ],
    correctIndex: 1,
    explanation:
      "Ye classic OCP violation hai — naya discount TYPE add karne ke liye existing class ko modify karna pad raha hai. Fix hai Strategy pattern: IDiscountStrategy interface, har discount type apni class, DI container se resolve. Option A SRP se related nahi hai directly (yahan ek hi responsibility hai — discount calculate karna — bas extension mechanism galat hai). Option C galat hai, ye ek real maintainability/risk problem hai. Option D LSP se related nahi hai, koi inheritance-behavior-break nahi ho raha yahan.",
    difficulty: "medium",
  },
  {
    id: "ocp-3",
    question: "Strategy pattern refactor ke baad ek naya discount type add karne ke liye kya karna padta hai?",
    options: [
      "DiscountService class ko edit karke ek naya if/else branch add karna padta hai",
      "Bas ek nayi class likhni hai jo IDiscountStrategy implement kare, aur usko DI container me register karna hai",
      "Poori application ko recompile karke redeploy karna padta hai kyunki interface badal gaya",
      "Kuch nahi karna padta, naye discounts automatically kaam karte hain",
    ],
    correctIndex: 1,
    explanation:
      "OCP ka poora fayda yahi hai — DiscountService class ka koi existing code touch nahi hota. Bas ek nayi class banao jo IDiscountStrategy implement kare, aur DI container me AddScoped se register karo. Option A exactly wahi purana problematic pattern hai jo fix kiya gaya tha. Option C aur D dono factually galat statements hain.",
    difficulty: "medium",
  },
  {
    id: "ocp-4",
    question: "OCP ke baare me kaunsa statement SAHI hai?",
    options: [
      "OCP guarantee karta hai ki koi bhi future change kabhi kisi existing file ko touch nahi karega",
      "OCP sirf anticipated variation points ke against protect karta hai — agar interface ka signature hi badalna pade, to har implementation edit karni padegi",
      "OCP ka matlab hai har class ko sealed banana",
      "OCP sirf UI layer pe apply hota hai",
    ],
    correctIndex: 1,
    explanation:
      "OCP absolute nahi hai — ye specific, anticipated variation (jaise discount TYPE) ke against design karta hai. Agar ek fundamentally different tarah ka change ho (jaise IDiscountStrategy.Calculate() ka signature hi badalna), to har implementing class edit karni padegi — is baat ko na jaanna over-confidence signal karta hai interview me. Option A ye overclaim hai jo galat hai. Option C aur D dono factually unrelated/galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
