import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "lhcd-1",
    question: "Angular lifecycle hooks ko order me batao aur har ek ka typical use.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`constructor` (DI only) -> `ngOnChanges` (input change) -> `ngOnInit` (initial fetch/setup) -> `ngAfterContentInit` -> `ngAfterViewInit` (ViewChild/DOM ready) -> [running: ngDoCheck / ngAfterViewChecked per cycle] -> `ngOnDestroy` (cleanup).",
    detailedAnswer:
      "Roz kaam ke: `ngOnInit` — API call, form init, subscriptions. `ngOnChanges(changes: SimpleChanges)` — jab kisi `@Input` ki value badle, `previousValue`/`currentValue` mile. `ngAfterViewInit` — `@ViewChild` elements/components ab available, DOM measure ya 3rd-party lib init. `ngOnDestroy` — unsubscribe, `clearInterval`, event listeners hataao. `ngDoCheck`/`ngAfterViewChecked` bahut frequent hain, sparingly use. `constructor` me sirf `inject()` — koi logic nahi.",
    followUp: "Signal `input()` ke saath `ngOnChanges` kaam nahi karta — react karne ke liye kya use karoge?",
  },
  {
    id: "lhcd-2",
    question: "Change detection kaise kaam karta hai? zone.js ka role kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Angular ke paas bound template expressions ka record hai; CD cycle me wo unhe re-evaluate karke badle hue values ke liye DOM update karta hai. zone.js browser ke async APIs (events, timers, promises, XHR) ko monkey-patch karta hai aur unke complete hone par Angular ko CD chalane ka signal deta hai.",
    detailedAnswer:
      "Bina kisi trigger ke Angular ko nahi pata kab data badla ho sakta hai. zone.js is gap ko bharta hai — patched async task khatam hone par `ApplicationRef.tick()` chalta hai, jo root se poore tree ko check karta hai (Default strategy). Har component ke liye Angular expressions compare karta hai (`{{ }}`, `[x]`, `@if` conditions) aur mismatch par DOM node update. Ye 'dirty checking' hai. OnPush is tree-walk ko prune karta hai. Signals + zoneless me zone.js hat jaata hai aur signal reads/writes se hi Angular ko pata chalta hai kaunse views dirty hain.",
    followUp: "Agar aap `setTimeout` ko `NgZone.runOutsideAngular()` me chalao to kya hota hai?",
  },
  {
    id: "lhcd-3",
    question: "`ChangeDetectionStrategy.OnPush` kya karta hai aur kab lagaoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "OnPush component ko sirf tab dirty maanta hai jab uska `@Input` reference badle, uske andar event ho, consumed signal badle, `async` pipe emit kare, ya `markForCheck()` ho. Baaki cycles me wo aur uska subtree skip. Bade / list-heavy / frequently-re-rendered UIs me default choice.",
    detailedAnswer:
      "Faayda: ek CD cycle me Angular bahut se components ka kaam bacha leta hai. Cost: immutable data discipline — `@Input` objects/arrays ko mutate karne ke bajaye replace karna, ya signals use karna. Modern recommendation: har component OnPush + signals-first; is combination me OnPush 'automatically correct' rehta hai kyunki signal change hi trigger hai. Legacy mutation-heavy code ko OnPush me daalne se stale-view bugs aate hain — pehle state ko immutable/signals me refactor karo.",
    followUp: "`markForCheck()` aur `detectChanges()` me farak?",
    redFlag: "'OnPush lagane se component kabhi update nahi hoga' ya 'OnPush buggy hai' — problem mutation-based state hai, strategy nahi.",
  },
  {
    id: "lhcd-4",
    question:
      "'ExpressionChangedAfterItHasBeenCheckedError' kab aata hai aur kaise fix karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Dev mode me Angular CD ke baad ek verification pass chalata hai; agar us pass me koi bound value pehli pass se alag nikle to ye error. Aksar `ngAfterViewInit`/`ngAfterViewChecked` me state badalne se, ya child ke event handler me parent ki bound value sync badalne se.",
    detailedAnswer:
      "Angular ek CD cycle me expect karta hai ki values stable ho jayein. Common causes: (1) `ngAfterViewInit` me ek property set karna jo template me bound hai; (2) getter jo har call par naya object/random value deta hai; (3) child se `@Output` par parent state sync update jo abhi-check-hui value ko badal de. Fixes: value ko `ngOnInit` me set karo; getter ko memoize/computed-signal banao; deferred update ke liye `Promise.resolve().then(...)` / `queueMicrotask` / signal (jo agle cycle me settle hota hai). Ye error sirf dev mode me hai par real timing bug ka indicator hai.",
    followUp: "Ek getter jo `new Date()` return karta hai template me bind hai — is error se kaise bachoge?",
  },
  {
    id: "lhcd-5",
    question: "Signals change detection ko kaise badalte hain? 'Zoneless Angular' ka kya matlab hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Signal read hone par Angular record karta hai ki kaunsa view us signal par depend karta hai. Signal write hone par Angular sirf un dependent views ko dirty markta hai — poore tree ka dirty-check nahi. Zoneless matlab zone.js hatakar, CD ko purely signals (aur explicit triggers) se drive karna.",
    detailedAnswer:
      "Classic model: zone.js har async ke baad `tick()` -> poora tree check (OnPush se prune). Signal model: fine-grained dependency graph — `computed`/template signal reads track hote hain, aur ek signal update se sirf affected components schedule hote hain. Isse zone.js ki zaroorat khatam ho sakti hai (`provideZonelessChangeDetection()`), bundle chhota, aur CD precise. Migration path: OnPush + signals-first code aaj likho, wo zoneless me bina change ke behtar chalega. `async` pipe aur `toSignal()` observables ko is model me integrate karte hain.",
    followUp: "`effect()` ka is model me kya role hai, aur wo `computed()` se kaise alag hai?",
  },
];

export default questions;
