import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "orw-1",
    question: "`this.data$ = this.service.getData()` likhne se HTTP call chal jaati hai? Kab chalti hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Nahi. `HttpClient` ki Observable cold hoti hai — assignment sirf Observable object banata hai. Actual HTTP request tab jaati hai jab koi subscribe kare: `async` pipe, `.subscribe()`, ya `firstValueFrom`. Zero subscribers = zero requests; do subscribers = do requests.",
    detailedAnswer:
      "Isiliye same `getData()` par do baar subscribe karke ek call expect mat karo — `shareReplay(1)` use karo agar multiple consumers ko ek hi response chahiye. Aur jis Observable ko tum ignore karte ho wo kuch nahi karti, jo Promise-based code se aane walon ko surprise karta hai jahan request turant fire hoti thi.",
    followUp: "Ek hi response ko do jagah dikhana hai bina do HTTP calls ke — kaise?",
  },
  {
    id: "orw-2",
    question: "`async` pipe subscription ke saath kya-kya sambhaal deta hai jo manual `.subscribe()` nahi?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`async` pipe: subscribe karti hai, har emitted value unwrap karti hai, `markForCheck()` se view re-render karwati hai, aur component destroy hone par khud `unsubscribe()` kar deti hai. Manual `.subscribe()` me ye teardown tumhe `ngOnDestroy` + `takeUntilDestroyed`/`Subscription` se khud karna padta hai.",
    detailedAnswer:
      "`async` pipe `OnPush` ke saath bhi seamlessly kaam karta hai kyunki wo `markForCheck()` khud call karta hai. Manual subscribe me `OnPush` component ko update karne ke liye `ChangeDetectorRef.markForCheck()` bhi manually chahiye. Isiliye default advice: jitna ho sake `async` pipe use karo, manual subscribe sirf tab jab side effect chahiye.",
  },
  {
    id: "orw-3",
    question: "Subscription leak kaunsi streams se hota hai, aur `HttpClient` calls kyun aksar theek hoti hain?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Jo streams kabhi complete nahi hoti wo leak karti hain: `interval`, `fromEvent`, router events, service ka `Subject`, form `valueChanges`. `HttpClient` ek value emit karke complete ho jaati hai, isliye uska subscription apne aap khatam ho jaata hai — manual unsubscribe technically zaroori nahi (chahe harmless ho).",
    detailedAnswer:
      "Phir bhi consistency ke liye har manual subscription ko `takeUntilDestroyed()` / `takeUntil(destroy$)` se cover karna acha pattern hai. Leaked subscription ka nuksaan sirf memory nahi — wo callbacks chalati rehti hai jo destroyed component ko touch karti hain, jisse duplicate calls aur navigation ke baad errors aate hain.",
  },
];

export default questions;
