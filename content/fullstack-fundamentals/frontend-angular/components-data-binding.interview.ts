import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "cdb-1",
    question: "Angular ke chaar data binding types aur har ek ka direction samjhao.",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Interpolation `{{ x }}` aur property binding `[p]=\"x\"` class -> view. Event binding `(e)=\"f()\"` view -> class. Two-way `[(ngModel)]=\"x\"` dono: ye `[ngModel]` + `(ngModelChange)` hai.",
    detailedAnswer:
      "Interpolation text content bind karne ka shortcut hai. Property binding DOM property ya component `@Input` set karta hai. Event binding DOM event ya component `@Output` par subscribe karke template statement chalata hai, `$event` payload ke saath. Two-way pure sugar hai: `[(x)]` ka matlab `[x]` + `(xChange)`, isliye jo bhi component `x` input aur `xChange` output expose kare use two-way free me mil jaata hai.",
    followUp: "`[disabled]` aur `[attr.disabled]` me kya farak hai?",
  },
  {
    id: "cdb-2",
    question: "Interpolation ke andar method call, jaise `{{ getTotal() }}`, ko smell kyun maana jaata hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Method har change detection cycle par dobara chalta hai, sirf tab nahi jab uske inputs badle. Default change detection ke saath ye poore tree me per second dozens calls ho sakti hain.",
    detailedAnswer:
      "Angular kisi bhi function call ko memoize nahi kar sakta, isliye use maanna padta hai ki result badal sakta hai aur har tick par dobara call karna padta hai. Fixes, preference order me: value ek field me store karo aur inputs badalne par update karo; sirf sach me trivial ho to sasta getter; pure pipe (Angular argument identity se output cache karta hai); ya signal `computed()` jo sirf dependency badalne par recompute hota hai.",
    redFlag: "Ye bolna ki 'function chhota hai isliye theek hai' — cost call frequency hai, body nahi.",
  },
  {
    id: "cdb-3",
    question:
      "Template me `[(ngModel)]=\"name\"` hai par input class ko update hi nahi karta. Console me koi error nahi. Kya kaaran ho sakte hain?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "`FormsModule` standalone component (ya module) me import nahi hua, isliye `ngModel` ek unknown attribute jaisa treat hota hai; ya name clash / field shadow ho raha hai; ya element aisa form control nahi jise `ngModel` support karta hai.",
    detailedAnswer:
      "Sabse common kaaran missing `FormsModule` import hai — strict template checking me error milta hai, par loose settings me `ngModel` chupchaap no-op karta hai. Ye bhi check karo ki tum native input/select/textarea ya control-value-accessor component par bind kar rahe ho, aur kuch `name` ko har change detection pass par reset to nahi kar raha (jaise ek `@Input` jo baar-baar overwrite kare).",
  },
];

export default questions;
