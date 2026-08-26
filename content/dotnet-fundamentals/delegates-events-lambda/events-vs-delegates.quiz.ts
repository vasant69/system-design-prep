import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "events-delegates-1",
    question: "Ek class ke bahar se, `public event Action<string> OnMessage;` field ke saath kya allowed hai?",
    options: [
      "`obj.OnMessage = null;` aur `obj.OnMessage += handler;` dono allowed",
      "Sirf `obj.OnMessage += handler;` / `obj.OnMessage -= handler;` allowed, `=` assignment aur direct invoke NAHI",
      "Sirf direct invoke `obj.OnMessage(\"msg\")` allowed hai, `+=` allowed nahi",
      "Kuch bhi allowed nahi, event ko sirf reflection se access kiya ja sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "`event` keyword compiler-enforced restriction add karta hai — declaring class ke BAHAR se sirf `+=`/`-=` allowed hain. `=` assignment (jo poori list clear kar deta) aur direct invocation (`obj.OnMessage(...)`) sirf declaring class ke ANDAR allowed hain. Options A aur C dono incorrect permissions bata rahe hain. Option D bhi galat hai — normal `+=`/`-=` bina reflection ke allowed hai.",
    difficulty: "medium",
  },
  {
    id: "events-delegates-2",
    question: "Plain public delegate field (`public Action<string> OnMessage;`, `event` keyword ke bina) me kya problem hai jo `event` fix karta hai?",
    options: [
      "Plain delegate field multicast support nahi karta",
      "Plain delegate field ko outside code `= null` se clear kar sakta hai ya directly invoke kar sakta hai — encapsulation break hoti hai",
      "Plain delegate field lambda expressions accept nahi karta",
      "Plain delegate field sirf static methods accept karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Plain delegate field bina `event` ke, outside code ko poori access deta hai — `=` assignment se poori invocation list clear ki ja sakti hai, aur direct call se koi bhi bahar se event 'fire' kar sakta hai jaise wo khud publisher ho. `event` keyword ye dono block karta hai. Options A, C, D sab factually galat hain — ye sab plain delegate field ke saath bhi normally kaam karte hain.",
    difficulty: "medium",
  },
  {
    id: "events-delegates-3",
    question: "`EventHandler<TEventArgs>` ka standard signature kya hai?",
    options: [
      "`TEventArgs -> void`",
      "`(object? sender, TEventArgs e) -> void`",
      "`(TEventArgs e) -> bool`",
      "`() -> TEventArgs`",
    ],
    correctIndex: 1,
    explanation:
      "`EventHandler<TEventArgs>` .NET ka standard event delegate signature hai: `void Handler(object? sender, TEventArgs e)`. `sender` batata hai event kisne fire kiya, `TEventArgs` (ya derived class) extra data carry karta hai. Options A, C, D sab is standard shape se match nahi karte.",
    difficulty: "easy",
  },
  {
    id: "events-delegates-4",
    question: "Event fire karte waqt `OnEvent?.Invoke(args)` (null-conditional operator ke saath) likhna kyun best practice hai `OnEvent(args)` ke bajaye?",
    options: [
      "Performance ke liye — `?.Invoke()` faster hai",
      "Agar koi subscriber nahi hai to event field null hota hai — bina `?.` seedha `OnEvent(args)` call karne se NullReferenceException aa sakta hai",
      "`?.Invoke()` automatically sab exceptions catch kar leta hai",
      "`?.Invoke()` ke bina event multicast nahi ho sakta",
    ],
    correctIndex: 1,
    explanation:
      "Agar koi subscriber nahi hai, event field ki value `null` hoti hai. `OnEvent(args)` seedha call karne se, agar wo null hai, `NullReferenceException` aayega. `?.Invoke(args)` (null-conditional) safely check karta hai — agar null hai, kuch nahi hota, warna invoke hota hai. Options A, C, D sab galat reasons hain.",
    difficulty: "medium",
  },
];

export default quiz;
