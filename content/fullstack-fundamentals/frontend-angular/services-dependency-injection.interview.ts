import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sdi-1",
    question: "Dependency injection asal me kaunsa problem solve karta hai? Ek concrete before/after do.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ye collaborators banane ki zimmedari use karne wali class se hata deta hai. Before: component `new HttpUserService()` karta hai aur ab us class se chipka hua hai. After: wo `private users: UserService` declare karta hai aur Angular instance deta hai — production me real, tests me mock, singleton ya fresh copy provider location ke hisaab se.",
    detailedAnswer:
      "DI teen cheezein deta hai: substitutability (`useClass`/`useValue` se implementation swap, consumers ko chhue bina), lifetime control (root par ek shared instance, ya per component subtree isolated instances), aur testability (fakes bina code change ke). Cost ek injector hierarchy hai jo samajhni padti hai, kyunki child component ka provider ancestor ke same token ko shadow karta hai.",
    followUp: "Jab component kisi token ki request karta hai to Angular provider kahan dhundhta hai?",
  },
  {
    id: "sdi-2",
    question:
      "Do components same service inject karte hain par har ek ki apni state hai aur sync nahi hoti. Sabse likely kaaran?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Service kisi ek ya dono component (ya shared parent) ke `providers` array me listed hai, isliye Angular per component instance ke liye naya instance banata hai, root singleton share nahi karta.",
    detailedAnswer:
      "`providedIn: 'root'` app-wide ek instance deta hai. Component par `providers: [X]` entry us component aur children ke liye fresh `X` banati hai, root wale ko shadow karti hai. Share karne ke liye component-level provider hatao, ya jaan-boojh kar rakho jab per-instance isolation chahiye (wizard, data-grid row editor). Ye bahut common 'state share kyun nahi ho rahi' bug hai.",
    redFlag: "Providers arrays check kiye bina change detection ya signals ko blame karna.",
  },
  {
    id: "sdi-3",
    question: "Kya `providedIn: 'root'` service app start hote hi ban jaati hai? Kab destroy hoti hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. Wo pehli injection par lazily banti hai, aur agar kabhi inject na ho to class bundle se tree-shake ho jaati hai. Root service poore application session ke liye zinda rehti hai aur practically kabhi destroy nahi hoti.",
    detailedAnswer:
      "Lazy construction isiliye `providedIn: 'root'` module ke `providers` me register karne se better hai — unused services ka koi cost nahi. Kyunki root services destroy nahi hoti, unke andar banaye gaye subscriptions aur timers ka dhyaan rakho; wo apne aap clean nahi honge jaise component ke `ngOnDestroy` par hote.",
  },
];

export default questions;
