import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "control-flow-1",
    question: "Switch expression me agar koi value kisi bhi arm se match nahi hoti aur `_` discard pattern bhi missing hai, to kya hota hai?",
    options: [
      "Compile error, missing default case",
      "Silently 0/null return karta hai",
      "Runtime pe SwitchExpressionException throw hota hai",
      "First arm ka result use ho jaata hai",
    ],
    correctIndex: 2,
    explanation:
      "Agar switch expression exhaustive nahi hai aur koi value kisi arm se match nahi hoti, runtime pe SwitchExpressionException throw hota hai. Compiler kai cases me non-exhaustive switch pe warning de sakta hai, lekin ye hard compile error nahi hai (Option A galat). Options B aur D galat hain — koi silent default ya fallback-to-first-arm behavior nahi hota.",
    difficulty: "medium",
  },
  {
    id: "control-flow-2",
    question: "`age switch { >= 18 and <= 60 => \"Adult\", _ => \"Other\" }` — ye kaunse pattern kind ka example hai?",
    options: [
      "Type pattern",
      "List pattern",
      "Logical pattern combined with relational patterns",
      "Property pattern",
    ],
    correctIndex: 2,
    explanation:
      "`>= 18` aur `<= 60` relational patterns hain (C# 9), aur `and` unhe combine karta hai — ye logical pattern hai jo do relational patterns ko jodta hai. Type pattern `is Type x` jaisa hota, list pattern `[..]` jaisa, property pattern `{ Prop: value }` jaisa — koi bhi yahan directly applicable nahi hai is exact expression me.",
    difficulty: "medium",
  },
  {
    id: "control-flow-3",
    question: "switch statement aur switch expression me ek key syntactic/semantic difference kya hai?",
    options: [
      "switch expression ek value return karta hai (assignable), switch statement nahi",
      "switch statement C# 8 me aaya, switch expression C# 2 me",
      "switch expression me break mandatory hai, switch statement me nahi",
      "Dono functionally aur syntactically identical hain",
    ],
    correctIndex: 0,
    explanation:
      "switch expression (C# 8) ek expression hai jo direct ek value produce karta hai (e.g. `var x = input switch {...};`), jabki switch statement sirf control flow branch karta hai bina koi value return kiye (jab tak explicitly kisi variable ko assign na kiya jaaye har case me). Option B history-wise ulta hai (switch statement bahut purana hai, expression naya hai). Option C ulta hai, break switch statement me chahiye hota hai expression me nahi.",
    difficulty: "easy",
  },
  {
    id: "control-flow-4",
    question: "`case int n when n > 0:` me evaluation order kya hai?",
    options: [
      "Pehle `when n > 0` check hota hai, phir type pattern",
      "Pehle type pattern (`int n`) match hota hai, phir `when` guard evaluate hota hai",
      "Dono parallel evaluate hote hain",
      "`when` sirf switch expressions me valid hai, statements me nahi",
    ],
    correctIndex: 1,
    explanation:
      "Pattern match (`int n`) pehle hota hai — value ka type check hota hai aur variable bind hoti hai. Agar pattern match ho jaaye, tabhi `when` clause ka boolean condition evaluate hota hai as an additional guard. Agar pattern hi match na kare, `when` evaluate hi nahi hoga. Option D galat hai — `when` dono switch statement aur expression me valid hai.",
    difficulty: "hard",
  },
];

export default quiz;
