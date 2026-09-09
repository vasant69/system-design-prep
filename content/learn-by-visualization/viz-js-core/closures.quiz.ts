import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "closures-1",
    question:
      "`function mk() { let n = 0; return () => ++n; } const a = mk(), b = mk(); console.log(a(), a(), b());` — output?",
    options: ["`1 2 3`", "`1 2 1`", "`1 1 1`", "`3 3 3`"],
    correctIndex: 1,
    explanation:
      "`a` aur `b` alag-alag `mk()` calls se aaye — har call ka apna `n` (apna backpack). `a()` -> 1, `a()` -> 2 (wahi `n` badha). `b()` -> 1 (bilkul naya `n`). Isliye `1 2 1`. `1 2 3` tab hota agar `n` shared hota; `3 3 3` `var`-loop wale confusion se aata hai jo yahan lagoo nahi.",
    difficulty: "easy",
  },
  {
    id: "closures-2",
    question:
      "`const fns = []; for (var i = 0; i < 3; i++) { fns.push(() => i); } console.log(fns[0](), fns[1](), fns[2]());` — output?",
    options: ["`0 1 2`", "`3 3 3`", "`0 0 0`", "`undefined undefined undefined`"],
    correctIndex: 1,
    explanation:
      "`var i` poore loop ke liye ek hi binding hai. Teeno arrow functions usi ek `i` ka reference (backpack) rakhte hain — value ka snapshot nahi. Loop khatam hone par `i === 3`, isliye teeno `3` dete hain. `let i` karne se har iteration ka apna binding banta aur output `0 1 2` aata.",
    difficulty: "medium",
  },
  {
    id: "closures-3",
    question:
      "`function make() { let msg = 'hi'; return { read: () => msg, set: (m) => { msg = m; } }; } const o = make(); o.set('bye'); console.log(o.read());` — output?",
    options: ["`'hi'`", "`'bye'`", "`undefined`", "`ReferenceError`"],
    correctIndex: 1,
    explanation:
      "`read` aur `set` dono SAME `msg` variable par closure banate hain. `set('bye')` ne us variable ko update kiya, aur `read` ne wahi live variable padha -> `'bye'`. Closure value copy nahi karta, wo variable ka reference share karta hai — isliye ek closure ka update doosre ko dikhta hai.",
    difficulty: "hard",
  },
  {
    id: "closures-4",
    question: "Closure se 'private variable' ka kya matlab hai?",
    options: [
      "Variable `#private` syntax se declare hota hai",
      "Variable outer function ke scope mein hai; sirf return kiye gaye inner functions use padh/badal sakte hain, bahar se seedha access `ReferenceError` deta hai",
      "Variable `const` hota hai isliye kabhi change nahi hota",
      "Variable global hota hai par uska naam bahut lamba hota hai",
    ],
    correctIndex: 1,
    explanation:
      "Outer function ka local variable bahar ki duniya ko dikhta nahi — sirf usi function ke andar banaye gaye (aur return kiye gaye) functions uske scope chain mein hote hain, to wahi use touch kar sakte hain. Bahar se `count` likho to `ReferenceError`. `#`-fields class-only alag feature hai; `const` sirf reassignment rokta hai, visibility se lena-dena nahi.",
    difficulty: "medium",
  },
];

export default quiz;
