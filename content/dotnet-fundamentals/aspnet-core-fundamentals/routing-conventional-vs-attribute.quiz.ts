import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "routing-1",
    question: "`[Route(\"api/[controller]\")]` ek `OrdersController` class ke upar likha hai. Actual URL kya banega?",
    options: [
      "api/[controller] — literally, koi substitution nahi hoti",
      "api/OrdersController — full class name use hota hai",
      "api/Orders — 'Controller' suffix hata kar class naam substitute hota hai",
      "Compile error, [controller] ek invalid token hai",
    ],
    correctIndex: 2,
    explanation:
      "`[controller]` ek special token hai jo runtime pe controller class ke naam se `Controller` suffix hata kar substitute hota hai. `OrdersController` se `Orders` milta hai, isliye final route `api/Orders` banta hai. Options A, B, D sab is substitution mechanism ko galat samajhte hain.",
    difficulty: "easy",
  },
  {
    id: "routing-2",
    question: "Route template `{id:int}` ka kaam kya hai?",
    options: [
      "Ye business validation karta hai ki id database me exist karta hai ya nahi",
      "Ye sirf routing-match-time filtering hai — malformed (non-integer) URL segments ko is route se match hone se rokta hai",
      "Ye id parameter ko automatically database se fetch kar leta hai",
      "Ye koi effect nahi rakhta, sirf documentation ke liye hai",
    ],
    correctIndex: 1,
    explanation:
      "Route constraints jaise `:int` sirf URL-shape ko filter karte hain — agar segment integer format me nahi hai, ye route match hi nahi hota. Ye business-level validation (jaise 'id exists in DB') nahi karta — wo action method ke andar honi chahiye. Options A, C, D constraint ka actual scope galat samajhte hain.",
    difficulty: "medium",
  },
  {
    id: "routing-3",
    question: "Is site jaisi Web-API-only project me conventional routing (`MapControllerRoute` with `{controller}/{action}/{id}`) kitna common hai, aur kyun?",
    options: [
      "Bahut common hai — ye Web APIs ka default routing style hai",
      "Rarely used hai — ye historically Razor-view MVC apps ke liye tha, RESTful resource URLs is pattern me naturally fit nahi hote",
      "Ye deprecated hai aur ab compile hi nahi hoga",
      "Ye sirf Minimal APIs ke saath use hota hai, controllers ke saath nahi",
    ],
    correctIndex: 1,
    explanation:
      "Conventional routing historically MVC-view apps (human-readable page URLs jaise /Products/Details/5) ke liye design hua tha. Web API projects RESTful, resource-oriented URLs chahte hain jo is generic pattern me awkward fit hote hain, isliye attribute routing standard ban gaya. Ye deprecated nahi hai (Option C galat), aur Minimal APIs se koi exclusive connection nahi hai (Option D galat).",
    difficulty: "medium",
  },
  {
    id: "routing-4",
    question: "Ek controller ke ek action pe `[HttpGet(\"{id:int}\")]` attribute hai. Wahi controller `MapControllerRoute` se bhi conventionally route karne ki koshish ki gayi. Kya hoga?",
    options: [
      "Dono routing styles simultaneously kaam karengi is controller ke liye",
      "Conventional routing is controller ko completely ignore karega — jis controller pe koi bhi attribute-routing hai wo poori tarah attribute-routed maana jaata hai",
      "Runtime error, dono styles ek saath use nahi ho sakti kisi bhi controller me",
      "Attribute routing automatically disable ho jaayegi, conventional routing use hogi",
    ],
    correctIndex: 1,
    explanation:
      "Agar controller ke kisi bhi action pe attribute-routing (Route/HTTP-verb attribute) hai, wo poora controller attribute-routed maana jaata hai aur conventional `MapControllerRoute` se match nahi hoga. Ye ek subtle gotcha hai — Option A aur D galat premises hain, Option C bhi galat hai kyunki ye silent behavior hai, hard error nahi.",
    difficulty: "hard",
  },
];

export default quiz;
