import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "abstract-vs-interface-1",
    question: "Is guide ke rule of thumb ke hisaab se, abstract class vs interface choose karne ka SABSE decisive factor kya hai?",
    options: [
      "Kaunsa naam zyada 'is-a' jaisa sunta hai",
      "Kya implementers ke beech genuinely shared instance state (fields) ya constructor logic chahiye",
      "Kaunsa syntax likhne me chhota hai",
      "Kya type public hai ya internal",
    ],
    correctIndex: 1,
    explanation:
      "Shared instance state ek hard technical limit hai — sirf abstract class fields rakh sakti hai, interface (DIM ke saath bhi) nahi. Isliye ye primary, non-negotiable deciding factor hai. Option A ('is-a' framing) ek useful lekin secondary signal hai. Option C aur D dono irrelevant hain is decision ke liye — syntax length ya accessibility se koi lena dena nahi hai abstract-class-vs-interface choice ka.",
    difficulty: "medium",
  },
  {
    id: "abstract-vs-interface-2",
    question: "Default Interface Methods (DIM, C# 8) ne abstract class aur interface ke beech ke gap ko kaise affect kiya?",
    options: [
      "Gap poori tarah khatam kar diya, ab dono identical hain",
      "Shared BEHAVIOR ka gap narrow kiya, lekin shared STATE (instance fields) ka gap wahi ka wahi raha",
      "Koi effect nahi hua, DIM sirf syntax sugar hai",
      "Ab interfaces bhi instance fields rakh sakte hain",
    ],
    correctIndex: 1,
    explanation:
      "DIM interface methods ko default body dene deta hai — behavior-sharing gap narrow hua. Lekin interfaces aaj bhi instance fields (state) nahi rakh sakte, ye limit unchanged hai. Isliye 'shared state chahiye to abstract class' rule abhi bhi valid hai. Option A aur D dono galat hain — fields ka gap khatam nahi hua. Option C galat hai, DIM ek real semantic capability hai, sirf syntax sugar nahi.",
    difficulty: "medium",
  },
  {
    id: "abstract-vs-interface-3",
    question: "Tumhari class already ek framework base class (jaise ControllerBase) se extend karti hai, aur ab usse ek naya capability chahiye. Kya options hain?",
    options: [
      "Ek doosri abstract class banao aur usse bhi extend karo",
      "Interface implement karo — ye ek hi option bacha hai, kyunki class sirf ek base class extend kar sakti hai",
      "Ye scenario C# me possible hi nahi hai",
      "ControllerBase se pehle inherit karna hata do",
    ],
    correctIndex: 1,
    explanation:
      "C# me single class inheritance ka hard limit hai — ek class sirf ek base/abstract class extend kar sakti hai. Agar ye slot already use ho chuka hai, naye capability ke liye interface hi option bacha hai (unlimited interfaces implement ho sakte hain). Option A invalid hai, C# multiple class inheritance allow nahi karta. Option C galat hai, ye ek common, valid scenario hai. Option D unnecessarily existing design todh deta hai jab interface hi seedha solution hai.",
    difficulty: "medium",
  },
  {
    id: "abstract-vs-interface-4",
    question: "Ek codebase me `Order` aur `RiderProfile` — dono unrelated hierarchies ke types — ko ek same 'push notification bhej sakta hai' capability chahiye, koi shared state ke bina. Best design kya hai?",
    options: [
      "Dono ko ek common abstract base class se extend karao",
      "Ek INotifiable interface banao jo dono implement karein",
      "Har jagah duplicate code likho",
      "Ek static helper class banao jisme sab logic ho",
    ],
    correctIndex: 1,
    explanation:
      "Ye classic 'can-do' capability scenario hai, unrelated types ke beech, koi shared state nahi — interface exactly isi ke liye design hua hai. Option A galat hai kyunki dono types already unrelated hierarchies me hain, unhe force-fit karna coupling badhaata hai bina fayde ke. Option C maintenance nightmare hai. Option D static helper polymorphism ka fayda khatam kar deta hai — har type ka apna implementation nahi ho sakta.",
    difficulty: "easy",
  },
];

export default quiz;
