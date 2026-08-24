import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "isp-1",
    question: "Interface Segregation Principle ka core idea kya hai?",
    options: [
      "Ek class me sirf ek interface implement hona chahiye",
      "Clients ko sirf wahi methods pe depend karna chahiye jo wo actually use karte hain — fat interfaces ko role-specific interfaces me split karo",
      "Interfaces me kabhi default implementation nahi honi chahiye",
      "Ek interface me maximum 3 methods hone chahiye",
    ],
    correctIndex: 1,
    explanation:
      "ISP ka core idea hai fat interfaces ko avoid karna taaki koi implementer aisi methods stub na kare jo uske use-case me irrelevant hain. Option A galat hai — C# multiple interfaces implement karne deta hai. Option C default interface methods se unrelated hai. Option D ek arbitrary number hai, ISP koi fixed method-count rule nahi deta.",
    difficulty: "easy",
  },
  {
    id: "isp-2",
    question: "Ek class me kai methods `throw new NotImplementedException()` kar rahe hain kyunki wo interface ka part hain lekin us class ke use-case me irrelevant hain. Ye kis principle ka violation signal hai?",
    options: [
      "LSP violation",
      "ISP violation — fat interface jo client ko unrelated methods pe depend karwa raha hai",
      "OCP violation",
      "Koi violation nahi, ye normal pattern hai",
    ],
    correctIndex: 1,
    explanation:
      "NotImplementedException-heavy stub methods classic ISP violation smell hain — interface itni fat hai ki implementer ko irrelevant methods bhi 'implement' karne padte hain. Fix hai interface ko role-specific chhote interfaces me split karna. Options A aur C alag principles hain jo directly is scenario se match nahi karte. Option D galat hai, ye ek real, well-known code smell hai.",
    difficulty: "medium",
  },
  {
    id: "isp-3",
    question: "ISP aur SRP me exact difference kya hai?",
    options: [
      "Dono bilkul same principle hain, sirf naam alag hai",
      "SRP ek class ke andar responsibilities ke baare me hai (ek reason to change); ISP interface consumers ke baare me hai (client sirf zaroori methods pe depend kare)",
      "SRP sirf interfaces pe apply hota hai, ISP sirf classes pe",
      "ISP sirf abstract classes ke liye hai, interfaces ke liye nahi",
    ],
    correctIndex: 1,
    explanation:
      "SRP class-level principle hai — ek class ka ek hi reason to change hona chahiye. ISP interface-consumer-level principle hai — client ko sirf wahi methods expose/depend karne chahiye jo wo use karta hai. Dono 'chhota rakho' ki taraf point karte hain lekin alag level pe operate karte hain. Options C aur D factually galat hain (ISP specifically interfaces ke baare me hai, abstract classes ke liye nahi).",
    difficulty: "medium",
  },
  {
    id: "isp-4",
    question: "Interface segregation ke baad, ek full-featured OrderService class jo genuinely sab responsibilities rakhti hai, use kya karna padta hai?",
    options: [
      "Sirf ek interface choose karni padegi, baaki functionality khud implement karni padegi bina interface ke",
      "C# multiple interface implementation support karta hai, isliye ye class sab role-specific interfaces (IOrderReader, IOrderWriter, etc.) ek saath implement kar sakti hai bina extra cost ke",
      "Ek naya giant interface banana padega jo sab chhoti interfaces ko combine kare",
      "Ye pattern C# me possible hi nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "C# ek class ko multiple interfaces implement karne deta hai (unlike multiple class inheritance). Isliye segregation koi extra boilerplate cost nahi laati ek genuinely full-featured class ke liye — wo class sab relevant chhoti interfaces ek saath implement kar sakti hai. Options A, C, D sab is C# capability ko galat represent karte hain.",
    difficulty: "hard",
  },
];

export default quiz;
