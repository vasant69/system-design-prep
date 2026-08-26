import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "aggregation-1",
    question: "`employees` list me `Id == 101` ke saath 2 records hain (data-integrity bug ki wajah se). `employees.Single(e => e.Id == 101)` call karne par kya hoga?",
    options: [
      "Pehla matching record return karega",
      "null return karega",
      "InvalidOperationException throw karega — 'Sequence contains more than one matching element'",
      "Dono records ki ek list return karega",
    ],
    correctIndex: 2,
    explanation:
      "`Single` guarantee karta hai ki exactly ek match ho — agar zero ya (yahan) multiple matches milte hain, `InvalidOperationException` throw karta hai. Ye deliberate fail-fast behavior hai, taaki uniqueness violation silently na chhup jaaye. Option A `First`'s behavior hai. Option B galat hai — koi silent null nahi milta. Option D galat hai, `Single` ek single element return karta hai, list nahi.",
    difficulty: "medium",
  },
  {
    id: "aggregation-2",
    question: "Same 2-duplicate scenario me, `employees.SingleOrDefault(e => e.Id == 101)` kya karega?",
    options: [
      "null return karega, exception nahi aayega",
      "Pehla matching record return karega",
      "InvalidOperationException throw karega, kyunki multiple matches mile — SingleOrDefault sirf zero-match case ko soften karta hai",
      "Dono records ki list return karega",
    ],
    correctIndex: 2,
    explanation:
      "Ye is topic ka sabse commonly-missed subtlety hai: `SingleOrDefault` sirf ZERO-match case ko default value me convert karta hai. Multiple-match case abhi bhi `InvalidOperationException` throw karta hai — 'OrDefault' sirf 'no match mila to exception ki jagah default do' ka matlab rakhta hai, 'kabhi exception nahi' ka nahi. Options A, B, D sab is nuance ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "aggregation-3",
    question: "```csharp\nvar empty = new List<int>();\nvar result = empty.Aggregate((acc, n) => acc + n);\n```\nYe kya karega?",
    options: [
      "0 return karega",
      "InvalidOperationException throw karega — bina seed wale Aggregate ko empty sequence par call kiya",
      "null return karega",
      "Compile error dega",
    ],
    correctIndex: 1,
    explanation:
      "Bina seed wala `Aggregate()` overload sequence ke pehle element ko implicit seed maanta hai — agar sequence empty hai, koi seed hi nahi milta, isliye ye `InvalidOperationException` throw karta hai. Isse avoid karne ke liye seeded overload use karo: `empty.Aggregate(0, (acc, n) => acc + n)`, jo empty sequence par seed value (`0`) return kar dega. Options A, C, D sab galat hain.",
    difficulty: "hard",
  },
  {
    id: "aggregation-4",
    question: "Sirf ye check karna hai ki koi employee `Department == \"IT\"` hai ya nahi — konsa operator zyada efficient hai?",
    options: [
      "employees.Count(e => e.Department == \"IT\") > 0",
      "employees.Any(e => e.Department == \"IT\")",
      "employees.Single(e => e.Department == \"IT\") != null",
      "Dono A aur B equally efficient hain",
    ],
    correctIndex: 1,
    explanation:
      "`Any(predicate)` pehla match milte hi short-circuit ho jaata hai — poori sequence enumerate karne ki zaroorat nahi. `Count(predicate) > 0` poori sequence enumerate karta hai exact count nikalne ke liye, chahe sirf existence check karni ho, jo unnecessary extra kaam hai. Option C galat hai — `Single` multiple matches par exception throw karega, existence-check ke liye galat tool hai. Option D galat hai, dono equally efficient nahi hain.",
    difficulty: "medium",
  },
];

export default quiz;
