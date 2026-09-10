import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cc-1",
    question: "Parent aur child component Angular me kaise communicate karte hain, aur us mechanism ki limits kya hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`@Input` parent se child data pass karta hai template binding se; `@Output` (ek `EventEmitter`) child ko parent ko events batane deta hai. Ye sirf direct parent/child jodi ke liye hai — siblings ya door ke components ke liye shared service chahiye.",
    detailedAnswer:
      "Contract jaan-boojh kar narrow hai: parent `[x]` bind karta hai aur `(y)` par sunta hai, child `@Input() x` aur `@Output() y` declare karta hai. Har direction me data one-way, aur child parent ko kabhi likhta nahi. Sibling-to-sibling ya app-wide state ke liye ya to state ko common ancestor tak lift karo, ya `providedIn: 'root'` service inject karo jo `Subject`/`BehaviorSubject` ya signals expose kare.",
    followUp: "Deeply nested child se grandparent tak data kaise bhejoge bina har level me prop-drill kiye?",
  },
  {
    id: "cc-2",
    question: "Child ko `@Input() user` milta hai aur wo `this.user.name = 'X'` karta hai. Isme kya galat hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Ye shared reference se parent ka object mutate karta hai. One-way data flow toot jaata hai, `ngOnChanges` fire nahi hoga, aur `OnPush` parent re-render nahi ho sakta. Child ko event emit karna chahiye aur parent apni state update kare.",
    detailedAnswer:
      "`@Input` reference deta hai, copy nahi. Use mutate karne ka matlab source of truth badla par owner ko pata nahi — bugs trace karna impossible. Sahi pattern: `@Output() userChange` (ya specific event jaise `nameEdited`) jise parent apna model update karke handle kare, ideally immutably.",
    redFlag: "Ye bolna ki 'screen par to chalta hai' — wo accident se chalta hai aur OnPush ya shared object par fail hota hai.",
  },
  {
    id: "cc-3",
    question: "Custom component par `[(value)]` two-way binding under the hood kaise kaam karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`[(value)]=\"x\"` ban jaata hai `[value]=\"x\" (valueChange)=\"x = $event\"`. Component ko ek `@Input() value` aur ek `@Output() valueChange` chahiye jiska naam exactly input naam + `Change` ho.",
    detailedAnswer:
      "Koi special two-way machinery nahi hai — ye do one-way bindings hain jo compiler tumhare liye likh deta hai. Isiliye naming convention strict hai: output `<inputName>Change` hona chahiye. `ngModel` bhi internally yahi rule follow karta hai (`ngModel` / `ngModelChange`). Ye samajh kar tum apne two-way-bindable controls bana sakte ho bina full ControlValueAccessor ke, jab tumhe complete forms integration nahi chahiye.",
  },
];

export default questions;
