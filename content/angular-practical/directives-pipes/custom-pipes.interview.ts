import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cp-1",
    question: "Custom pipe kaise banate ho? Ek example.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`@Pipe({ name: 'fullName' })` class jo `PipeTransform` implement kare aur `transform(value, ...args)` de. Standalone — component ke `imports` me add.",
    detailedAnswer:
      "```ts\n@Pipe({ name: 'truncate' })\nexport class TruncatePipe implements PipeTransform {\n  transform(value: string, limit = 50, trail = '…'): string {\n    return value?.length > limit ? value.slice(0, limit) + trail : (value ?? '');\n  }\n}\n```\nUse: `{{ bio | truncate:80 }}`. `transform` ka pehla param piped value, baaki template ke `:args`. Null-safety andar handle karo. Pipe ko pure function rakho — koi side effect nahi.",
    followUp: "Pipe ka unit test kaisa dikhta hai?",
  },
  {
    id: "cp-2",
    question: "Pure aur impure pipe — deeply samjhao. Impure kab genuinely chahiye?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Pure (default): Angular `transform` sirf tab call karta hai jab input/args ki identity badle; warna cached output — change detection me practically free. Impure (`pure: false`): har CD cycle me `transform`. Genuinely chahiye jab output input identity ke bahar kisi cheez par depend kare — `async` pipe (naye emissions), ya ek pipe jo ek mutable collection ko observe karta hai.",
    detailedAnswer:
      "Pure pipe ka memoization single previous input par hota hai (last value/args). Impure pipe ko Angular har cycle me chalata hai kyunki wo maan leta hai output kabhi bhi badal sakta hai. Cost: agar wo pipe 100 rows me hai aur screen busy hai, `transform` hazaaron baar/sec. Isliye impure sirf tab jab (a) work trivial ho, ya (b) koi alternative na ho. `async` pipe impure hai par internally efficient — wo naye emission par hi naya value emit karta hai. 'Mujhe impure chahiye kyunki array update nahi dikh raha' ka sahi jawab: immutable updates ya `computed()`.",
    followUp: "`async` pipe ko Angular kaise pata chalta hai ki naya value aaya bina har cycle me kuch expensive kiye?",
  },
  {
    id: "cp-3",
    question:
      "Team ne ek `filter` aur ek `orderBy` pipe banaya hai (AngularJS ki tarah). Aap review me kya bologe?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "AngularJS me `filter`/`orderBy` built-in the, par Angular (2+) ne unhe deliberately hataya — perf aur predictability ke liye. Pure banao to list mutations miss; impure banao to har CD cycle me O(n log n). Sahi: filtering/sorting component `computed()` signals me, ya server-side.",
    detailedAnswer:
      "Suggest: `filteredEmployees = computed(() => this.employees().filter(e => e.name.includes(this.term())).sort(...))`. Faayde: (1) sirf tab recompute jab `employees` ya `term` badle; (2) test karna easy; (3) template saaf. Bade datasets (1000+ rows) par ye bhi client par mat karo — `GET /employees?search=&sort=` se server handle kare aur paginated result do. Pipes single-value formatting ke liye reserve karo.",
    followUp: "`computed()` aur ek getter jo filter karta hai — dono me kya farak, kaunsa behtar?",
    redFlag: "'AngularJS me chalta tha to yahan bhi impure pipe se kar dete hain' — framework ne isko intentionally remove kiya.",
  },
  {
    id: "cp-4",
    question: "Pipe aur `computed()` signal (ya getter) — kab kaunsa?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Pipe: reusable, display-only, pure-function-of-inputs transform jo kai components me chahiye (`date`, `fileSize`, `initials`). `computed()`/getter: component-specific derived state, ya jab transform component ke multiple signals par depend karta ho, ya jab list filtering/sorting ho.",
    detailedAnswer:
      "Pipe ka strength: cross-component reuse aur template composability (`| a | b`). Weakness: sirf apne direct inputs dekhta hai, aur pure memoization single-input hota hai. `computed()` ka strength: kai signals par depend kar sakta hai, fine-grained recompute, aur component ki private logic. Rule: 'yeh transform 3 screens par same chahiye aur ek value leta hai' -> pipe. 'Yeh is component ki derived state hai, ya multi-input, ya list op' -> `computed()`.",
    followUp: "Ek pipe ko `inject()` se ek service use karne dena — ye kab acceptable hai?",
  },
  {
    id: "cp-5",
    question: "Ek pure pipe ka `@Input` object mutate hone par output update nahi hota. Explain aur options.",
    type: "code-output",
    difficulty: "advanced",
    shortAnswer:
      "Pure pipe input **reference** par memoize karta hai. `obj.prop = x` reference nahi badalta, isliye Angular `transform` skip kar deta hai aur purana cached output dikhta hai. Options: (1) immutable update (`obj = { ...obj, prop: x }`), (2) input ko signal banao, (3) last resort: pipe ko impure (perf cost).",
    detailedAnswer:
      "Ye same trap OnPush components me bhi hai — Angular reference equality par bharosa karta hai. Best practice: state ko immutable treat karo — arrays/objects replace karo, mutate nahi. Signals is problem ko structurally solve karte hain kyunki `.set()`/`.update()` explicit change notify karta hai. Impure pipe 'kaam karega' par har CD cycle me chalkar, jo bade lists me bahut mehnga. Isliye immutable/signals pehli choice.",
    followUp: "Immutable updates ko enforce karne ke liye tooling (readonly types, lint rules) kya use karoge?",
  },
];

export default questions;
