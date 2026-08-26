import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "tdd-workflow-tr-1",
    question: "TDD kya hai aur Red-Green-Refactor cycle explain karo.",
    type: "conceptual",
    difficulty: "beginner",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer:
      "Test-Driven Development — pehle ek failing test likho (Red), minimum code likho use pass karwane ke liye (Green), phir behavior change kiye bina design improve karo (Refactor).",
    detailedAnswer:
      "Red step me ek test likha jaata hai jo abhi fail hoga (functionality exist hi nahi karti). Green step me sirf itna code likha jaata hai jo us test ko pass karwa de, minimum, even naive. Refactor step me code ki design improve ki jaati hai — naming, duplication removal — bina behavior badle, aur tests dobara run karke confirm kiya jaata hai ki behavior same raha.",
    followUp: "TDD ka real value proposition kya hai, sirf 'tests likhna' se aage?",
  },
  {
    id: "tdd-workflow-tr-2",
    question: "Kya TDD ka matlab sirf 'tests pehle likhna' hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi — asli value hai design pressure jo testable, loosely-coupled code ki taraf push karta hai, sirf tests ka existence nahi.",
    detailedAnswer:
      "TDD ko sirf 'test-first' tak reduce karna is practice ka core insight miss kar deta hai. Jab tumhe pehle test likhna padta hai, tumhe apna code caller ki nazar se sochna padta hai — kya dependencies inject-able hain, kya API testable hai. Agar test likhna mushkil hai, ye signal hai design me problem hai (tight coupling, hidden dependencies). Ye correlation testability aur good design ke beech genuine hai.",
    redFlag: "TDD ko sirf 'best practice hai isliye follow karte hain' bol dena, bina underlying reasoning explain kiye — ye shallow understanding dikhata hai.",
  },
  {
    id: "tdd-workflow-tr-3",
    question: "Kya har project/scenario me TDD strictly follow karna chahiye?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi — exploratory/spike code aur trivial CRUD logic me overhead ROI justify nahi karta; complex, non-trivial business logic pe iska real value milta hai.",
    detailedAnswer:
      "TDD ek universal mandate nahi hai. Jab requirements khud unclear hain (exploratory prototyping), test-first workflow friction create karta hai bina proportional benefit ke — pehle explore karo, jo kaam kare use baad me properly test karo. Simple CRUD/UI-heavy code me bhi ROI kam ho sakta hai. Complex business logic (jahan regressions ka cost high hai) me TDD ka value sabse zyada hai.",
  },
  {
    id: "tdd-workflow-tr-4",
    question: "TDD refactoring confidence kaise deta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "TDD se organically grow hui comprehensive test suite ek safety net banati hai — bade refactors ke baad tests turant batayenge agar behavior accidentally change hua.",
    detailedAnswer:
      "Jab har piece of functionality test-first develop hua ho, poori codebase ki behavior tests me encode ho jaati hai. Isse jab future me koi bada refactor/redesign karna ho, developer confidently changes kar sakta hai — agar kuch break hua, tests turant fail honge, manual regression testing ki zaroorat kam ho jaati hai.",
    followUp: "Agar tests khud brittle/badly-written hon, ye confidence kaise fail ho sakta hai?",
  },
  {
    id: "tdd-workflow-tr-5",
    question: "'Green' step me deliberately naive implementation likhna kyun encouraged hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Isse incremental progress hota hai — pehle 'kaam karna' confirm karo, phir 'Refactor' step me design polish karo, ek saath dono karne ki koshish complexity badha deti hai.",
    detailedAnswer:
      "TDD ka incremental philosophy hai — ek time pe ek chhota, manageable step. Green step me over-engineer karne ki koshish (seedha 'perfect' implementation) actually process ko slow aur error-prone bana deti hai. Naive-first approach fir Refactor step me safely improve hoti hai, kyunki tests already pass ho rahe hain aur regression turant pakde jaayenge.",
  },
  {
    id: "tdd-workflow-tr-6",
    question: "Ek developer 'Red' step complete karta hai (test likha, fail ho raha hai), phir seedha bahut saari functionality ek saath 'Green' step me implement kar deta hai bina intermediate tests ke. Ismein kya problem hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Ye TDD ke incremental nature ko violate karta hai — agar kuch fail ho, exactly pata nahi chalega kaunsa specific piece toota, kyunki bahut kuch ek saath add kiya gaya.",
    detailedAnswer:
      "TDD ka value chhote, incremental cycles se aata hai — har cycle ek specific, small behavior add karta hai. Agar ek developer ek 'Green' step me bahut saari unrelated functionality daal de, wo genuinely TDD nahi kar raha, sirf test likh ke baad bulk implementation kar raha hai — jo debug karna mushkil banata hai agar kuch galat ho jaaye, kyunki failure ka exact source pinpoint karna mushkil hai.",
    redFlag: "Ye kehna ki 'Green step me jitna zyada functionality daalo utna better, time bachta hai' — ye TDD ke incremental value ko misunderstand karta hai.",
  },
  {
    id: "tdd-workflow-tr-7",
    question: "TDD aur unit testing me kya relationship hai — kya dono same cheez hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Nahi — unit testing ek testing technique hai (isolated code test karna), TDD ek development workflow hai jo test-first approach use karta hai. Tum unit tests likh sakte ho bina TDD follow kiye (test-after).",
    detailedAnswer:
      "Unit testing sirf ye describe karta hai ki kya test kiya ja raha hai aur kaise (isolated units, mocked dependencies). TDD ek process hai jismein test kab likha jaata hai — production code se pehle — aur cycle kaise structured hai (Red-Green-Refactor). Ek team unit tests likh sakti hai purely 'test-after' style me bhi, jo unit testing hai lekin TDD nahi.",
  },
];

export default questions;
