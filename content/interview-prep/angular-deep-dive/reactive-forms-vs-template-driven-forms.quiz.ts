import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "reactive-forms-vs-template-driven-forms-1",
    question: "Password aur confirmPassword fields match karte hain ya nahi, ye validate karne ka sahi tareeka kya hai?",
    options: [
      "password FormControl pe ek validator lagao jo confirmPassword ki value check kare",
      "confirmPassword FormControl pe Validators.required lagao, itna kaafi hai",
      "FormGroup (dono controls ka parent) pe ek group-level custom validator lagao",
      "ngModel me #ref use karke dono fields ko directly compare karo template me",
    ],
    correctIndex: 2,
    explanation: "Ek individual FormControl ko doosre sibling control ki value ka access nahi hota, is liye cross-field validation FormGroup level pe lagani padti hai jaha validator function poore group ka value dekh sakta hai aur dono fields compare kar sakta hai.",
    difficulty: "medium",
  },
  {
    id: "reactive-forms-vs-template-driven-forms-2",
    question: "Reactive forms aur template-driven forms me source of truth kaha hota hai?",
    options: [
      "Dono me source of truth hamesha template me hota hai",
      "Reactive me component class me explicitly defined, template-driven me template se implicitly inferred",
      "Dono me source of truth hamesha component class me hota hai",
      "Reactive forms server pe form model store karte hain, template-driven browser me",
    ],
    correctIndex: 1,
    explanation: "Reactive forms me developer khud FormGroup/FormControl explicitly class me banata hai — template sirf usse bind karta hai. Template-driven forms me ngModel directives template me likhi jaati hain aur Angular unse background me form model infer karta hai.",
    difficulty: "easy",
  },
  {
    id: "reactive-forms-vs-template-driven-forms-3",
    question: "Async validator (jaise username-taken check) ke saath sabse common real-world problem kya hai agar debounce nahi lagaya jaye?",
    options: [
      "Async validator kabhi call hi nahi hoga",
      "Form submit hi nahi ho payega kabhi",
      "Har keystroke pe API call fire hoga, unnecessary server load aur flickering pending state",
      "Validators.email automatically disable ho jayega",
    ],
    correctIndex: 2,
    explanation: "Async validators by default har value change pe fire ho sakte hain, jiska matlab hai har keystroke pe ek API call — ye server pe load daalta hai aur UI me pending state flicker karta hai. `updateOn: blur` ya validator ke andar debounceTime use karke isse fix kiya jaata hai.",
    difficulty: "medium",
  },
  {
    id: "reactive-forms-vs-template-driven-forms-4",
    question: "Ek form jisme dynamically fields add/remove karne hain (jaise 'add another phone number' button), kaunsa approach behtar fit karta hai?",
    options: [
      "Template-driven forms, kyunki *ngFor se ngModel repeat kiya ja sakta hai",
      "Reactive forms with FormArray, kyunki structure ko runtime pe programmatically modify kiya ja sakta hai",
      "Dono equally theek hain, koi difference nahi",
      "Iske liye Angular forms use hi nahi karne chahiye, plain HTML forms use karo",
    ],
    correctIndex: 1,
    explanation: "Reactive forms ka FormArray exactly is use-case ke liye bana hai — runtime pe controls push/remove karna component class se trivial hai. Template-driven forms me ye kaafi awkward ho jaata hai kyunki form structure implicitly template se derive hota hai, dynamic manipulation clean nahi rehti.",
    difficulty: "medium",
  },
];

export default quiz;
