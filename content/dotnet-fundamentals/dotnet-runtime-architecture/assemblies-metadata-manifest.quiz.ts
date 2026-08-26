import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "assemblies-metadata-manifest-1",
    question: "Ek .NET assembly (`.dll`/`.exe`) me kaunsi teen cheezein bundled hoti hain?",
    options: [
      "Sirf compiled machine code aur documentation",
      "IL code, metadata (self-describing type catalog), aur manifest (identity + dependencies)",
      "Sirf source code aur comments",
      "Sirf configuration settings aur connection strings",
    ],
    correctIndex: 1,
    explanation:
      "Assembly IL code (compiled methods), metadata (har type/method/field ka self-describing catalog), aur manifest (assembly ki apni identity aur uski dependencies ki list) — teeno bundle karta hai. Options A, C, D factually galat hain — na source code na configuration assembly ka core content hai.",
    difficulty: "easy",
  },
  {
    id: "assemblies-metadata-manifest-2",
    question: "Reflection (jaise `typeof(Order).GetProperties()`) runtime pe kaam kaise karta hai?",
    options: [
      "Ye compile-time pe hi resolve ho jaata hai, runtime pe kuch nahi hota",
      "Ye assembly ke andar stored metadata ko runtime pe padh kar type information nikalta hai",
      "Ye source code file ko runtime pe re-parse karta hai",
      "Ye ek separate reflection database se query karta hai jo alag se deploy hoti hai",
    ],
    correctIndex: 1,
    explanation:
      "Reflection directly assembly ki metadata ko query karta hai — har type ka self-describing catalog jo assembly ke andar hi compile-time pe embed ho jaata hai. Isi wajah se Reflection kaam karta hai bina original source code ke bhi. Option A galat hai — reflection ek runtime operation hai. Option C galat hai — source code deployment me hota hi nahi. Option D galat hai — koi separate database nahi hoti, sab kuch assembly ke andar hi hai.",
    difficulty: "medium",
  },
  {
    id: "assemblies-metadata-manifest-3",
    question: "Manifest specifically kya track karta hai jo general metadata se alag/specific hai?",
    options: [
      "Har method ka poora IL bytecode",
      "Assembly ki apni identity (naam, version) aur wo kaunse doosre assemblies pe depend karta hai",
      "Runtime pe actual object instances ka data",
      "User interface layout information",
    ],
    correctIndex: 1,
    explanation:
      "Manifest metadata ka ek specific hissa hai jo assembly ki identity (naam, version, culture) aur referenced/dependency assemblies (unke required versions sahit) track karta hai. Ye CLR ko dependency resolution ke liye chahiye hota hai runtime pe. IL bytecode metadata ka alag hissa hai, aur options C, D irrelevant hain.",
    difficulty: "medium",
  },
  {
    id: "assemblies-metadata-manifest-4",
    question: "Ek legacy .NET Framework app me 'Could not load file or assembly X, Version=1.0.0.0' jaisa error aata hai jab ek dependency update hoti hai. Ye kis mechanism se directly related hai?",
    options: [
      "IL code corruption se",
      "Manifest me stored dependency version reference se — assembly ka manifest abhi bhi purane version ko reference kar raha hai",
      "Garbage collector ki galti se",
      "JIT compiler ke bug se",
    ],
    correctIndex: 1,
    explanation:
      "Ye classic 'assembly binding' issue hai — dependent assembly ka manifest kisi specific version ko reference karta hai, aur agar wo exact version available na ho (kisi upgrade ki wajah se), CLR load fail kar deta hai. Ye directly manifest ke dependency-tracking mechanism se related hai, na ki IL corruption, GC, ya JIT se.",
    difficulty: "hard",
  },
];

export default quiz;
