import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "bw-1",
    question: "Angular app boot hone ka poora order batao — index.html se pehli component render hone tak.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Browser `index.html` load karta hai (usme khaali `<app-root>`), bundle ka entry `main.ts` chalta hai, wo `bootstrapModule(AppModule)` call karta hai, Angular `AppModule` ka `bootstrap: [AppComponent]` padhta hai, `AppComponent` ka `selector` DOM me dhoondhta hai, class instance banata hai, aur template ko us tag ke andar render kar deta hai.",
    detailedAnswer:
      "Key connections: `index.html` ka tag `AppComponent` ke `selector` se exactly match hona chahiye; `main.ts` decide karta hai kaunsa root module; `AppModule.bootstrap` decide karta hai kaunsa root component. Standalone Angular me `AppModule` ki jagah `bootstrapApplication(AppComponent)` `main.ts` me directly aata hai — module wala step hat jaata hai.",
    followUp: "Agar `<app-root>` tag `index.html` me na ho to kya error milega?",
  },
  {
    id: "bw-2",
    question: "NgModule ke `declarations`, `imports`, aur `bootstrap` arrays me kya farak hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`declarations`: is module ke apne components/directives/pipes. `imports`: doosre modules jinki cheezein is module ko chahiye (jaise `BrowserModule`, `FormsModule`). `bootstrap`: sirf root module me — wo component jo app start hote hi mount hota hai.",
    detailedAnswer:
      "Ek component sirf ek `declarations` array me ho sakta hai. `bootstrap` me jo component hota hai wo `declarations` me bhi hona chahiye. Feature modules me `bootstrap` nahi hota — sirf `AppModule` me. Non-root components DOM me apne `selector` se use hote hain, `bootstrap` se nahi.",
  },
  {
    id: "bw-3",
    question: "Button click ke baad DOM update kaunse step par hota hai, aur use kaun trigger karta hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "`increment()` sirf `this.count` badalta hai — DOM ko haath nahi lagata. Method return hone ke baad Angular change detection chalata hai (Zone.js ne click ko patch kiya hua hai), har binding re-check hoti hai, aur `{{ count }}` ka text node badalta hai.",
    detailedAnswer:
      "Yani state change aur DOM update do alag steps hain. `count++` synchronous hai; DOM patch change-detection pass me hota hai jo Zone.js ke async-event hook se trigger hota hai. Isiliye `setTimeout` ya `Promise` ke andar state badalne par bhi UI update hota hai — Zone unko bhi patch karta hai. `NgZone.runOutsideAngular` me kiya change UI update nahi karega.",
    redFlag: "Ye kehna ki `{{ }}` binding 'automatically live' hai bina change detection ke — wo har pass par re-evaluate hoti hai.",
  },
];

export default questions;
