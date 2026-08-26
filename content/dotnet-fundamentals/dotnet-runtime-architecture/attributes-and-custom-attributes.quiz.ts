import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "attributes-custom-attributes-1",
    question: "`[Required]` attribute khud actually validation logic execute karta hai?",
    options: [
      "Haan, attribute khud runtime pe validation check karta hai",
      "Nahi — attribute sirf metadata hai; ASP.NET Core ka model-binding/validation pipeline reflection se ise discover karke validation apply karta hai",
      "Haan, lekin sirf compile-time pe",
      "Nahi, `[Required]` ka koi runtime effect kabhi nahi hota",
    ],
    correctIndex: 1,
    explanation:
      "Attributes passive metadata hain — khud koi behavior execute nahi karte. `[Required]` sirf ek marker hai jo property pe attach hota hai; ASP.NET Core ka validation pipeline reflection se check karta hai kaunse properties pe ye attribute laga hai, aur uske basis pe khud validation logic run karta hai. Option D galat hai — is specific case me ye genuinely runtime effect deta hai, lekin indirectly, framework ke through.",
    difficulty: "medium",
  },
  {
    id: "attributes-custom-attributes-2",
    question: "Custom attribute banane ke liye kis class se inherit karna zaroori hai?",
    options: [
      "`System.Object`",
      "`System.Attribute`",
      "`System.Reflection.MemberInfo`",
      "Koi bhi interface, class nahi",
    ],
    correctIndex: 1,
    explanation:
      "Custom attributes `System.Attribute` se inherit karke banaye jaate hain. Ye base class attributes ko CLR/Reflection ke saath properly integrate hone deta hai — attribute constructors, `AttributeUsage` decoration, sab isi base class ke through kaam karte hain. Options A, C, D incorrect hain.",
    difficulty: "easy",
  },
  {
    id: "attributes-custom-attributes-3",
    question: "`[AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]` kya specify karta hai?",
    options: [
      "Attribute ka runtime performance",
      "Attribute sirf methods pe lag sakta hai, aur ek member pe ek se zyada baar nahi laga sakte",
      "Attribute compile-time pe hi delete ho jaayega",
      "Attribute ko sirf private members pe lagaya ja sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "`[AttributeUsage]` ek meta-attribute hai jo custom attribute ke valid targets (yaha sirf `Method`) aur repeatability (`AllowMultiple = false` matlab ek member pe ek hi baar laga sakte ho) restrict karta hai. Ye compile-time pe enforce hota hai agar galat jagah lagane ki koshish ki jaaye. Options A, C, D galat characterizations hain.",
    difficulty: "medium",
  },
  {
    id: "attributes-custom-attributes-4",
    question: "Ek team ne ek custom `[AuditLog]` attribute banaya kisi method pe laga diya, lekin koi audit entry kabhi nahi likhi jaa rahi. Sabse likely reason kya hai?",
    options: [
      "Attribute syntax galat hai",
      "Koi bhi reflection-based code (jaise ek action filter/interceptor) ye attribute discover karke act nahi kar raha — attribute sirf metadata hai, khud kuch nahi karta",
      "`.csproj` me attribute support enable nahi hai",
      "Attributes production build me automatically strip ho jaate hain",
    ],
    correctIndex: 1,
    explanation:
      "Ye is topic ka core concept hai — attribute lagane se apne aap kuch nahi hota jab tak koi reflection-based code (framework ka built-in mechanism, ya khud likha hua interceptor/filter) us attribute ko discover karke act na kare. Sirf attribute lagane se koi 'magic' nahi hoti. Options A, C, D galat/irrelevant hain.",
    difficulty: "hard",
  },
];

export default quiz;
