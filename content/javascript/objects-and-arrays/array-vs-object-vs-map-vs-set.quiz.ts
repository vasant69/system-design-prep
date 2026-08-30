import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "array-vs-object-vs-map-vs-set-1",
    question:
      "10000 IDs ke array mein ek loop ke andar baar-baar check karna hai 'kya yeh id list mein hai'. Sabse efficient structure?",
    options: [
      "Array — array.includes(id) har baar",
      "Object — obj[id] check, par prototype keys ka dhyaan",
      "Set — pehle new Set(ids) banao, phir set.has(id) O(1) per check",
      "Map — new Map, har id ko key banao",
    ],
    correctIndex: 2,
    explanation:
      "`array.includes` har call pe O(n) — worst case poora array scan. Loop ke andar yeh O(n*m) ban jaata hai. `Set` membership O(1) average deta hai, aur intent bhi clear hai (uniqueness + membership). Object bhi O(1) lookup deta par string coercion aur inherited keys (`toString` etc.) ke risks hain. Map yaha overkill hai — koi value nahi chahiye, sirf 'hai ya nahi'.",
    difficulty: "medium",
  },
  {
    id: "array-vs-object-vs-map-vs-set-2",
    question:
      "`const m = new Map([['a', 1]]); const json = JSON.stringify(m);` — `json` kya hoga?",
    options: [
      '\'{"a":1}\' — Map object ki tarah serialize hota hai',
      "'{}' — Map (aur Set) JSON.stringify mein khaali object ban jaate hain, data gayab",
      '\'[["a",1]]\' — entries array ban jaata hai',
      "TypeError — Map serialize nahi ho sakta",
    ],
    correctIndex: 1,
    explanation:
      "`JSON.stringify` sirf plain objects aur arrays ko samajhta hai. Map aur Set ke paas apni enumerable own properties nahi hoti jo stringify pick kare, isliye result `'{}'` — data silently gayab. Network/localStorage se pehle convert karo: `JSON.stringify(Object.fromEntries(m))` ya `JSON.stringify([...m])`, aur wapas `new Map(...)`.",
    difficulty: "medium",
  },
  {
    id: "array-vs-object-vs-map-vs-set-3",
    question:
      "`const store = {}; store[user1] = 'a'; store[user2] = 'b';` jaha user1 aur user2 alag objects hain. `Object.keys(store).length` kya hai?",
    options: [
      "2 — do alag object keys",
      "1 — dono objects '[object Object]' string mein coerce ho jaate hain, doosra pehle ko overwrite karta hai",
      "0 — objects keys nahi ban sakte",
      "TypeError",
    ],
    correctIndex: 1,
    explanation:
      "Plain object ki keys hamesha string (ya symbol) hoti hain. Object ko key banane pe uska `String(key)` liya jaata hai = `'[object Object]'` har normal object ke liye. To `store[user1]` aur `store[user2]` dono same key `'[object Object]'` pe likhte hain — second overwrites first, ek hi key bachti hai. Object-as-key chahiye to `Map` (ya `WeakMap`) use karo.",
    difficulty: "hard",
  },
  {
    id: "array-vs-object-vs-map-vs-set-4",
    question: "'const employees = []' — array kyun, plain object ya Map kyun nahi? Best reasoning?",
    options: [
      "Array fastest hai isliye — Object aur Map dono slow hote hain",
      "Employees ek ordered sequence hai jise iterate karte hain aur position se sochte hain; stable id se random-access nahi chahiye — isliye array. Object ek fixed-field record ke liye hai, Map ek id->record dictionary ke liye jaha bahut writes aur .size chahiye",
      "Object mein numeric keys nahi ho sakti isliye array",
      "Map ES6 ka hai isliye purane browsers mein array safer",
    ],
    correctIndex: 1,
    explanation:
      "Decision access pattern se aati hai. `employees` ek sequence hai — order matters, tum ise map/filter/render karte ho, kisi ek employee ko stable unique key se random-access nahi karte. Isliye Array. Object ka kaam ek record (named fields) ya identifier-keyed lookup hai — yaha woh fit nahi aur numeric order/.length ke liye awkward hai. Map tab chahiye jab tum `id -> employee` dictionary maintain karo, bahut add/delete ho, aur .size chahiye. Agar id-lookup baad mein chahiye to Map array ke SAATH banao, uski jagah nahi. Option A galat — 'fastest' blanket claim nahi; Option C galat — object mein numeric-jaisi keys ho sakti hain (string ban jaati hain).",
    difficulty: "medium",
  },
];

export default quiz;
