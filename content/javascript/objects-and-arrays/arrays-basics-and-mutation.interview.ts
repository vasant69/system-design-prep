import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "arr-mut-1",
    question: "Array ke mutating aur non-mutating methods mein kya farak hai? Kuch examples do.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Mutating methods original array ko jagah pe badalte hain: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`. Non-mutating methods original ko chhodkar naya array return karte hain: `slice`, `concat`, `map`, `filter`, `flat`, `flatMap`, aur spread `[...arr]`.",
    detailedAnswer:
      "Mutating methods memory bacha te hain (in-place) par side effect dete hain — agar array kisi aur ke paas bhi hai to wo bhi badal jata hai. Unke return values bhi non-obvious hain: `push`/`unshift` nayi `length` dete hain, `pop`/`shift` hataya element, `splice` hataye elements ka array, `sort`/`reverse` wahi (mutated) array. Non-mutating methods predictable hain aur chaining allow karte hain (`arr.filter(...).map(...)`), par har call ek nayi array allocate karta hai. ES2023 ne mutating methods ke non-mutating twins diye: `toSorted`, `toReversed`, `toSpliced`, `with`. Rule of thumb: agar array function ka parameter hai, module-level hai, ya framework state hai — non-mutating use karo.",
    followUp: "`toSorted` aur `[...arr].sort()` mein practical farak kya hai?",
    redFlag: "\"map bhi original ko badal deta hai\" — map hamesha naya array deta hai.",
  },
  {
    id: "arr-mut-2",
    question: "`[1, 2, 10].sort()` `[1, 10, 2]` kyun deta hai? Sahi kaise karoge?",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer:
      "Default `sort` har element ko string mein convert karke UTF-16 code unit order (lexicographic) mein compare karta hai. String `'10'` `'2'` se pehle aata hai kyunki `'1' < '2'`. Fix: `.sort((a, b) => a - b)` ascending, `.sort((a, b) => b - a)` descending.",
    detailedAnswer:
      "Spec ke mutabik, jab compare function nahi diya jata, `sort` elements ko `String(x)` karke compare karta hai. Isliye numbers galat order mein aate hain, aur `[10, 9, 1].sort()` `[1, 10, 9]` deta hai. Compare function `(a, b)` ka contract: negative return karo agar `a` pehle aana chahiye, positive agar `b` pehle, `0` agar equal. Numbers ke liye `a - b` seedha ye satisfy karta hai. Strings ke liye default theek hai ya `a.localeCompare(b)` for locale-aware. Do baatein aur: `sort` in-place mutate karta hai (`[...arr].sort()` se bacho agar original chahiye), aur ES2019 se `sort` **stable** hai — equal elements apna relative order rakhte hain, jo multi-key sorting mein useful hai.",
    followUp: "Objects ke array ko kisi property se sort kaise karoge, aur stability kyun matter karti hai?",
  },
  {
    id: "arr-mut-3",
    question: "React state mein ek array hai. Usme naya item add karna hai — kya likhoge aur kya nahi?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "`setItems([...items, newItem])` ya `setItems(items.concat(newItem))` — nayi array reference. `items.push(newItem); setItems(items)` mat karo — reference wahi rehti hai, React ko change nahi dikhta, re-render nahi hota.",
    detailedAnswer:
      "React `Object.is` se purani aur nayi state compare karta hai. `push`/`splice`/`sort`/`reverse` array ko in-place badalte hain par reference wahi rehti hai, to `Object.is(old, new)` `true` — React skip kar deta hai. Isliye: add = `[...items, x]`, remove = `items.filter(i => i.id !== id)`, update = `items.map(i => i.id === id ? { ...i, done: true } : i)`, sort = `items.toSorted(cmp)` ya `[...items].sort(cmp)`. Yehi immutability rule Redux reducers pe bhi lagta hai. Agar deeply nested state frequently update ho rahi hai to Immer (Redux Toolkit ke andar) mutable-looking syntax deta hai jo andar se immutable update karta hai.",
    followUp: "`items.map(i => i.id === id ? { ...i, done: true } : i)` mein `{ ...i }` kyun zaroori hai?",
    redFlag: "\"push karke setState kaafi hai\" — reference nahi badalti, render nahi hota.",
  },
  {
    id: "arr-mut-4",
    question: "`const arr = [1, 2, 3]; arr.push(4);` — ye kaise chal gaya jab arr `const` hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`const` sirf binding lock karta hai — `arr` hamesha usi array ko point karega, `arr = [...]` TypeError dega. Lekin us array ke andar mutation (`push`, `pop`, `splice`) allowed hai kyunki array object wahi rehta hai.",
    detailedAnswer:
      "Variable ke do hisse: naam (binding) aur reference (jis array ko point kar raha). `const` naam ko fix karta hai, us array ke contents ko nahi. `arr.push(4)`, `arr[0] = 9`, `arr.length = 0` sab valid. `arr = []` ya `arr = arr.concat(4)` invalid (rebinding). Agar contents bhi freeze karne hain to `Object.freeze(arr)` — uske baad `push` silently fail (strict mein TypeError) — par ye shallow hai, nested objects/arrays still mutable. TypeScript mein `readonly number[]` ya `as const` compile-time protection deta hai.",
    followUp: "`Object.freeze([1, [2, 3]])` ke baad `arr[1].push(4)` chalega?",
  },
  {
    id: "arr-mut-5",
    question: "Array ka `length` property ke saath kya-kya kar sakte ho? Koi trick?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`length` writable hai. `arr.length = 0` array ko in-place khali kar deta hai; `arr.length = 2` end se elements truncate kar deta hai; `arr.length` badha dene se holes (empty slots) ban jate hain.",
    detailedAnswer:
      "`length` hamesha `(sabse bada integer index) + 1` hota hai aur assignable hai. `arr.length = 0` ek reference ko khali karne ka fast idiom hai jab wahi array kai jagah cached ho (naya `[]` assign karne se woh doosri references purane data pe hi rehti). `arr.length = 3` jab `arr` bada tha — end ke elements permanently gaye. `arr.length = 10` jab `arr` chhota tha — beech mein holes; ye `undefined` nahi hote, aur `map`/`forEach`/`filter` inhe skip karte hain jabki `for` loop aur spread inhe `undefined` ki tarah dekhte hain. Index se aage jump (`arr[100] = 'x'`) bhi `length` ko `101` kar deta hai with 99 holes — sparse array, jo performance ke liye bura hai (engine fast path chhod deta hai).",
    followUp: "Sparse array aur dense array mein engine ke liye kya farak hai?",
  },
];

export default questions;
