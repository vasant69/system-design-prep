import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "managed-unmanaged-1",
    question: "Ek `FileStream` object garbage ban jaata hai (koi reference nahi bachta) bina `Dispose()` call kiye. GC eventually ise collect karega. Kya underlying OS file handle bhi turant release hoga?",
    options: [
      "Haan, GC managed object collect karte hi OS handle bhi turant release karta hai",
      "Zaroori nahi — GC ko unmanaged file handle ke baare me pata hi nahi, release timing guaranteed nahi",
      "Nahi, file handle kabhi release nahi hoga chahe kuch bhi ho",
      "GC automatically Dispose() call kar deta hai collect karne se pehle",
    ],
    correctIndex: 1,
    explanation:
      "GC sirf managed memory (managed heap pe allocated object) manage karta hai. Underlying unmanaged file handle CLR ki bookkeeping se bahar hai — usko release karne ka koi guarantee GC collection se nahi milta jab tak explicit cleanup (Dispose/finalizer) na ho. Option A galat hai kyunki GC ko unmanaged resource ka pata hi nahi. Option C galat hai — eventually finalizer (agar defined ho) ya explicit Dispose se release ho sakta hai. Option D galat hai — GC khud Dispose() call nahi karta, wo developer/using ki responsibility hai.",
    difficulty: "medium",
  },
  {
    id: "managed-unmanaged-2",
    question: "GC ke mark-and-sweep algorithm me 'root' kya nahi hota?",
    options: [
      "Static fields",
      "Currently executing method ke local variables",
      "Ek object jo heap pe kisi doosre object se reference kiya jaa raha hai",
      "CPU registers me held references",
    ],
    correctIndex: 2,
    explanation:
      "Roots wo starting points hain jahan se GC reachability traverse karta hai — static fields, stack pe local variables/parameters, CPU registers. Ek heap object jo doosre object se reference ho raha hai wo khud root nahi hai — wo reachability graph ka ek node hai jo kisi root se (directly ya indirectly) reach hone par 'alive' mark hota hai. Options A, B, D sab genuine root categories hain.",
    difficulty: "hard",
  },
  {
    id: "managed-unmanaged-3",
    question: "'Object unreachable ho gaya' aur 'object garbage collect ho gaya' — inme kya relationship hai?",
    options: [
      "Dono ek hi moment pe hote hain, always simultaneously",
      "Object collect hone ke kaafi baad unreachable hota hai",
      "Object unreachable ho sakta hai bahut pehle, actual collection timing non-deterministic hai — GC apni marzi se run karta hai",
      "Unreachable hona aur collect hona koi relation nahi rakhte",
    ],
    correctIndex: 2,
    explanation:
      "Ek object turant unreachable ban sakta hai (jaise ek method return hote hi jiska local variable tha), lekin GC ka actual collection cycle kab chalega ye deterministic nahi hai — GC memory pressure aur allocation rate ke basis pe decide karta hai. Yahi wajah hai ki deterministic cleanup ke liye `Dispose()`/`using` use hota hai, sirf GC pe depend nahi kiya jaata.",
    difficulty: "medium",
  },
  {
    id: "managed-unmanaged-4",
    question: "Ek naya developer bolta hai: '.NET garbage collected hai, isliye memory leak possible hi nahi hai.' Ye statement kyun galat hai?",
    options: [
      "Ye sahi hai, .NET me memory leak literally impossible hai",
      "Galat hai — unmanaged resources GC ki reach se bahar hain, aur managed memory bhi static references/unsubscribed events ke through 'logically' leak ho sakti hai",
      "Galat hai kyunki .NET me GC feature hi nahi hai",
      "Galat hai kyunki GC sirf Windows pe kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "GC sirf unreachable managed memory reclaim karta hai — agar koi reference chain (jaise static field, ya unsubscribed event handler) ek object ko 'reachable' bana kar rakhe, GC use kabhi collect nahi karega chahe application logically use nahi kar raha ho. Ye 'managed memory leak' hai. Aur unmanaged resources (file handles, sockets) GC ki reach se bilkul bahar hain. Options A, C, D factually galat premises hain.",
    difficulty: "hard",
  },
];

export default quiz;
