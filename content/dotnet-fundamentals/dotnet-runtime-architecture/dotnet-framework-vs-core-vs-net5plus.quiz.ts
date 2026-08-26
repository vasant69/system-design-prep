import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "dotnet-framework-vs-core-1",
    question: "`.NET 5` release ke saath Microsoft ne 'Core' naam kyun hataya?",
    options: [
      "Kyunki `.NET Core` ek marketing failure tha",
      "Kyunki `.NET 5` `.NET Core`, `.NET Framework`, aur Mono/Xamarin ko unify karke ab ek hi platform ban gaya tha, alag mein 'Core' variant ki zaroorat nahi rahi",
      "Kyunki `.NET Core` deprecated ho gaya tha aur ek naya alag product launch hua",
      "Kyunki `.NET Framework` band ho gaya tha",
    ],
    correctIndex: 1,
    explanation:
      "`.NET 5` `.NET Core 3.1` ka hi seedha successor hai — Microsoft ne is release se `.NET Core`, `.NET Framework` ke relevant pieces, aur Mono/Xamarin ko ek single platform me unify kiya, isliye 'Core' naam (jo pehle Framework se differentiate karne ke liye tha) ki zaroorat nahi rahi. Option A aur C galat premises hain — 'Core' remove hona failure ya naya product nahi tha. Option D galat hai, `.NET Framework` still supported hai (maintenance mode me).",
    difficulty: "medium",
  },
  {
    id: "dotnet-framework-vs-core-2",
    question: "`.NET 8` ko production ke liye choose karne ka ek strong reason kya hai jo `.NET 9` pe apply nahi hota?",
    options: [
      "`.NET 8` `.NET 9` se fast hai",
      "`.NET 8` ek LTS (Long Term Support, 3 saal) release hai, `.NET 9` ek Current release hai (18 mahine support)",
      "`.NET 9` sirf Windows pe chalta hai",
      "`.NET 8` open-source nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "Even-numbered .NET versions (6, 8, 10...) LTS hote hain — 3 saal support. Odd-numbered (5, 7, 9...) Current release hote hain — sirf 18 mahine support. Production teams usually LTS prefer karti hain stability ke liye. Option A ek unverified/generally-false claim hai. Option C aur D dono factually galat hain — dono cross-platform aur open-source hain.",
    difficulty: "medium",
  },
  {
    id: "dotnet-framework-vs-core-3",
    question: "`.NET Framework` ki koi ek genuine limitation batao jisne `.NET Core` ke banne ko justify kiya.",
    options: [
      "Ye sirf 32-bit applications support karta tha",
      "Ye Windows-only tha aur cross-platform/container deployments ke liye suitable nahi tha",
      "Ye kabhi bhi open-source nahi hua",
      "Isme koi garbage collector nahi tha",
    ],
    correctIndex: 1,
    explanation:
      "`.NET Framework` Windows-tightly-coupled tha — cloud/container era me Linux deployment ki demand badhi, aur Framework isko cleanly support nahi karta tha. Ye `.NET Core` ke ground-up rewrite ka primary motivation tha. Option A galat hai, dono bit-ness support karta tha. Option C galat hai — `.NET Framework` 2014 me open-source hua tha (source-available). Option D bilkul galat hai, GC `.NET Framework` ka core hi hissa hai.",
    difficulty: "easy",
  },
  {
    id: "dotnet-framework-vs-core-4",
    question: "Ek Indian bank ka core banking system `.NET Framework 4.8` pe chal raha hai aur naye microservices `.NET 8` pe likhe jaa rahe hain. Ye setup kya batata hai?",
    options: [
      "Ye ek invalid/broken architecture hai, dono ek saath nahi chal sakte",
      "`.NET Framework` aur `.NET (Core-lineage)` apps alag processes/services ke roop me coexist kar sakte hain — legacy systems migrate karna hamesha immediately justify nahi hota",
      "`.NET 8` `.NET Framework 4.8` ke upar hi chalta hai, isliye ye same runtime hai",
      "Bank ne galti se do alag languages use kar li hain",
    ],
    correctIndex: 1,
    explanation:
      "Legacy `.NET Framework` systems aur naye `.NET`-lineage services alag deployment units ke roop me coexist kar sakte hain — network calls (HTTP/messaging) se integrate hote hain, same runtime share nahi karte. Full rewrite risky/costly ho sakta hai jab tak genuinely justify na ho, isliye incremental modernization common pattern hai. Options A, C, D sab factually/architecturally galat hain.",
    difficulty: "hard",
  },
];

export default quiz;
