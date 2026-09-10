import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "pcw-1",
    question: "Parent-child wiring me `[name]=\"fruit\"` aur `name=\"fruit\"` me kya farak hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer:
      "`[name]=\"fruit\"` property binding hai — Angular `fruit` ko ek expression ki tarah evaluate karke uski value child ke `@Input() name` me daalta hai. `name=\"fruit\"` plain HTML attribute hai — child ko literal string `\"fruit\"` milta hai, tumhari variable ki value nahi.",
    detailedAnswer:
      "Square brackets Angular ko batate hain 'right side ek TypeScript expression hai, static text nahi'. `[name]=\"'fruit'\"` (andar quotes) se bhi literal string bhej sakte ho. Numbers, booleans, objects hamesha `[ ]` se — `disabled=\"false\"` actually truthy string hota hai, `[disabled]=\"false\"` sahi boolean.",
    followUp: "`[name]=\"fruit\"` aur `[name]=\"'fruit'\"` me kya antar hai?",
  },
  {
    id: "pcw-2",
    question: "Child `@Input` object ko mutate karta hai vs parent ko event emit karta hai — kaunsa sahi aur kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Event emit karo. `@Input` ek reference deta hai; child use mutate kare to parent ka data chupke se badalta hai, one-way flow toot ta hai, `OnPush` parent re-render nahi hota, aur 'kisne badla' trace karna namumkin. Sahi: `@Output() xChange` emit karo, parent apni state update kare.",
    detailedAnswer:
      "Angular ka data-flow contract: data neeche (`@Input`), notifications upar (`@Output`). State ka owner parent hai. Child sirf 'ye hua' batata hai. Immutable update (naya array/object) parent me karo taaki change detection aur `OnPush` reliably kaam karein.",
    redFlag: "Child se `this.item.done = true` karke 'kaam kar raha hai' bolna — OnPush ya shared reference par toot jaata hai.",
  },
  {
    id: "pcw-3",
    question: "`(remove)=\"handleRemove($event)\"` me `$event` kya hota hai — DOM event ya kuch aur?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Custom `@Output` par `$event` wahi value hai jo child ne `this.remove.emit(payload)` me pass ki — yahan `this.name` string. Sirf native DOM events par (`(click)`, `(input)`) `$event` asli DOM event object hota hai.",
    detailedAnswer:
      "`EventEmitter<string>` ka generic type payload ka type hai. Parent handler `handleRemove(name: string)` usi type ko receive karta hai. Common galti: custom output handler me `$event.target.value` access karna — wahan `target` nahi hota, `$event` seedhe payload hai.",
  },
];

export default questions;
