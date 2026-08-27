import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "perf-opt-1",
    question: "trackBy function *ngFor ke saath use karne ka primary fayda kya hai?",
    options: [
      "Angular sirf actually changed items ko DOM me update karta hai, poori list destroy-recreate nahi hoti",
      "Ye list ko automatically sort kar deta hai",
      "Ye HTTP calls ki number kam karta hai",
      "Ye array ko immutable bana deta hai",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - trackBy Angular ko items uniquely identify karne deta hai (jaise id se), isliye sirf changed items DOM me update hote hain, unchanged DOM nodes reuse hote hain. Option B galat hai - trackBy sorting se koi lena dena nahi rakhta. Option C galat hai - ye purely rendering/DOM concern hai, HTTP se related nahi. Option D galat hai - trackBy khud array ko immutable nahi banata, wo ek separate concern hai.",
    difficulty: "easy",
  },
  {
    id: "perf-opt-2",
    question: "OnPush change detection strategy use karte waqt kaunsi practice zaroori ho jaati hai?",
    options: [
      "Input data ko immutable tareeke se update karna (naya reference banake), directly mutate nahi karna",
      "Har component me ngDoCheck implement karna zaroori ho jaata hai",
      "async pipe use karna completely band karna padta hai",
      "trackBy use karna forbidden ho jaata hai",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - OnPush sirf Input reference change pe recheck karta hai, isliye agar object directly mutate kiya (same reference) to Angular ko pata hi nahi chalega, isliye immutable updates zaroori hain. Option B galat hai - ngDoCheck OnPush ke liye zaroori nahi, balki OnPush aksar ngDoCheck jaisi custom checking ki zaroorat hi kam kar deta hai. Option C galat hai - async pipe OnPush ke saath perfectly compatible hai, balki ye ek common combination hai. Option D galat hai - trackBy aur OnPush independent optimizations hain, dono saath use ho sakte hain.",
    difficulty: "medium",
  },
  {
    id: "perf-opt-3",
    question: "10,000 items ki ek list smooth scroll ke saath render karni hai. Sabse appropriate solution kya hai?",
    options: [
      "Angular CDK ka virtual scrolling use karna, taaki sirf visible items hi DOM me render hon",
      "Sirf OnPush strategy laga dena kaafi hai, DOM node count apne aap kam ho jaayega",
      "trackBy hata dena taaki Angular fresh render kare",
      "Poori list ko ek single string me convert karke innerHTML se render karna",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - virtual scrolling exactly is problem ke liye design hua hai, sirf viewport me visible items render karta hai chahe total count kitna bhi ho. Option B galat hai - OnPush change detection ko optimize karta hai, lekin agar list already fully DOM me render hui hai to DOM node count wahi rehta hai, ye us problem ko solve nahi karta. Option C galat hai - trackBy hatane se performance aur bhi kharab hogi, behtar hoga add karna. Option D galat hai - innerHTML se render karna Angular ke data-binding aur security features (sanitization) ko bypass kar deta hai, ye recommended approach nahi hai.",
    difficulty: "medium",
  },
  {
    id: "perf-opt-4",
    question: "Template me `{{ getFilteredUsers() }}` jaisa function call likhna kyun problematic hai?",
    options: [
      "Ye function har change detection cycle me dobara call hota hai, chahe result change hua ho ya nahi",
      "Angular templates me function calls syntactically allowed hi nahi hain",
      "Ye sirf ek baar component create hone pe call hota hai, isliye stale data dikhata hai",
      "Ye TypeScript compile error deta hai",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - template expressions har change detection cycle me re-evaluate hote hain, isliye heavy function repeatedly chalta hai, jo real performance issue create karta hai. Option B galat hai - ye syntactically valid hai, isliye hi ye ek real-world trap hai jo build errors nahi deta. Option C galat hai - ulta sach hai, ye bahut baar call hota hai, ek baar nahi. Option D galat hai - ye ek valid TypeScript/Angular pattern hai jo compile ho jaata hai, problem sirf runtime performance ki hai.",
    difficulty: "medium",
  },
];

export default quiz;
