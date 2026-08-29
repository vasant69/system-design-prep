import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "sorting-and-column-config-1",
    question: "Ek `Column[]` config + generic `DataTable<T>` ka main faayda kya hai?",
    options: [
      "Faster rendering",
      "Ek reusable table har entity ke list ko render kar sakti hai — consistent look, kam markup, aur ek table bug ek jagah fix",
      "Server calls kam ho jaati hain",
      "TypeScript ki zaroorat khatam ho jaati hai",
    ],
    correctIndex: 1,
    explanation:
      "Column config (key/label/sortable/format) + ek `DataTable` matlab naya list screen = 'columns define karo, store wire karo', na ki har baar `<table>` markup likhna.",
    difficulty: "easy",
  },
  {
    id: "sorting-and-column-config-2",
    question: "Server-side pagination wale table par sorting kahan honi chahiye aur kyun?",
    options: [
      "Client par — loaded rows ko `.sort()` se",
      "Server par — `?sort=field:dir` param se; client par sirf current page (20 rows) sort karne se list galat dikhti hai (page 1 ka 'highest' poore dataset ka nahi)",
      "Dono jagah",
      "Sorting optional hai, chhod do",
    ],
    correctIndex: 1,
    explanation:
      "Client ke paas sirf ek page hota hai. Us page ko sort karna poore dataset ko sort nahi karta. API ko sort param bhejo taaki wo poora dataset order kare, phir sahi page return kare.",
    difficulty: "medium",
  },
  {
    id: "sorting-and-column-config-3",
    question: "Ek sortable header par repeated clicks ka common cycle kya hai?",
    options: [
      "asc -> asc -> asc",
      "asc -> desc -> none (unsorted) -> asc ...",
      "Sirf asc, kabhi desc nahi",
      "Random order",
    ],
    correctIndex: 1,
    explanation:
      "Naye column par pehla click asc, phir desc, phir sort clear (none). Active column par ek direction arrow (▲/▼) dikhana chahiye taaki user ko current order pata chale.",
    difficulty: "easy",
  },
  {
    id: "sorting-and-column-config-4",
    question: "Ek `format`ted/computed column (jaise `fullName` = first + last) par sorting enable karna hai. Kya zaroori hai?",
    options: [
      "Kuch nahi, client automatically handle kar leta hai",
      "API ko us sort key ko samajhna hoga (jaise `sort=fullName` ko `first_name, last_name` me map kare); agar API support nahi karta to us column par `sortable` disable karo",
      "Column ko `key` ke bina define karo",
      "`format` function me `.sort()` call karo",
    ],
    correctIndex: 1,
    explanation:
      "Sort server par hota hai, isliye server ko us sort key ka matlab pata hona chahiye. Computed display value (`fullName`) DB me column nahi hai — API explicitly map kare, warna sorting us column par offer mat karo.",
    difficulty: "medium",
  },
];

export default quiz;
