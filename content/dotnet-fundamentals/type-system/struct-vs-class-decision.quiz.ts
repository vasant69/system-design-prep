import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "struct-class-1",
    question: "Microsoft ki guideline ke hisaab se struct kab appropriate hai?",
    options: [
      "Jab bhi performance important ho, size ki parwah kiye bina",
      "Jab type chhota ho (~16 bytes se kam), logically single immutable value ho, aur frequently boxed na ho",
      "Sirf tab jab type mutable state rakhta ho",
      "Jab type ko inheritance chahiye ho",
    ],
    correctIndex: 1,
    explanation:
      "Microsoft ki apni design guideline 4 conditions deti hai jo saath satisfy honi chahiye: small size (~16 bytes ke around), logically ek single value, immutable, aur frequently boxed na ho. In sabme se kisi ek ke fail hone par class better choice hai. Struct inheritance support nahi karta, isliye option D bhi galat hai.",
    difficulty: "medium",
  },
  {
    id: "struct-class-2",
    question: "Ek bada struct (80 bytes, 10 fields) ko baar-baar method parameters ke roop me pass karne ka performance implication kya hai?",
    options: [
      "Koi implication nahi, struct hamesha class se fast hota hai",
      "Har call pe poore 80 bytes copy hote hain — hot paths me ye class ke pointer-copy se zyada expensive ho sakta hai",
      "Automatically heap pe allocate ho jaata hai",
      "Compile error, structs 16 bytes se bade nahi ho sakte",
    ],
    correctIndex: 1,
    explanation:
      "Struct ek value type hai, isliye har assignment/parameter-pass/return poora instance copy karta hai. Bade struct ke liye ye copy cost class ke sirf-pointer-copy (8 bytes on 64-bit) se zyada ho sakta hai, especially jab frequently call ho raha ho. Isi wajah se Microsoft chhoti size recommend karta hai. Structs technically kisi bhi size ke ho sakte hain (option D galat), bas guideline recommend karti hai chhota rakhna.",
    difficulty: "hard",
  },
  {
    id: "struct-class-3",
    question: "Kya struct kisi doosri class ya struct se inherit kar sakta hai?",
    options: [
      "Haan, struct bhi class ki tarah inheritance support karta hai",
      "Nahi — struct sirf interfaces implement kar sakta hai, class/struct inheritance support nahi karta",
      "Sirf agar struct readonly ho",
      "Sirf .NET 8+ me possible hai",
    ],
    correctIndex: 1,
    explanation:
      "Struct C# me inheritance support nahi karta — na kisi doosre struct se, na kisi class se (except implicit `System.ValueType` base). Struct sirf interfaces implement kar sakta hai. Ye ek hard language constraint hai, agar tumhare design me inheritance zaroori hai, class use karna hi padega.",
    difficulty: "medium",
  },
  {
    id: "struct-class-4",
    question: "Ek struct ko `object`-typed variable me baar-baar assign karne ka kya cost hai?",
    options: [
      "Koi cost nahi, struct kabhi heap pe nahi jaata",
      "Boxing hoti hai — har assignment pe ek heap allocation, jo struct ka 'no allocation' benefit negate kar deta hai",
      "Compile error",
      "Struct automatically class me convert ho jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Jab struct ko `object` ya kisi interface type me assign kiya jaata hai, boxing hoti hai — struct ki value heap pe wrap ho jaati hai. Ye exactly wo heap allocation hai jise struct use karne se avoid karna tha. Agar type frequently boxed hoga, struct ka performance-benefit largely khatam ho jaata hai — Microsoft ki guideline isi liye ye condition bhi list karti hai.",
    difficulty: "medium",
  },
];

export default quiz;
