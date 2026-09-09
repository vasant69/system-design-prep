import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "mfr-1",
    question:
      "map, filter aur reduce ka farak — har ek ek line mein, aur teeno original array ko mutate karte hain kya?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "map: har element transform, same length ka naya array. filter: test pass karne wale elements, chhota ya same array. reduce: poore array ko ek accumulated value mein fold. Teeno non-mutating — original array untouched, naya result milta hai.",
    detailedAnswer:
      "map (n -> n): callback ka return har index pe naye array mein jaata hai. filter (n -> kam ya barabar): callback truthy return kare to element rakha jaata hai. reduce (n -> 1): callback (accumulator, current) leta hai, har step ka return next accumulator ban jaata hai, aakhri accumulator result hota hai. reduce sabse general hai — map aur filter dono reduce se banaye ja sakte hain. Teeno naya array/value return karte hain; original ko change nahi karte (sort/reverse/splice ke ulat).",
    followUp: "reduce se map aur filter kaise implement karoge?",
    redFlag: "\"map original array ko modify karta hai\" — nahi, wo naya array deta hai.",
  },
  {
    id: "mfr-2",
    question: "`['1','2','3'].map(parseInt)` ka output kya hai? Fix batao.",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "[1, NaN, NaN]. map callback ko (value, index, array) deta hai, to parseInt ko (value, index) milta hai aur index radix ban jaata hai: parseInt('1',0)=1, parseInt('2',1)=NaN, parseInt('3',2)=NaN. Fix: .map((x) => parseInt(x, 10)) ya .map(Number).",
    detailedAnswer:
      "parseInt(string, radix) do args leta hai. map har element pe teen args pass karta hai. Doosre iteration mein parseInt('2', 1) chalta hai — radix 1 invalid -> NaN; teesre mein parseInt('3', 2) — base-2 mein '3' invalid -> NaN. Pehla parseInt('1', 0) chalta hai kyunki radix 0 ko engine ignore karke 10 maan leta hai. Lesson: built-in functions ko seedhe map ka callback mat banao jab tak unki poori signature safe na ho.",
    followUp: "Number aur parseInt mein '12px' jaise input pe kya farak hai?",
  },
  {
    id: "mfr-3",
    question:
      "reduce se ek array ko group-by karke `{ category: items[] }` banao — logic samjhao.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Initial value {} do. Har item pe: agar acc[item.cat] undefined hai to use [] set karo, phir acc[item.cat].push(item), aur acc return karo. Aakhir mein ek object jisme har key ek category aur value us category ke items ka array.",
    detailedAnswer:
      "items.reduce((acc, item) => { (acc[item.cat] ||= []).push(item); return acc; }, {}). acc accumulator hai jo poore traverse mein carry hota hai. ||= pehli baar khaali array bana deta hai. Ye reduce ka signature use-case hai: input ek array, output ek aggregated structure. Modern alternative: Object.groupBy(items, (item) => item.cat) ya lodash groupBy.",
    followUp: "reduce ke andar har baar naya object spread ({ ...acc }) karna kyun mehenga hota hai?",
  },
  {
    id: "mfr-4",
    question:
      "Ek badi list pe .map().filter().reduce() chain hai. Performance aur readability ke liye kya sochoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Readability: chain declarative aur saaf hai, temp variables nahi. Performance: har step ek naya array plus full pass banata hai (3 passes, 2 intermediate arrays). filter ko pehle rakho taaki baad ke steps kam elements pe chalein; bahut bade data pe sab kuch ek reduce ya for-of loop se ek hi pass mein karo.",
    detailedAnswer:
      "Chain 3 alag iterations aur 2 throwaway arrays banati hai — chhote/medium arrays pe bilkul theek. Optimisation order: (1) filter pehle -> transform/aggregate kam rows pe. (2) Bahut bade arrays ya hot path pe: ek reduce ya plain for-of loop jo filter, map aur accumulate ek hi pass mein kare. (3) Lazy evaluation chahiye to generators ya libraries (lodash chain). Default: readability jeetti hai jab tak profiler asli bottleneck na dikhaye.",
    followUp: "Transducers ya generators intermediate arrays ki problem kaise solve karte hain?",
  },
];

export default questions;
