import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "queue-stack-ll-1",
    question: "```csharp\nvar s = new Stack<int>();\ns.Push(1); s.Push(2); s.Push(3);\nConsole.WriteLine(s.Pop());\n```\nYe kya print karega?",
    options: ["1", "2", "3", "Compile error"],
    correctIndex: 2,
    explanation:
      "Stack LIFO (Last-In-First-Out) hai — sabse aakhri Push kiya hua element sabse pehle Pop hota hai. Yahan `3` sabse last push hua tha, isliye `Pop()` `3` return karega. Options A aur B galat hain — wo FIFO behavior hote (Queue ka), Stack ka nahi. Option D galat hai — ye syntactically valid code hai.",
    difficulty: "easy",
  },
  {
    id: "queue-stack-ll-2",
    question: "`LinkedList<T>` me kisi known node ke baad naya element insert karna (`AddAfter`) kis complexity ka operation hai, aur `List<T>` ke corresponding `Insert` se kaise alag hai?",
    options: [
      "Dono O(n) hain, koi fark nahi",
      "`LinkedList.AddAfter` O(1) hai (sirf pointers relink); `List.Insert` O(n) hai (elements shift karne padte hain)",
      "`LinkedList.AddAfter` O(n) hai; `List.Insert` O(1) hai",
      "Dono O(1) hain, koi fark nahi",
    ],
    correctIndex: 1,
    explanation:
      "`LinkedList<T>.AddAfter(node, value)` sirf do pointers ko relink karta hai — O(1), chahe list kitni bhi badi ho, bashart node ka reference already ho. `List<T>.Insert(index, value)` us index ke baad ke sab elements ko ek position shift karta hai — O(n). Ye exactly wo trade-off hai jo LinkedList offer karta hai — known-position insertion ke liye. Options A, C, D sab factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "queue-stack-ll-3",
    question: "Ek empty `Queue<int>` pe `Dequeue()` call karne par kya hota hai?",
    options: [
      "`0` (default value) return hota hai",
      "`null` return hota hai",
      "`InvalidOperationException` throw hota hai",
      "Ye silently ignore ho jaata hai, kuch nahi hota",
    ],
    correctIndex: 2,
    explanation:
      "Empty `Queue<T>` (ya `Stack<T>`) pe `Dequeue()` (ya `Pop()`) call karna `InvalidOperationException` throw karta hai — 'Queue empty hai.' Safe alternative `TryDequeue(out var item)` hai jo `bool` return karta hai bina exception ke. Options A aur B galat hain — koi silent default nahi milta. Option D galat hai — exception explicitly throw hota hai, silently ignore nahi hota.",
    difficulty: "easy",
  },
  {
    id: "queue-stack-ll-4",
    question: "Interview me poocha jaata hai: 'kya `LinkedList<T>` hamesha `List<T>` se better hai insertion-heavy scenarios me?' Sahi jawab kya hai?",
    options: [
      "Haan, LinkedList hamesha better hota hai theoretical O(1) insertion ki wajah se",
      "Nahi — practically List<T> ka cache-friendly contiguous memory aur amortized-O(1) end-append usually behtar real-world performance deta hai; LinkedList sirf specific known-position-insertion scenarios me genuinely valuable hai",
      "Nahi, LinkedList kabhi bhi List se better nahi hota",
      "Dono hamesha exactly same performance dete hain",
    ],
    correctIndex: 1,
    explanation:
      "Ye ek nuanced, honest answer chahta hai — theoretical Big-O complexity hamesha real-world performance ko predict nahi karta. `List<T>` ka contiguous memory layout CPU cache ke saath bahut achha kaam karta hai, aur uska amortized-O(1) end-append typical scenarios me fast hota hai. `LinkedList<T>` genuinely tab jeetta hai jab frequent insertions KNOWN node positions pe ho rahi hon aur data bada ho. Option A oversimplified hai (theoretical complexity ko blindly follow karta hai). Option C bhi galat extreme hai. Option D factually galat hai.",
    difficulty: "hard",
  },
];

export default quiz;
