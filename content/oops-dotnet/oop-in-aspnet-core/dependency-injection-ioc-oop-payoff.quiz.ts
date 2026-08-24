import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "di-ioc-1",
    question: "Inversion of Control (IoC) aur Dependency Injection (DI) ka exact relationship kya hai?",
    options: [
      "Dono bilkul same cheez hain, alag naam bas",
      "IoC ek broader design principle hai; DI usko achieve karne ka ek specific technique hai",
      "DI ek principle hai, IoC uska implementation hai",
      "IoC sirf ASP.NET Core specific hai, DI language-level feature hai",
    ],
    correctIndex: 1,
    explanation:
      "IoC ek principle hai — object creation ka control bahar chala jaata hai. DI usko implement karne ka ek tareeka hai (dependency ko constructor/method/property ke through inject karna). Option A galat hai kyunki ye principle-vs-technique relationship hai, identical nahi. Option C relationship ko ulta bata raha hai. Option D galat hai — IoC ek general software design principle hai, ASP.NET Core specific nahi.",
    difficulty: "medium",
  },
  {
    id: "di-ioc-2",
    question: "ASP.NET Core ka built-in DI container kis version se framework ka native part hai?",
    options: [
      ".NET Framework 4.5 se",
      "ASP.NET Core 1.0 (2016) se",
      "Sirf .NET 6+ me add hua",
      "Kabhi native nahi tha, hamesha Autofac chahiye hota hai",
    ],
    correctIndex: 1,
    explanation:
      "ASP.NET Core apni pehli release (1.0, 2016) se hi ek built-in DI container ke saath aaya — ye framework ka core design decision tha. Option A galat hai, .NET Framework (non-Core) me built-in DI nahi tha. Option C galat hai, ye .NET 6 se pehle bhi present tha. Option D galat hai — third-party containers (Autofac) optional hain, mandatory nahi.",
    difficulty: "medium",
  },
  {
    id: "di-ioc-3",
    question: "DI ko 'OOP ka real payoff' kyun kaha jaata hai is topic me?",
    options: [
      "Kyunki DI performance ko drastically improve karta hai",
      "Kyunki DI sirf tabhi useful hai jab abstraction (interfaces) aur polymorphism (swappable implementations) pehle se present hon",
      "Kyunki DI inheritance ko replace kar deta hai",
      "Kyunki DI ke bina C# compile hi nahi hoga",
    ],
    correctIndex: 1,
    explanation:
      "DI ka pura value proposition — swap karna implementations ko bina consuming code change kiye — abstraction (interface ka hona) aur polymorphism (runtime pe alag implementation resolve hona) pe depend karta hai. Bina interface ke, DI sirf 'new' likhne jaisa hi useful hai. Option A galat hai — DI perf ko improve nahi karta, thoda reflection cost bhi add karta hai. Option C galat hai — DI inheritance se unrelated hai. Option D bhi factually galat hai.",
    difficulty: "hard",
  },
  {
    id: "di-ioc-4",
    question: "ASP.NET Core ka built-in container kaunsa injection style natively support karta hai?",
    options: [
      "Sirf property injection",
      "Sirf method injection",
      "Constructor injection",
      "Field injection directly private fields me",
    ],
    correctIndex: 2,
    explanation:
      "Built-in container constructor injection ko natively support karta hai — dependency constructor parameter ke through aati hai, readonly field me store hoti hai. Property/method injection ke liye third-party container chahiye hota hai. Options A, B, D sab factually galat hain built-in container ke context me.",
    difficulty: "easy",
  },
];

export default quiz;
