import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "access-modifiers-1",
    question: "`protected internal` member ko access karne ke liye kya sahi condition hai?",
    options: [
      "Caller ko dono, derived class BHI hona chahiye AUR same assembly me BHI hona chahiye",
      "Caller ko derived class HONA CHAHIYE (kahin bhi) YA same assembly me hona chahiye — in dono me se koi ek kaafi hai",
      "Sirf same assembly me hona chahiye, inheritance ka koi role nahi",
      "Sirf derived class hona chahiye, assembly ka koi role nahi",
    ],
    correctIndex: 1,
    explanation:
      "`protected internal` ek UNION hai — access granted hota hai agar caller derived class hai (chahe kisi bhi assembly me) YA same assembly me hai (chahe derived na ho), dono me se koi ek condition kaafi hai. Option A actually `private protected` ka (intersection) behavior describe karta hai, jo galat hai yahan.",
    difficulty: "medium",
  },
  {
    id: "access-modifiers-2",
    question: "Assembly 'Core.dll' me `BaseEntity` class hai jisme ek `private protected void Method()` hai. Assembly 'Api.dll' (Core.dll reference karta hai) me ek class `DerivedInApi : BaseEntity` hai jo `Method()` ko call karne ki koshish karti hai. Kya hoga?",
    options: [
      "Compile ho jayega, kyunki DerivedInApi ek derived class hai",
      "Compile error — DerivedInApi derived class to hai, lekin ALAG assembly me hai, isliye intersection (protected AND internal) satisfy nahi hota",
      "Runtime exception aayega jab Method() call hoga",
      "Compile ho jayega kyunki dono assemblies reference kar rahe hain ek dusre ko",
    ],
    correctIndex: 1,
    explanation:
      "`private protected` ek intersection hai — access ke liye caller ko EK SAATH derived class HONA CHAHIYE AUR same assembly me bhi hona chahiye. `DerivedInApi` derived to hai lekin `Api.dll` me hai, `BaseEntity` `Core.dll` me — dusri assembly hone ki wajah se intersection satisfy nahi hoti, compile error aata hai. Options A, C, D is exact rule ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "access-modifiers-3",
    question: "Class ke ek member pe koi access modifier explicitly nahi likha gaya. Uska default access level kya hoga?",
    options: [
      "public",
      "private",
      "internal",
      "protected",
    ],
    correctIndex: 1,
    explanation:
      "Class members (fields, methods, properties) ke liye agar koi modifier explicitly na likha jaaye, default `private` hota hai. (Note: ye top-level class/type declarations se different hai, jinka default `internal` hota hai.) Options A, C, D class-member-level default ko galat represent karte hain.",
    difficulty: "easy",
  },
  {
    id: "access-modifiers-4",
    question: "`private protected` access modifier C# ke kis version me introduce hua?",
    options: [
      "C# 1.0, shuru se hi tha",
      "C# 7.2 (2017) — ye six modifiers me sabse recent addition hai",
      "C# 9 (2020), records ke saath",
      "C# 11 (2022), required ke saath",
    ],
    correctIndex: 1,
    explanation:
      "`private protected` C# 7.2 (2017) me add kiya gaya tha — baaki paanch modifiers (public, private, protected, internal, protected internal) bahut pehle se available the. Options A, C, D galat versions/timelines bataate hain.",
    difficulty: "medium",
  },
];

export default quiz;
