import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "comm-patterns-1",
    question: "Do sibling components jinka koi direct parent-child relationship nahi hai, unke beech data sync karne ka recommended Angular pattern kya hai?",
    options: [
      "@Input/@Output ki chain unke common ancestor ke through banana",
      "Ek shared, injected service (jaise providedIn: root) jo Subject ya BehaviorSubject expose kare, jisse dono components inject karke sync ho jaayein",
      "Dono components ko ek hi component me merge kar dena",
      "Global window object me data store karna",
    ],
    correctIndex: 1,
    explanation: "Unrelated components ke liye prop drilling (Input/Output chain through unrelated intermediates) impractical aur fragile hai. Standard Angular pattern ek shared, DI-injected service hai jo RxJS Subject/BehaviorSubject expose karta hai — dono components isi singleton ko subscribe/update karte hain.",
    difficulty: "medium",
  },
  {
    id: "comm-patterns-2",
    question: "`@ViewChild` reference `ngOnInit` me access karne pe `undefined` kyun aata hai?",
    options: [
      "@ViewChild sirf ContentChild ke saath kaam karta hai",
      "View us lifecycle stage tak fully initialize nahi hui hoti — @ViewChild references sirf ngAfterViewInit se available hote hain",
      "@ViewChild sirf structural directives ke saath kaam karta hai",
      "ngOnInit component destroy hone ke baad call hota hai",
    ],
    correctIndex: 1,
    explanation: "Angular lifecycle me ngOnInit view fully render hone se pehle chalta hai. @ViewChild reference tabhi populate hoti hai jab view initialize ho chuki ho, jo ngAfterViewInit hook ke time guaranteed hota hai — isliye ngOnInit me access karna undefined deta hai.",
    difficulty: "medium",
  },
  {
    id: "comm-patterns-3",
    question: "`@ViewChild` aur `@ContentChild` me kya farak hai?",
    options: [
      "Dono bilkul same hain, sirf naam alag hai",
      "ViewChild component ke apne template ke elements dhoondta hai; ContentChild parent se projected (ng-content) content ke andar dhoondta hai",
      "ViewChild sirf directives ke liye hai, ContentChild sirf components ke liye",
      "ContentChild sirf async data ke liye use hota hai",
    ],
    correctIndex: 1,
    explanation: "ViewChild component ki apni template me define kiye gaye elements/components ka reference deta hai. ContentChild un elements ka reference deta hai jo parent ne <ng-content> ke through component ke andar project kiye hain — dono alag sources se references nikaalte hain.",
    difficulty: "hard",
  },
  {
    id: "comm-patterns-4",
    question: "Ek generic `CardComponent` banate waqt jisme parent apna custom title aur body content daal sake, kaunsa mechanism use hota hai?",
    options: [
      "@Input se poora HTML string pass karna",
      "`<ng-content>` (optionally `select` ke saath named slots ke liye) jo parent-provided markup ko component ke template ke andar project karta hai",
      "@ViewChild se parent ka template access karna",
      "Ek shared service jo HTML string store kare",
    ],
    correctIndex: 1,
    explanation: "Content projection ke liye <ng-content> exact mechanism hai — parent jo bhi markup component tags ke beech likhta hai, wo <ng-content> ki jagah render ho jaata hai. select attribute specific projected elements ko named slots me route karta hai (jaise select='[card-title]').",
    difficulty: "easy",
  },
];

export default quiz;
