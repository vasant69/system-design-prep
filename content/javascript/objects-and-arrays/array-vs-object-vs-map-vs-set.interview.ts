import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "aoms-1",
    question: "Array, Object, Map aur Set — chaaron kis kaam ke liye hain? Ek-ek line mein.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Array: ordered sequence, index se access, duplicates allowed, tum ise loop karte ho. Object: ek record with known string keys (config/DTO) ya simple identifier-keyed lookup. Map: any-type keys (objects bhi), insertion order guaranteed, .size, cheap add/delete. Set: unique values, fast membership test (has), dedupe.",
    detailedAnswer:
      "Sabse pehla sawaal: cheezein POSITION/order se access hoti hain ya KEY se? Position se -> Array (ya Set agar sirf unique values chahiye aur index nahi). Key se -> Object ya Map.\n\nArray: `[a, b, c]` — engine ise packed indexed storage se optimise karta hai, index O(1), push/pop O(1), shift/unshift/splice O(n). Use jab order matters aur tum map/filter/reduce karte ho.\n\nObject: `{ name, age }` — known, chhoti, fixed shape. Engine hidden classes se fast banata hai. JSON-friendly. Use for records, config, function argument bundles, ya simple lookup jab keys valid identifiers hon.\n\nMap: hash table, kisi bhi key type ke liye (object keys!), insertion order, `.size`, `has`/`get`/`set`/`delete` O(1) average, prototype-key collision nahi. Use jab keys dynamic/unknown/non-string, bahut writes, ya .size chahiye.\n\nSet: values-only hash table. `has` O(1). Use for uniqueness enforcement aur fast repeated membership.",
    followUp: "Map aur plain object mein concrete farak kya hai — teen points?",
    redFlag: "'Map aur object basically same cheez hai' — key types, order, size, prototype safety, JSON behaviour sab alag hain.",
  },
  {
    id: "aoms-2",
    question:
      "Plain object ko dictionary/hash-map ki tarah use karne mein kya problems hain? Map yeh kaise theek karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Object ki problems: inherited keys (`obj['toString']` prototype se milta hai, false positives), `__proto__` special key hai, saari keys string mein coerce (obj[1] === obj['1'], obj[{}] === obj['[object Object]']), aur `.size` nahi (Object.keys(obj).length O(n)). Map: koi prototype nahi to inherited-key issue nahi, koi bhi key type as-is, `.size` property, insertion order guaranteed, add/delete cheap.",
    detailedAnswer:
      "Object-as-map footguns:\n\n1. Inherited keys — `const seen = {}; if (seen['toString']) {...}` truthy hai kyunki `toString` `Object.prototype` se aata hai. `Object.hasOwn(seen, key)` ya `Object.create(null)` chahiye.\n2. `__proto__` — as a key yeh special hai, normal data slot ki tarah behave nahi karta; user input se aaye to prototype tampering ka risk.\n3. Key coercion — sab keys `String(key)`. `obj[1]` aur `obj['1']` same. Har object key `'[object Object]'` ban jaati hai, to alag objects same slot pe likhte hain.\n4. No size — `Object.keys(obj).length` har baar naya array banata hai.\n5. Order — integer-jaisi keys pehle ascending sort hoti hain, phir string keys insertion order. `{ '2': x, '1': y }` iterate karne pe `1` pehle.\n\nMap in sab ko solve karta hai: `new Map()` ka koi prototype-key nahi, keys apne actual type mein rehti hain (number `1` !== string `'1'`, alag objects alag keys), `map.size` O(1) property hai, aur iteration strictly insertion order. Isi liye Map exist karta hai — 'object as map' ke pain points ka jawab.",
    followUp: "Object.create(null) kya karta hai aur kab woh Map ka acceptable substitute hai?",
  },
  {
    id: "aoms-3",
    question:
      "Ek feature mein tumhe list render karni hai, id se ek item nikaalna hai, aur 'yeh id selected hai kya' check karna hai. Kaunsa structure kahan?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Teeno alag structures: rendering ke liye Array (order + map to JSX), id-se-lookup ke liye ek Map `id -> item` (array se derive kiya, warna har lookup O(n) find), aur selection ke liye ek Set of selected ids (`selectedIds.has(id)` O(1)). Ek source of truth array rahe, Map aur Set usse derive hon.",
    detailedAnswer:
      "Source of truth: `items` array — order deterministic, `items.map(i => <Row key={i.id} />)`.\n\nLookup: agar tum `items.find(i => i.id === x)` baar-baar karte ho (har row me, har render) to woh O(n) per call. Ise ek Map me badlo: `const byId = useMemo(() => new Map(items.map(i => [i.id, i])), [items])`, phir `byId.get(x)` O(1).\n\nSelection: `const [selected, setSelected] = useState(() => new Set())`. Toggle: naya Set banao (immutability ke liye) — `const next = new Set(selected); next.has(id) ? next.delete(id) : next.add(id); setSelected(next)`. Check `selected.has(id)`. Array of selected ids lete to har check O(n).\n\nKey point: Array primary data ke liye, Map/Set derived performance-oriented views ke liye. Teeno ko alag-alag maintain mat karo as separate sources of truth — Map/Set ko array se rebuild karo jab array badle.",
    followUp: "Set ko React state me rakhne me kya dhyaan rakhna padta hai (reference equality)?",
  },
  {
    id: "aoms-4",
    question:
      "Map/Set ko localStorage me save karna hai. `JSON.stringify(myMap)` karte ho to kya hota hai aur sahi tarika kya hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`JSON.stringify(myMap)` `'{}'` deta hai — Map/Set ke paas apni enumerable own properties nahi jo stringify pick kare, to saara data silently gayab. Sahi: Map ko `Object.fromEntries(map)` (agar keys string hain) ya `[...map]` (entries array) me convert karo, Set ko `[...set]` me. Load pe `new Map(parsed)` / `new Set(parsed)`.",
    detailedAnswer:
      "```javascript\nconst m = new Map([['a', 1], ['b', 2]]);\nJSON.stringify(m);                      // '{}'  -- data gone\n\n// save\nlocalStorage.setItem('m', JSON.stringify([...m]));   // '[[\"a\",1],[\"b\",2]]'\n// load\nconst m2 = new Map(JSON.parse(localStorage.getItem('m')));\n\nconst s = new Set([1, 2, 3]);\nlocalStorage.setItem('s', JSON.stringify([...s]));   // '[1,2,3]'\nconst s2 = new Set(JSON.parse(localStorage.getItem('s')));\n```\n\n`[...map]` form non-string keys bhi preserve karta hai (agar woh khud JSON-serialisable hain). `Object.fromEntries(map)` sirf tab jab keys string/number hon aur tum object shape chahte ho. Advanced: `JSON.stringify(value, replacer)` me ek replacer function de ke Map ko `{ __type: 'Map', entries: [...] }` jaisa tag kar sakte ho, aur `JSON.parse(text, reviver)` se wapas bana sakte ho — libraries (superjson) yahi karti hain.",
    followUp: "structuredClone Map/Set ko handle karta hai — woh JSON se kaise alag hai?",
  },
  {
    id: "aoms-5",
    question: "Array vs Set performance — `includes` vs `has`. Kab farak matter karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`array.includes(x)` linear scan hai — O(n), worst case poora array. `set.has(x)` hash lookup hai — O(1) average. Ek-do check pe farak nahi, lekin bade array (hazaaron+ elements) pe ya loop ke andar repeated checks pe Set dramatically tez hai. Trade-off: Set banane me ek baar O(n) lagta hai aur thoda extra memory.",
    detailedAnswer:
      "`includes`/`indexOf` array ke start se element-by-element `===` (SameValueZero) compare karte hain. n elements, target end me ya absent -> n comparisons. Ek loop `for (const id of incoming) if (existing.includes(id))` -> O(n*m).\n\n`Set.prototype.has` internally hash table probe hai -> average O(1), independent of size. Pattern: `const existingSet = new Set(existing); for (const id of incoming) if (existingSet.has(id)) {...}` -> O(n + m).\n\nKab Set worth hai: (1) same array pe multiple membership checks, (2) array bada hai (rough thumb: 50-100+ elements aur repeated lookups), (3) dedup chahiye anyway. Kab nahi: array chhota hai aur ek hi baar check karna hai — `includes` simpler aur allocation-free. Note: object `obj[key] !== undefined` bhi O(1) lookup deta hai par string coercion / inherited keys ke risks Set/Map me nahi hain.",
    followUp: "Set banane ki O(n) cost ko kis point pe repeated O(n) includes calls justify kar deti hain?",
  },
];

export default questions;
