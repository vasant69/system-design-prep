import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sdc-1",
    question: "Shallow copy aur deep copy mein farak, aur JS mein har ek kaise banate ho?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Shallow: naya top-level object/array, par nested values reference se copy — copy aur original first level ke neeche sab share karte hain. Deep: har level recursively clone, dono fully independent. Shallow: spread, Object.assign, slice, Array.from. Deep: structuredClone, JSON round-trip (limited), ya recursive/library helper.",
    detailedAnswer:
      "Object/array ek reference value hai. Shallow copy top-level keys ko naye container mein daalta hai; jo values khud objects hain, unka reference copy hota hai — isliye nested mutation dono jagah dikhta hai. Deep copy har nested object/array ko bhi naya banata hai. structuredClone(x) modern built-in hai (Date/Map/Set/typed arrays/cycles handle karta hai). JSON.parse(JSON.stringify(x)) sirf JSON-safe data pe kaam karta hai. Zyadatar app code ko full deep copy ki zarurat nahi — sirf us path ka shallow copy chahiye jo badal raha hai (immutable update pattern).",
    followUp: "structuredClone functions aur class instances pe kya karta hai?",
    redFlag: "\"Spread se poora object clone ho jaata hai\" — sirf ek level hi copy hota hai.",
  },
  {
    id: "sdc-2",
    question:
      "`const b = { ...a }` ke baad bhi `b` ke through `a` ka nested data corrupt ho gaya. Kaise? Fix?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Spread shallow hai — b.nested aur a.nested ek hi object hain. b.nested.x = ... ne a ko bhi badla. Fix: jis nested level ko mutate kar rahe ho use bhi copy karo ({ ...a, nested: { ...a.nested, x: 1 } }), ya poora structuredClone(a) lo.",
    detailedAnswer:
      "Common jagah: shared constant/default config, ya ek fetched response jise do jagah use kar rahe ho. { ...a } sirf a ke apne enumerable keys copy karta hai; koi bhi object/array value shared rehti hai. Fix options: (1) targeted — sirf changing branch ko spread karo; (2) structuredClone(a) — pura independent snapshot chahiye tab; (3) immer jaisi library jo mutation-style code ko safe immutable update mein badal de. Debugging tip: 'maine to copy banaya tha' wala bug ho to pehle shallow-copy pe shak karo.",
    followUp: "immer produce() internally ye kaise safe banata hai?",
  },
  {
    id: "sdc-3",
    question:
      "structuredClone se pehle log JSON.parse(JSON.stringify()) kyun use karte the, aur wo kahan chup-chaap galat karta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "structuredClone naya-ish hai (Node 17+, modern browsers); usse pehle JSON hack hi zero-dependency deep copy tha. Wo functions aur undefined ko gira deta hai, Date ko string bana deta hai, Map/Set ko {} bana deta hai, NaN/Infinity ko null, aur BigInt ya circular ref pe throw karta hai — inme se kuch silent data loss hain.",
    detailedAnswer:
      "Sabse khatarnak silent case: Date object ka string ban jaana (baad ka .getTime() TypeError deta hai), aur undefined properties ka gayab ho jaana — shape badal jaata hai bina error ke. Map/Set to {} ban jaate hain, to logic silently khaali collection pe chalta hai. Performance bhi kharab hai badi objects pe (poora serialize + parse). structuredClone in sabko theek karta hai; sirf functions/DOM nodes pe DataCloneError deta hai, jo at least loud hai.",
    followUp: "Circular reference wale object ko deep copy karne ka koi safe tarika?",
  },
  {
    id: "sdc-4",
    question:
      "'Immutability ke liye har update pe poora state deep-clone kar do' — is advice mein kya galat hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Zaroorat se zyada kaam. Immutable update ke liye sirf woh nodes naye chahiye jo root se changed value tak ke path pe hain; baaki subtrees purana reference reuse kar sakte hain (structural sharing). Poora deep clone slow hai aur har reference badal deta hai, jisse React.memo / useMemo / selector memoization bekaar ho jaati hai.",
    detailedAnswer:
      "Structural sharing: { ...state, items: state.items.map((it, i) => i === idx ? { ...it, done: true } : it) } — sirf root, items array, aur ek badla item naye; baaki items same reference. Isse shallow equality checks fast rehte hain aur sirf actually-changed components re-render karte hain. Full structuredClone har baar: O(size) time aur memory, saari referential equality toot jaati hai, aur non-cloneable values pe crash. Deep clone tab theek hai jab genuinely detached snapshot chahiye (undo history entry, worker ko bhejna).",
    followUp: "Structural sharing ko manually likhna error-prone hai — kaunse tools ise handle karte hain?",
  },
];

export default questions;
