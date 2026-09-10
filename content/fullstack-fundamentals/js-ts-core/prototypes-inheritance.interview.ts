import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pi-1",
    question: "Prototype chain samjhao aur jab property read miss ho to kya hota hai.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Har object ka ek internal link ek prototype object se hota hai. `obj.x` par, agar `obj` me apna `x` na ho, engine `obj` ke prototype par jaata hai, phir uske prototype par, aur aage jab tak `x` na mile ya `null` na aaye (phir `undefined`). Writes hamesha object par khud hote hain.",
    detailedAnswer:
      "`new Foo()` instance ka prototype `Foo.prototype` set karta hai, jahan shared methods ek single copy me rehte hain. `class`/`extends` wahi chain nicer syntax ke saath banate hain. Kyunki sirf reads delegate karte hain, prototype par rakha object (jaise `Foo.prototype.items = []`) saare instances me shared ho jaata hai — classic bug.",
    followUp: "Function ki `prototype` property aur instance ke `__proto__` me kya farak hai?",
  },
  {
    id: "pi-2",
    question: "Kya JavaScript me `class` real classical inheritance hai? Under the hood kya hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. `class` prototypes par syntactic sugar hai. Methods `Class.prototype` par jaate hain, `extends` prototype link set karta hai, `super` usko walk karta hai, aur `constructor` initialiser hai. Runtime model abhi bhi prototypal delegation hai.",
    detailedAnswer:
      "Cosmetic se zyada farak: class bodies strict mode me chalte hain, methods non-enumerable hote hain, `class` declarations use ke liye hoist nahi hote (TDZ), aur class ko bina `new` call karna throw karta hai. Par `Object.getPrototypeOf(new Dog()) === Dog.prototype` aur `Animal.prototype` tak ki chain exactly wahi hai jo tum `Object.create` se haath se banate.",
  },
  {
    id: "pi-3",
    question: "Ek team 'memory bachane' ke liye `this.history = []` prototype par daalti hai. Kya galat hota hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Saare instances wahi array share karte hain. `a.history.push(x)` `b.history` se bhi dikhta hai kyunki `history` ka read single prototype copy ko delegate karta hai aur `push` use in place mutate karta hai. Instance state per instance constructor / class field me banni chahiye.",
    detailedAnswer:
      "Prototype par primitives kam khatarnak hain kyunki `a.count = 1` assign karna ek own property banata hai jo prototype wale ko shadow karti hai. Reference types trap hain: tum kabhi reassign nahi karte, tum shared object mutate karte ho. Methods (stateless functions) hi wo cheez hain jo prototype par honi chahiye; data nahi.",
    redFlag: "Ye conclude karna ki fix constructor me prototype array ko deep-clone karna hai, bajaye field ko instance par declare karne ke.",
  },
];

export default questions;
