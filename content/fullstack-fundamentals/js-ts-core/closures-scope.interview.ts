import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cs-1",
    question: "Closure define karo aur textbook counter ke alawa ek real use batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Closure ek function hai jo apne define hone wale scope ke variables ke references ke saath bundled hota hai, isliye wo us scope ke exit hone ke baad bhi unhe read aur mutate kar sakta hai. Real uses: private state / data hiding, memoization caches, once-only ya throttled functions, partial application, aur module pattern.",
    detailedAnswer:
      "Har wo callback jo outer variable touch karta hai ek closure hai — event handlers, `setTimeout`, array method callbacks, framework hooks. Key property: captured variable shared aur live hota hai, copy nahi — isi se private mutable state banti hai: sirf wo functions expose karo jinhe use badalne ki permission hai.",
    followUp: "Closure memory leak kaise kar sakti hai?",
  },
  {
    id: "cs-2",
    question: "Ye kya print karega aur kyun: `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0)`?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`3 3 3`. `var i` ek function-scoped variable hai jo teeno callbacks share karte hain. Koi bhi timeout chalne se pehle loop khatam ho jaata hai (i = 3), isliye har callback final value read karta hai.",
    detailedAnswer:
      "Fixes: `let i` use karo, jo per iteration fresh binding banata hai (0 1 2 print); ya IIFE `((j) => setTimeout(() => console.log(j)))(i)`; ya `i` ko `setTimeout` ke teesre arg ke roop me pass karo. Ye direct test hai ki closures variable capture karti hain, capture time par uski value nahi.",
    redFlag: "`0 1 2` jawab dena — wo `let` behaviour hai, `var` nahi.",
  },
  {
    id: "cs-3",
    question: "Lexical scope vs dynamic scope — JavaScript kaunsa use karta hai, aur wo `this` ke saath kaise interact karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "JavaScript variable resolution lexical hai: isse tay hota hai ki function source me kahan likha hai, scope chain bahar ki taraf walk karke. `this` dynamic hai — isse tay hota hai ki function kaise call hua. Arrow functions ka apna `this` nahi hota aur wo lexically lete hain, yahi ek jagah hai jahan dono rules milte hain.",
    detailedAnswer:
      "Toh `outer()` ke andar `function inner()` hamesha `outer` ke variables dekh sakta hai chahe `inner` baad me kahin bhi invoke ho. Par `obj.method()` vs `const m = obj.method; m()` `this` badal deta hai bina scope ko chhue. In dono ko mix karne se bugs aate hain jaise `obj.method` ko callback ki tarah pass karna aur `this` khona jabki galat se closure-jaisa behaviour expect karna.",
  },
];

export default questions;
