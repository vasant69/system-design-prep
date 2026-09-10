import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cdl-1",
    question: "Default me Angular me change detection kis cheez se trigger hota hai, aur OnPush use kaise narrow karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Default me Zone.js async APIs (events, timers, XHR) ko patch karta hai aur har ek ke baad Angular root se neeche CD chalata hai, har binding re-check karta hai. OnPush component ko sirf tab check karta hai jab: input reference badle, event component ke andar se aaye, use kiya hua `async` pipe / signal emit kare, ya explicit `markForCheck()`.",
    detailedAnswer:
      "Default CD sahi hai par wasteful — kisi bhi async activity par poora tree re-evaluate. OnPush Angular ko un subtrees ko skip karne deta hai jinke inputs (reference se) nahi badle aur jahan andar kuch fire nahi hua. Isiliye OnPush ke saath immutability matter karti hai: object replace karne se reference badalta hai aur component re-check hota hai; mutate karne se nahi. Signals aur aage jaate hain, sirf un specific views ko mark karte hain jo badla hua signal read karte hain.",
    followUp: "`async` pipe OnPush ke saath seamlessly kyun kaam karta hai par manual `.subscribe()` aksar nahi?",
  },
  {
    id: "cdl-2",
    question: "Constructor vs ngOnInit — practical farak kya hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "Constructor tab chalta hai jab class instantiate hoti hai, Angular ke `@Input` bindings set karne se pehle. `ngOnInit` pehle `ngOnChanges` ke baad ek baar chalta hai, jab inputs available hote hain. DI constructor me karo; input-dependent setup `ngOnInit` me.",
    detailedAnswer:
      "Agar tum constructor me `this.userId` read karo wo `undefined` hoga; `ngOnInit` me wo set hai. Constructors ko field/dependency assignment tak rakho. Constructor me HTTP calls bhi avoid karo — wo class ko test karna mushkil banate hain aur component ready hone se pehle fire ho sakte hain.",
  },
  {
    id: "cdl-3",
    question: "Ek child jisme @Input() config hai, parent ke config 'badalne' ke baad bhi stale data dikhata hai. ngOnChanges kabhi fire nahi hota. Kyun?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Parent ne naya object assign karne ke bajaye existing `config` object mutate kiya (`this.config.x = 1`). `ngOnChanges` sirf tab fire hota hai jab bound input **reference** badle, isliye Angular wahi object dekhta hai aur skip karta hai — aur OnPush ke under child re-check bhi nahi hota.",
    detailedAnswer:
      "Fix: parent me inputs ko immutable treat karo: `this.config = { ...this.config, x: 1 }`. Phir `ngOnChanges` `previousValue`/`currentValue` ke saath fire hota hai aur OnPush re-check karta hai. Agar mutate karna zaroori hai to `markForCheck()` call karo aur value getter se read karo — par immutability cleaner contract hai aur yahi OnPush assume karta hai.",
    redFlag: "Updates force karne ke liye `ngDoCheck` me manual deep comparison add karna — expensive aur signal ki data flow galat hai.",
  },
];

export default questions;
