import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "records-1",
    question: "`var p2 = p1 with { X = 10 };` execute karne ke baad `p1` ka kya hota hai?",
    options: [
      "p1.X bhi 10 ho jaata hai, kyunki with expression mutate karta hai",
      "p1 completely unchanged rehta hai — with expression hamesha ek naya instance banata hai",
      "p1 null ho jaata hai",
      "Compile error aata hai kyunki records immutable hain",
    ],
    correctIndex: 1,
    explanation:
      "with expression kabhi original object ko mutate nahi karta — ye hamesha ek naya record instance banata hai jisme sirf specified properties change hoti hain, baaki original se copy hoti hain. p1 poori tarah unchanged rehta hai. Option A is core concept ko galat samajhta hai. Option C aur D dono factually galat hain — koi null nahi hota, na hi ye compile error hai, balki ye records ka intended, working feature hai.",
    difficulty: "medium",
  },
  {
    id: "records-2",
    question: "Kya `record struct` by default fully immutable hota hai, jaise `record` (class)?",
    options: [
      "Haan, dono bilkul same tarah immutable hain",
      "Nahi — record struct by default MUTABLE hota hai; fully immutable chahiye to 'readonly record struct' likhna padta hai",
      "Nahi, record struct kabhi immutable ho hi nahi sakta",
      "Ye compiler version pe depend karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Ye ek genuine gotcha hai jo interview me specifically test hota hai. record (reference type) by default init-only properties ke saath immutable hota hai. record struct (C# 10) ka default behavior alag hai — ye by default MUTABLE hota hai, normal struct jaisa. Fully immutable value-type record chahiye to explicitly 'readonly record struct' likhna padta hai. Option A galat hai, defaults alag hain. Option C galat hai, readonly record struct exist karta hai. Option D irrelevant hai.",
    difficulty: "hard",
  },
  {
    id: "records-3",
    question: "'Defensive copy' kab hoti hai C# me?",
    options: [
      "Jab ek class ko dusri class me copy kiya jaata hai",
      "Jab ek non-readonly-struct type ke readonly field ya parameter pe koi method call hoti hai, aur compiler ko pata nahi ki method mutate karega ya nahi, to safety ke liye ek hidden copy bana kar method usi pe call kiya jaata hai",
      "Jab GC ek object ko Gen 0 se Gen 1 me promote karta hai",
      "Jab record ka with expression call hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Defensive copy specifically structs ke context me hoti hai: agar struct type 'readonly struct' declared nahi hai, aur uske ek readonly field/parameter pe koi method call hoti hai, compiler ko guarantee nahi hoti ki wo method struct ko mutate nahi karega. Safety ke liye compiler silently ek copy bana kar us par method call karta hai — original readonly field protected rehta hai, lekin ek invisible extra copy cost aati hai. readonly struct declare karke ye avoid ho jaata hai. Options A, C, D sab is specific mechanism se unrelated hain.",
    difficulty: "hard",
  },
  {
    id: "records-4",
    question: "Ek `record` aur ek plain `class` ke beech inheritance ka rule kya hai?",
    options: [
      "Record kisi bhi class se inherit kar sakta hai aur vice versa",
      "Record sirf doosre records se inherit kar sakta hai — record aur plain class ke beech mixed inheritance allowed nahi hai",
      "Records inheritance support hi nahi karte",
      "Sirf record struct inheritance support karta hai, record (class) nahi",
    ],
    correctIndex: 1,
    explanation:
      "Record inheritance sirf record-to-record chalti hai — ek record dusre record se inherit ho sakta hai, lekin ek record ek plain (non-record) class se inherit nahi kar sakta, aur ek plain class ek record se inherit nahi kar sakti. Ye ensure karta hai ki record ka structural-equality behavior poori hierarchy me consistent rahe. Option A galat hai. Option C galat hai — records definitely inheritance support karte hain (record-to-record). Option D galat hai, record (class) bhi inheritance support karta hai, record struct nahi karta (structs support inheritance karte hi nahi C# me).",
    difficulty: "medium",
  },
];

export default quiz;
