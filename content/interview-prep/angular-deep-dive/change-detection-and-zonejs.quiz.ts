import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "change-detection-and-zonejs-1",
    question: "Ek OnPush component ka @Input array hai. Parent component `this.items.push(newItem)` karta hai. Kya child component update hoga?",
    options: [
      "Haan, kyunki array me naya item add hua hai",
      "Nahi, kyunki push() array ko mutate karta hai lekin reference same rehta hai, jo OnPush detect nahi karta",
      "Haan, lekin sirf agar async pipe use ho raha ho",
      "Nahi, OnPush components kabhi array inputs accept nahi karte",
    ],
    correctIndex: 1,
    explanation: "OnPush strategy @Input ki reference equality check karta hai. push() array ko mutate karta hai — same array object, sirf uske andar ek item add hua — is liye reference change nahi hua aur OnPush component ko trigger nahi milega. Fix: `this.items = [...this.items, newItem]` se naya reference banao.",
    difficulty: "hard",
  },
  {
    id: "change-detection-and-zonejs-2",
    question: "zone.js Angular ke change detection ko trigger karne ke liye kya karta hai?",
    options: [
      "Ye component templates ko compile time pe optimize karta hai",
      "Ye browser ke async APIs (setTimeout, events, Promises, HTTP) ko monkey-patch karta hai aur unke complete hone pe Angular ko notify karta hai",
      "Ye virtual DOM banake real DOM se diff karta hai",
      "Ye sirf HTTP requests ko intercept karta hai, baaki async APIs ko nahi",
    ],
    correctIndex: 1,
    explanation: "zone.js ka core kaam hai browser ke almost saare async APIs ko patch karna taaki jab bhi koi async operation complete ho (click, timeout, promise resolve, HTTP response), Angular ko pata chal jaye ki 'kuch hua hai, change detection chalao.' Angular virtual DOM use nahi karta — ye direct real-DOM comparison karta hai.",
    difficulty: "medium",
  },
  {
    id: "change-detection-and-zonejs-3",
    question: "OnPush strategy wala component kin situations me re-check hota hai?",
    options: [
      "Sirf jab poora app reload ho",
      "@Input reference change, component ke andar se fire hua event, ya async pipe ka naya emission — in teen situations me",
      "Sirf jab HTTP request complete ho",
      "Har setTimeout call pe, chahe kahin bhi ho",
    ],
    correctIndex: 1,
    explanation: "OnPush teen specific triggers pe hi re-check hota hai: naya @Input reference aana, component ke apne template se koi event fire hona, ya us component me async pipe ka naya value emit hona. Inke alawa agar parent ya sibling me kuch change hota hai (bina reference change ke), OnPush component skip ho jaata hai.",
    difficulty: "medium",
  },
  {
    id: "change-detection-and-zonejs-4",
    question: "Zoneless Angular (provideZonelessChangeDetection) zone.js ke coarse-grained approach ka replacement kis mechanism se karta hai?",
    options: [
      "Har component ko manually change detection trigger karna padta hai developer ko",
      "Signals ke through fine-grained reactivity — sirf wahi component update hota hai jo changed signal ko directly read karta hai",
      "Ye poori tarah change detection hi hata deta hai, UI kabhi update nahi hota",
      "Ye virtual DOM introduce karta hai jaise React",
    ],
    correctIndex: 1,
    explanation: "Zoneless mode signals pe rely karta hai fine-grained tracking ke liye — jab ek signal update hota hai, Angular exactly wahi components ko re-render karta hai jo us signal ko consume kar rahe hain, poore tree ko traverse kiye bina, jo zone.js ke 'kuch bhi hua to sab check karo' approach se bahut zyada precise hai.",
    difficulty: "hard",
  },
];

export default quiz;
