import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "twb-1",
    question: "Two-way binding kaise kaam karta hai? `[(ngModel)]` internally kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "`[(x)]=\"v\"` ek property binding `[x]=\"v\"` aur ek event binding `(xChange)=\"v = $event\"` ka shorthand hai — 'banana in a box'. `[(ngModel)]` isi rule ka use karta hai: `[ngModel]` value andar bhejta hai, `(ngModelChange)` user input par class update karta hai.",
    detailedAnswer:
      "Angular `[(foo)]` ko compile time par `[foo]` + `(fooChange)` me todta hai. `ngModel` directive (FormsModule se) ek `ngModel` input aur ek `ngModelChange` output provide karti hai, isliye native inputs par `[(ngModel)]` chalta hai. Koi 'magic' nahi — sirf naming convention `<name>Change`. Isliye kisi bhi custom input ko two-way banane ke liye `<name>Change` output chahiye, ya `model()` signal use karo jo dono generate kar deta hai.",
    followUp: "`[(ngModel)]` ke liye `FormsModule` kyun chahiye par `[(text)]` (aapka model input) ke liye nahi?",
  },
  {
    id: "twb-2",
    question: "`model()` signal function kya hai aur kab use karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`model<T>(initial)` ek writable signal input hai jo automatically ek `xChange` output bhi expose karta hai, taaki parent `[(x)]` use kar sake. Use tab jab aap ek reusable 'input-like' component bana rahe ho jiska value parent ke saath sync rahe (star rating, tag picker, search box).",
    detailedAnswer:
      "Child ke andar: `text = model<string>('')`, read `this.text()`, write `this.text.set(v)` / `this.text.update(fn)`. Parent: `<app-search-box [(text)]=\"query\" />` ya sirf one-way `[text]=\"query\"` ya sirf listen `(textChange)=\"...\"`. Pehle (v17.2 se pehle) yeh manually `@Input() text` + `@Output() textChange = new EventEmitter()` likhna padta tha aur setter me emit karna padta tha — `model()` us boilerplate ko ek line me deta hai, aur signal hone ki wajah se OnPush/computed ke saath naturally kaam karta hai.",
    followUp: "`input()` (read-only signal input) aur `model()` me kya farak hai?",
  },
  {
    id: "twb-3",
    question: "Team lead bolta hai 'poora Add Employee form `[(ngModel)]` se bana do, jaldi ho jaayega'. Aap kya kahoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Chhote transient state (filter, toggle) ke liye `ngModel` theek hai, par 12-field business form ke liye reactive forms behtar: per-control validity/dirty/touched, cross-field aur async validators, typed form value, aur testable form model. `ngModel` me yeh sab manual aur bikhra hota hai.",
    detailedAnswer:
      "Reactive forms (`FormGroup`/`FormControl` ya `FormBuilder`) explicit model dete hain — `form.get('email').errors`, `form.valid`, `form.value` (typed). Async email-uniqueness check, 'joinDate future me nahi', 'confirm salary' jaise rules structured tarike se lagte hain. `ngModel`-based template forms me har field ka state template refs se access karna padta hai, aur submit-time validation aggregation manual. Time-saving illusion hai: chhota form 10 min bachaata hai, bada form debugging me ghante khata hai.",
    followUp: "Kya ek hi form me reactive aur template-driven mix kar sakte ho? Karna chahiye?",
    redFlag: "'ngModel aur reactive forms basically same hain' — validation/state model bilkul alag hai.",
  },
  {
    id: "twb-4",
    question: "Two-way binding ka overuse kya problem create karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Data flow do-tarfa ho jaata hai, isliye trace karna mushkil ki koi value kisne aur kab badli. Debugging aur reasoning ke liye ek clear unidirectional flow (`[input]` neeche, `(output)` upar) aksar behtar hota hai.",
    detailedAnswer:
      "Agar har nested component `[(x)]` se apne parent ki state ko directly mutate kar sakta hai, to ek bug ('salary field random reset ho jaata hai') ke liye poore component tree ki har two-way binding suspect ban jaati hai. Unidirectional model me child sirf `(salaryChange)` event bhejta hai aur parent decide karta hai kya karna hai — ek jagah. Two-way theek hai chhoti, self-contained UI state ke liye (ek search box ka text). Business/domain state ke liye explicit events + ek owner.",
    followUp: "Signals ke saath 'state ka ek owner' pattern kaise enforce karoge ek feature area me?",
  },
  {
    id: "twb-5",
    question:
      "`<form>` ke andar `<input [(ngModel)]=\"email\">` likha par form value me `email` aata hi nahi. Kyun?",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`<form>` ke andar har `ngModel` control ko ek unique `name` attribute chahiye taaki wo `NgForm` me register ho. `name` missing hai to control form model me add nahi hota (aur console warning aata hai).",
    detailedAnswer:
      "Template-driven forms me `NgForm` child `NgModel` controls ko unke `name` se track karta hai — `<input name=\"email\" [(ngModel)]=\"email\">`. Bina `name` ke Angular error/warning deta hai: 'If ngModel is used within a form tag, either the name attribute must be set or the form control must be defined as standalone'. Alternative: `[ngModelOptions]=\"{ standalone: true }\"` agar aap chahte ho ki wo input form model ka hissa na ho.",
    followUp: "`ngForm` ka `#f=\"ngForm\"` template reference kis kaam aata hai submit ke waqt?",
  },
];

export default questions;
