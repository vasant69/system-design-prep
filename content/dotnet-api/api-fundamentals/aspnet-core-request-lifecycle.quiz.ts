import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "arl-1",
    question: "`builder.Services.AddScoped<IOrderService, OrderService>()` aur `app.UseAuthentication()` — inn dono ka fundamental difference kya hai?",
    options: [
      "Dono same hain, bas naming convention alag hai",
      "Pehla DI container me build-time registration hai (kuch execute nahi hota), doosra run-time middleware pipeline ka part hai jo har request pe chalta hai",
      "Pehla sirf Controllers ke liye hai, doosra Minimal APIs ke liye",
      "Pehla optional hai, doosra mandatory hai har app mein",
    ],
    correctIndex: 1,
    explanation:
      "`builder.Services.Add...()` calls sirf DI container ko batate hain 'ye service chahiye ho to aise banao' — ye build-time registration hai, `app.Build()` chalne tak kuch execute nahi hota. `app.Use...()` calls actual middleware pipeline banate hain jisse har incoming request guzarta hai. Option A galat hai — ye do fundamentally different phases hain. Option C galat hai, dono concepts Controllers aur Minimal APIs dono ke saath kaam karte hain. Option D bhi galat premise hai.",
    difficulty: "easy",
  },
  {
    id: "arl-2",
    question: "`UseAuthentication()` ko `UseAuthorization()` se PEHLE kyun likhna chahiye?",
    options: [
      "Sirf convention hai, order se koi functional fark nahi padta",
      "Authorization ko decide karne ke liye ek established user identity chahiye, jo authentication middleware set karta hai — ulta order karne par authorization hamesha anonymous user maanega",
      "Authentication middleware authorization middleware se performance mein fast hai",
      "ASP.NET Core compiler is order ko enforce karta hai, runtime error dega ulta likhne par",
    ],
    correctIndex: 1,
    explanation:
      "Authentication middleware `HttpContext.User` ko populate karta hai (identity establish karta hai). Authorization middleware isi `User` object ke basis pe decide karta hai ki access allowed hai ya nahi. Agar authorization pehle aa gaya, to identity abhi set hi nahi hui hogi, aur har request unauthenticated treat hogi. Option A galat hai — ye sirf convention nahi, functional dependency hai. Option C irrelevant hai. Option D galat hai — ye compile-time error nahi deta, silently galat behavior deta hai runtime pe.",
    difficulty: "medium",
  },
  {
    id: "arl-3",
    question: "Ek middleware `next()` ko call karta hai aur response wapas aane ke baad kuch code chalata hai. Response pipeline mein kis order mein wapas jaata hai?",
    options: [
      "Jis order mein middleware register hue the, wahi (forward) order mein",
      "Reverse order mein — jo middleware sabse baad mein register hua tha, uska 'after next()' code sabse pehle chalega",
      "Random order, guarantee nahi hai",
      "Response sirf last middleware ke through hi wapas jaata hai, baaki skip ho jaate hain",
    ],
    correctIndex: 1,
    explanation:
      "Middleware ek nested chain ki tarah kaam karta hai — request forward order mein jaata hai (A→B→C), aur response reverse order mein wapas aata hai (C→B→A). Isliye har middleware ka 'after next()' code un middlewares ke liye ek wrapping/unwrapping jaisa behave karta hai. Option A galat hai, ye forward-only nahi hai. Option C galat hai — order guaranteed aur deterministic hota hai. Option D galat hai, response har middleware se guzarta hai jab tak koi short-circuit na kare.",
    difficulty: "medium",
  },
  {
    id: "arl-4",
    question: "`UseExceptionHandler()` middleware ko pipeline ke bilkul shuru mein kyun rakha jaata hai?",
    options: [
      "Kyunki wo sabse fast middleware hota hai",
      "Kyunki ek middleware sirf apne 'neeche' (pipeline mein aage) hue exceptions catch kar sakta hai — sabse pehle rakhne se poori downstream pipeline cover ho jaati hai",
      "Kyunki ASP.NET Core isse alphabetically sort karta hai",
      "Isse koi fark nahi padta, kahin bhi rakh sakte hain",
    ],
    correctIndex: 1,
    explanation:
      "Exception handling middleware ek try-catch block ki tarah kaam karta hai apne se neeche (downstream) chal rahe pipeline ke around. Agar isse beech mein ya end mein rakha jaaye, to sirf usi ke neeche wale middleware/endpoints ke exceptions catch honge — upar wale middleware ke exceptions miss ho jaayenge. Option A aur C fabricated reasons hain. Option D galat hai — position directly functional correctness affect karta hai.",
    difficulty: "hard",
  },
];

export default quiz;
