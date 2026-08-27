import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lifecycle-hooks-1",
    question: "Component ke andar @ViewChild ka reference kab tak safely access nahi karna chahiye?",
    options: [
      "Constructor aur ngOnInit tak - ngAfterViewInit ke baad hi safe hai",
      "Sirf ngOnDestroy ke baad safe hai",
      "Ye hamesha turant available hota hai, koi timing issue nahi",
      "Sirf ngDoCheck ke andar hi access kar sakte ho",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - view (aur uske children) sirf ngAfterViewInit tak fully initialize hote hain, isliye ViewChild reference usse pehle undefined hota hai. Option B galat hai kyunki ngOnDestroy tak wait karne ka koi matlab nahi, view tab tak already destroy ho raha hota hai. Option C galat hai - ye ek bahut common gotcha hai exactly isliye ki reference turant available nahi hota. Option D galat hai kyunki ngDoCheck view init se pehle bhi chal sakta hai, guarantee nahi deta.",
    difficulty: "medium",
  },
  {
    id: "lifecycle-hooks-2",
    question: "ngOnChanges kab trigger nahi hoga, agar ek @Input property ek object hai?",
    options: [
      "Jab object ke andar ka koi property directly mutate kiya jaaye, reference same rakhte hue",
      "Jab bhi parent component naya object pass kare",
      "Jab component pehli baar create ho",
      "Jab object null se kisi value me change ho",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - ngOnChanges reference-based comparison karta hai, isliye deep/internal mutation (jaise obj.name = x) reference change nahi karta aur hook trigger nahi hota. Option B galat hai - naya object reference pass karna hi to trigger karta hai. Option C galat hai - pehli baar bhi ye fire hota hai (initial value ke saath). Option D galat hai - null se koi value hona bhi ek reference change hi hai, isliye trigger hoga.",
    difficulty: "hard",
  },
  {
    id: "lifecycle-hooks-3",
    question: "ngDoCheck ke baare me kaunsa statement sahi hai?",
    options: [
      "Ye har change detection cycle me chalta hai, isliye heavy operations isme nahi daalne chahiye",
      "Ye sirf component destroy hone se pehle ek baar chalta hai",
      "Ye sirf tab chalta hai jab @Input properties change hoti hain",
      "Ye ngOnInit se pehle sirf ek baar chalta hai",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - ngDoCheck custom change-detection logic ke liye har cycle me invoke hota hai, isliye expensive kaam usme performance problem create karta hai. Option B galat hai - wo ngOnDestroy ka behavior hai. Option C galat hai - wo ngOnChanges ka scope hai, ngDoCheck to har cycle me chalta hai chahe input change ho ya na ho. Option D galat hai - ngDoCheck baar baar chalta hai, ek baar nahi.",
    difficulty: "medium",
  },
  {
    id: "lifecycle-hooks-4",
    question: "Ek component me ngOnInit me ek Observable subscribe kiya gaya hai. Memory leak avoid karne ka sabse standard tareeka kya hai?",
    options: [
      "ngOnDestroy me subscription ko unsubscribe karna, ya takeUntil(destroy$) pattern use karna",
      "Subscription ko kabhi bhi unsubscribe karne ki zaroorat nahi hoti Angular me",
      "ngAfterViewInit me unsubscribe karna",
      "Component class me subscription store hi na karna",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - ngOnDestroy hi guaranteed cleanup point hai, aur multiple subscriptions ke liye takeUntil(destroy$) pattern standard practice hai. Option B galat hai - manual subscriptions cleanup na karne se memory leaks hote hain (async pipe alag case hai, wo khud handle karta hai). Option C galat hai - ngAfterViewInit component ke destroy hone se pehle bahut jald chalta hai, cleanup ke liye galat jagah hai. Option D galat hai - subscription ko reference store karna hi to unsubscribe karne ke liye zaroori hai.",
    difficulty: "easy",
  },
];

export default quiz;
