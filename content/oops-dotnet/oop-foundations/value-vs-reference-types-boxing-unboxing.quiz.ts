import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "value-ref-types-1",
    question: "Ek `struct Point { public int X; }` agar ek class ke field ke roop me define hai (`class Order { public Point Location; }`), to `Location` field kahan allocate hota hai?",
    options: [
      "Hamesha stack par, kyunki Point ek struct (value type) hai",
      "Heap par, apne parent Order object ke saath — kyunki value type ka location uske containing context par depend karta hai",
      "Ek alag, dedicated struct-only memory region me",
      "Kahin bhi nahi, structs fields ke roop me allowed nahi hain",
    ],
    correctIndex: 1,
    explanation:
      "'Value type hamesha stack par hota hai' ek common misconception hai. Agar value type kisi class ka field hai, to wo apne parent object ke saath heap par jaata hai, kyunki poora Order object heap par hai aur Location uska hi inline part hai. Options A, C, D is nuance ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "value-ref-types-2",
    question: "```csharp\nclass Box { public int X; }\nvar b1 = new Box { X = 5 };\nvar b2 = b1;\nb2.X = 100;\n```\n`b1.X` ki value kya hogi is code ke baad?",
    options: [
      "5, kyunki b2 ek copy hai",
      "100, kyunki b1 aur b2 dono same heap object ko point karte hain — reference copy hua tha, object nahi",
      "0, kyunki assignment dono ko reset kar deta hai",
      "Compile error aayega",
    ],
    correctIndex: 1,
    explanation:
      "`Box` ek class hai (reference type), isliye `var b2 = b1;` sirf reference copy karta hai — b1 aur b2 dono SAME heap object ki taraf point karte hain. `b2.X = 100` us shared object ko modify karta hai, isliye b1.X bhi 100 dikhega. Option A struct wale behavior ko galat yahan apply kar raha hai.",
    difficulty: "medium",
  },
  {
    id: "value-ref-types-3",
    question: "`int x = 42; object o = x;` line execute hone par CLR kya karta hai?",
    options: [
      "Kuch nahi, ye sirf ek type cast hai bina kisi cost ke",
      "Boxing — heap par ek naya wrapper object allocate karta hai aur x ki value usme copy karta hai",
      "x ko permanently object type me convert kar deta hai, ab wo kabhi int nahi rahega",
      "Compile error deta hai kyunki int object me directly assign nahi ho sakta",
    ],
    correctIndex: 1,
    explanation:
      "Ye boxing hai — CLR heap par ek naya object allocate karta hai jisme value type ka data copy hota hai, aur uska reference `o` me store hota hai. Ye ek real, measurable heap allocation cost hai, free operation nahi. Option A isko galat cost-free bata raha hai, C aur D dono factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "value-ref-types-4",
    question: "Non-generic `ArrayList` ki jagah `List<T>` (generics) introduce karne ka ek major reason kya tha?",
    options: [
      "List<T> me sirf strings store ho sakte hain",
      "Generics value types ko bina boxing ke store karne dete hain, jisse ArrayList jaisi non-generic collections ka heap allocation/GC overhead avoid hota hai",
      "ArrayList thread-safe nahi tha, List<T> hai",
      "List<T> automatically sorted rehta hai",
    ],
    correctIndex: 1,
    explanation:
      "`ArrayList` `object` store karta tha, isliye value types (jaise int) daalne par har element box hota tha — significant perf/GC cost. `List<T>` type-specific hone ki wajah se value types ko unboxed, contiguous memory me store karta hai, boxing avoid karta hai. Options A, C, D factually galat statements hain.",
    difficulty: "medium",
  },
];

export default quiz;
