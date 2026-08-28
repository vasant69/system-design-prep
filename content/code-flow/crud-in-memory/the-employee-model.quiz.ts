import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "the-employee-model-1",
    question: "Employee ke Salary field ke liye sabse sahi type kaunsa hai aur kyun?",
    options: [
      "double — kyunki fast hota hai aur salary chhoti value hai",
      "float — kyunki memory kam leta hai",
      "decimal — base-10, 128-bit, paise tak exact, money totals audit se match rehte hain",
      "int — kyunki salary hamesha whole number hoti hai",
    ],
    correctIndex: 2,
    explanation:
      "decimal base-10 hai isliye 0.1 jaisi values exactly store karta hai aur rounding errors jama nahi hoti — money, tax, interest ke liye yahi. double/float binary floating point hain, chhoti rounding errors financial totals ko audit se mismatch kara deti hain (BFSI me reportable). int galat hai kyunki salary me paise/decimals aa sakte hain aur allowances fractional hote hain.",
    difficulty: "easy",
  },
  {
    id: "the-employee-model-2",
    question: "PanNumber (format AAAAA9999A) ko kis type me store karna chahiye?",
    options: [
      "long — kyunki 10 characters ka bada number hai",
      "string — PAN ek identifier hai, uspe arithmetic nahi hoti, aur letters/leading zeros number me toot jaate hain",
      "int — parse karke store karo taaki validation easy ho",
      "decimal — kyunki BFSI ka data hai",
    ],
    correctIndex: 1,
    explanation:
      "PAN ek identifier hai, numeric quantity nahi — uspe kabhi add/subtract nahi hota. Usme letters hain (AAAAA...A) jo kisi numeric type me fit hi nahi honge, aur numeric types leading zeros gira dete hain. Isliye string. long/int galat hain (letters store nahi honge). decimal money ke liye hai, identifiers ke liye nahi.",
    difficulty: "easy",
  },
  {
    id: "the-employee-model-3",
    question: "<Nullable>enable</Nullable> on hai. FullName ko `public string FullName { get; set; }` likha to compiler kya karega, aur sahi fix kya hai?",
    options: [
      "Kuch nahi — code bilkul theek hai",
      "Warning dega ki non-nullable property uninitialised hai; fix: = string.Empty do ya required lagao (agla module), FullName ko string? mat banao",
      "Compile error dega jo sirf FullName ko string? banane se theek hoga",
      "Warning dega; sahi fix har string ko string? bana dena hai",
    ],
    correctIndex: 1,
    explanation:
      "Nullable reference types on hone par compiler warn karta hai ki non-nullable string constructor ke baad null ho sakti hai. Sahi fix: default value do (= string.Empty) ya required modifier (module 5). FullName ko string? banana galat hai kyunki wo genuinely kabhi null nahi honi chahiye — ? ka matlab hota 'null yahan valid hai'. Har string ko string? banana bas warnings dabata hai, intent chhupa deta hai.",
    difficulty: "medium",
  },
  {
    id: "the-employee-model-4",
    question: "Employee class me `public int GetTenureInYears() => DateTime.Now.Year - DateOfJoining.Year;` add karna kaisa idea hai?",
    options: [
      "Achha — model ke paas apna data hai to calculation bhi yahin honi chahiye",
      "Bura — model ek POCO hona chahiye (sirf data ka shape); derived values service layer ya response DTO me banao",
      "Achha — isse controller patla rehta hai",
      "Farq nahi padta, dono jagah same hai",
    ],
    correctIndex: 1,
    explanation:
      "Model sirf data ka shape define karta hai (POCO). Method daalte hi logic har layer me ghus jaata hai, testing ke liye model instantiate karna padta hai, aur DateTime.Now jaisi non-deterministic call entity me aa jaati hai. Tenure jaisi derived value service layer me ya EmployeeResponseDto me compute karni chahiye. Controller patla rakhna sahi goal hai lekin uska tareeka service layer hai, model me logic nahi.",
    difficulty: "medium",
  },
];

export default quiz;
