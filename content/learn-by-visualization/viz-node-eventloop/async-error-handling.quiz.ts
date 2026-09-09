import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "async-error-handling-1",
    question:
      "`async function f() { try { return risky(); } catch (e) { return 'caught'; } }` — `risky()` ek reject hone wala promise return karta hai (no `await`). `f()` ka kya hota hai?",
    options: [
      "`f()` resolve karta hai `'caught'` se",
      "`f()` reject hota hai — `catch` chala hi nahi kyunki `await` nahi tha",
      "`f()` `undefined` resolve karta hai",
      "SyntaxError — async function mein bina await return nahi kar sakte",
    ],
    correctIndex: 1,
    explanation:
      "`return risky()` bina `await` ke us promise ko `f` ke result se chain kar deta hai, par rejection `try` block ke bahar hoti hai (tab tak try exit ho chuka). Isliye `catch` kabhi nahi chalta aur `f()` reject ho jaata hai. Fix: `return await risky();` — `await` rejection ko `try` ke andar throw mein badal deta hai.",
    difficulty: "medium",
  },
  {
    id: "async-error-handling-2",
    question: "`Promise.all([a, b, c])` mein `b` reject ho jaata hai. Behaviour?",
    options: [
      "Poora `Promise.all` `b` ke error se turant reject hota hai; `a`/`c` ke results discard",
      "`Promise.all` `[resultA, undefined, resultC]` resolve karta hai",
      "`Promise.all` `a`/`c` ke settle hone ka wait karke phir reject hota hai",
      "`Promise.all` kabhi settle nahi hota",
    ],
    correctIndex: 0,
    explanation:
      "`Promise.all` fail-fast hai: pehla reject hote hi wo us reason se reject ho jaata hai, baaki promises ka intzaar kiye bina (wo background mein chalte rehte hain, par unke results tumhe nahi milte). Agar tumhe har result chahiye — success ho ya fail — to `Promise.allSettled` use karo jo har entry ka `{ status, value | reason }` deta hai aur kabhi reject nahi hota.",
    difficulty: "easy",
  },
  {
    id: "async-error-handling-3",
    question:
      "`sendMetric(data);` — ek async function jo kabhi-kabhi reject hota hai, bina `await` aur bina `.catch()` ke call kiya. Kya risk hai?",
    options: [
      "Kuchh nahi — rejection silently ignore ho jaati hai, safe",
      "Ek 'unhandledRejection' event fire hota hai; modern Node isse crash treat kar sakta hai (aur future mein default crash hai)",
      "`sendMetric` sync ban jaata hai",
      "Node retry karta hai automatically",
    ],
    correctIndex: 1,
    explanation:
      "Bina handler ke rejected promise 'unhandled rejection' hai. Node ek `unhandledRejection` process event emit karta hai; recent versions isse non-zero exit ke saath crash karte hain by default. Fire-and-forget call ko hamesha `.catch()` do (`sendMetric(data).catch(log)`) ya `await` karke `try/catch` mein rakho.",
    difficulty: "medium",
  },
  {
    id: "async-error-handling-4",
    question: "`process.on('unhandledRejection', handler)` ka sahi use kya hai?",
    options: [
      "Rejection ko swallow karke app ko normally chalte rehne dena",
      "Har promise ke liye default `.catch()` ki tarah use karna",
      "Sirf last-resort: structured log likho aur process ko clean shut down / exit karao (recover mat karo)",
      "Rejected promise ko re-run karwana",
    ],
    correctIndex: 2,
    explanation:
      "`unhandledRejection` (aur `uncaughtException`) ek safety net hai, error handling strategy nahi. Us point pe app ka state possibly corrupt hai. Sahi kaam: error ko detail ke saath log karo, in-flight kaam gracefully band karo, aur `process.exit(1)` — phir process manager (pm2/systemd/k8s) fresh restart de. Inhe swallow karke chalte rehna latent bugs aur leaks paida karta hai.",
    difficulty: "hard",
  },
];

export default quiz;
