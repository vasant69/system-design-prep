import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "first-component-on-screen-1",
    question: "Ek Angular component minimum kis cheez se banta hai?",
    options: [
      "Sirf ek HTML file",
      "Ek TypeScript class jispe `@Component` decorator ho, jo selector + template (+ optional styles) link karta hai",
      "Ek JSON config file",
      "Ek function jo HTML string return karti hai",
    ],
    correctIndex: 1,
    explanation:
      "Component ek class hai + `@Component` decorator jo metadata deta hai (selector, template/templateUrl, styles). Option A galat — HTML component ka ek hissa hai, poora component nahi. Option C galat. Option D React-style function component hai, Angular ka model nahi.",
    difficulty: "easy",
  },
  {
    id: "first-component-on-screen-2",
    question: "`selector: \"app-employee-list\"` ka kya matlab hai?",
    options: [
      "Component ka file name `app-employee-list.ts` hoga",
      "Jahan bhi `<app-employee-list></app-employee-list>` tag likha jaayega (aur parent ne ise import kiya hai), wahan ye component render hoga",
      "Component sirf `/app-employee-list` route par dikhega",
      "CSS selector hai jo styling ke liye use hota hai",
    ],
    correctIndex: 1,
    explanation:
      "`selector` component ka custom HTML tag define karta hai; us tag ko kisi template me rakhne se component render hota hai (standalone me parent ke `imports` me hona chahiye). Option A galat — file name alag decision hai. Option C galat — routing `component` property se hoti hai, selector se nahi. Option D galat.",
    difficulty: "easy",
  },
  {
    id: "first-component-on-screen-3",
    question: "`@for (emp of employees; track emp.id) { ... }` me `track emp.id` kyun zaroori hai?",
    options: [
      "Ye sirf syntax formality hai, koi asar nahi",
      "Ye Angular ko batata hai har item ki identity — list badalne par wo DOM nodes reuse karta hai instead of sab dobara banane ke, jisse performance aur focus/scroll state bachta hai",
      "Ye list ko automatically sort kar deta hai `id` se",
      "Ye duplicate items hata deta hai",
    ],
    correctIndex: 1,
    explanation:
      "`track` expression se Angular items ko identity se match karta hai; jo item wahi hai uska DOM node reuse hota hai, sirf changed/added/removed handle hote hain. Bina track bade lists slow aur buggy (focus loss). Option A galat — real performance impact. Option C/D galat — track sort/dedupe nahi karta.",
    difficulty: "medium",
  },
  {
    id: "first-component-on-screen-4",
    question:
      "Standalone `App` ke template me `<app-site-header />` likha hai par header render nahi ho raha (ya error aata hai). Sabse likely kaaran?",
    options: [
      "`SiteHeader` ko `App` ke `@Component` `imports` array me add nahi kiya",
      "`SiteHeader` ka selector galat spelling me hai — hamesha",
      "`main.ts` me `SiteHeader` import karna bhool gaye",
      "Header components Angular me allowed nahi",
    ],
    correctIndex: 0,
    explanation:
      "Standalone model me parent component ko child ko apne `imports` me lena padta hai tabhi selector template me kaam karta hai. Option B ek possibility hai par 'hamesha' galat hai. Option C galat — `main.ts` sirf root boot karta hai. Option D galat.",
    difficulty: "medium",
  },
];

export default quiz;
