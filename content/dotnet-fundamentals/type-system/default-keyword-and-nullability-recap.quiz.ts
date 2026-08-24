import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "default-keyword-1",
    question: "`default(Point)` (jahan Point ek struct hai `int X, Y` fields ke saath) kya return karega?",
    options: [
      "null",
      "Ek Point instance jiska X aur Y dono 0 hain",
      "Compile error, struct ke liye default nahi hota",
      "Undefined behavior",
    ],
    correctIndex: 1,
    explanation:
      "Struct kabhi null nahi ho sakta. Struct ka default value ek valid instance hai jiske saare fields apni-apni default value pe set hote hain — yahan X aur Y dono int hain, jinki default 0 hai. Isliye `default(Point)` ek Point instance deta hai jiska X=0, Y=0, null nahi.",
    difficulty: "medium",
  },
  {
    id: "default-keyword-2",
    question: "`default(int?)` kya return karega?",
    options: ["0", "null — HasValue false ke saath", "Compile error", "-1"],
    correctIndex: 1,
    explanation:
      "`int?` (Nullable<int>) khud ek struct hai, lekin uska default state hai `HasValue = false`, jo effectively null represent karta hai. Ye plain `default(int)` (jo 0 deta hai) se alag hai — nullable value type ka default hamesha 'no value' hota hai, chahe underlying type struct ho.",
    difficulty: "medium",
  },
  {
    id: "default-keyword-3",
    question: "Generic method `T GetDefault<T>() => default(T);` me `default(T)` kyun zaroori hai, `0` ya `null` seedha kyun nahi likh sakte?",
    options: [
      "Performance ke liye better hai",
      "Compile-time pe T ka actual type pata nahi hota, isliye compiler ko exact default value nahi pata — default(T) generically sahi value resolve karta hai",
      "0 aur null dono syntax errors dete hain generic methods me",
      "default(T) sirf documentation purpose ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "Method likhte waqt `T` ek placeholder hai — ye `int`, `string`, `SomeStruct` kuch bhi ho sakta hai jab actually call ho. `0` sirf numeric types ke liye valid hai, `null` sirf reference/nullable types ke liye. `default(T)` compiler ko batata hai 'jo bhi T runtime pe resolve ho, uski sahi default value do' — ye har type ke liye correctly kaam karta hai.",
    difficulty: "hard",
  },
  {
    id: "default-keyword-4",
    question: "`default(char)` kya return karta hai?",
    options: [
      "Empty string \"\"",
      "'\\0' — the null character",
      "null",
      "'a'",
    ],
    correctIndex: 1,
    explanation:
      "`char` ek value type hai, aur uski default value `'\\0'` (null character, Unicode code point 0) hai — ye ek printable character nahi hai, aur `null` (jo reference types ke liye hota hai) se alag hai. Empty string bhi galat hai kyunki `char` ek single character hai, string nahi.",
    difficulty: "easy",
  },
];

export default quiz;
