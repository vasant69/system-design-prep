import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sdw-1",
    question: "Angular ko kaise pata chalta hai ki constructor me kaunsa service inject karna hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Constructor parameter ke **type** se. `constructor(private c: CounterService)` me `CounterService` ek DI token ki tarah kaam karta hai. Angular current injector se us token ka instance maangta hai; nahi mila to error, mila to inject kar deta hai. (TypeScript metadata / `@Injectable` isko possible banate hain.)",
    detailedAnswer:
      "Injector ek key-value registry hai: token -> factory. `providedIn: 'root'` ya `providers` array registration karte hain. Pehli maang par factory chalti hai (`new`), instance cache hota hai, aage har maang wahi cached instance deti hai — isiliye service singleton (us injector ke scope me) hota hai. Non-class values ke liye `InjectionToken` use hota hai.",
    followUp: "Do components same service inject karein par alag instance chahiye — kaise?",
  },
  {
    id: "sdw-2",
    question: "`providedIn: 'root'` vs component ke `providers: [X]` array — instance sharing par kya asar?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`providedIn: 'root'`: poore app me ek instance, sab components share karte hain. Component `providers: [X]`: us component (aur uske children) ke liye alag naya instance, jo root wale ko shadow karta hai — bahar wale components use nahi dekhte.",
    detailedAnswer:
      "Ye 'siblings state share kyun nahi kar rahe' bug ka sabse common kaaran hai. Jaan-boojh kar per-instance isolation chahiye (wizard, ek editable table row) to component-level provider sahi hai; app-wide shared state chahiye to `providedIn: 'root'`. Injector hierarchy: root -> route -> component; sabse paas wala jeetta hai.",
    redFlag: "Har component me `providers: [SharedService]` daal dena 'safe' samajh kar — har jagah alag instance ban jaata hai.",
  },
  {
    id: "sdw-3",
    question: "`providedIn: 'root'` service app start hote hi ban jaati hai kya?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Registration boot par hota hai, par instance pehli injection par lazily banta hai. Agar kabhi inject na ho to class bundle se tree-shake bhi ho jaati hai. Ek baar bana to app session bhar zinda rehta hai.",
    detailedAnswer:
      "Isiliye `providedIn: 'root'` ko module `providers` me register karne se prefer kiya jaata hai — unused services ka koi runtime cost nahi. Root services `ngOnDestroy` nahi paate (component jaisa), isliye unke andar banaye subscriptions/timers manually clean karne padte hain.",
  },
];

export default questions;
