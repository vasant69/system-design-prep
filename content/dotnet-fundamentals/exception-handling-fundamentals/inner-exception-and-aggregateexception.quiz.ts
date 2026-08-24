import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "innerex-1",
    question: "```csharp\nvar t1 = Task.Run(() => throw new InvalidOperationException());\nvar t2 = Task.Run(() => throw new ArgumentException());\ntry { await Task.WhenAll(t1, t2); }\ncatch (Exception ex) { Console.WriteLine(ex.GetType().Name); }\n```\nYe kya print karega?",
    options: [
      "\"AggregateException\"",
      "Dono exception types ek saath print honge",
      "Sirf pehle-fail-hue task ka exception type (jaise \"InvalidOperationException\")",
      "Kuch print nahi hoga, exception silently swallow ho jaayega",
    ],
    correctIndex: 2,
    explanation:
      "`await Task.WhenAll(...)` sirf PEHLE exception ko unwrap karke directly throw karta hai — poora `AggregateException` nahi milta is catch block me. Agar sab failures chahiye, `Task.WhenAll` ka returned `Task` object explicitly `.Exception` property se inspect karna padta hai.",
    difficulty: "hard",
  },
  {
    id: "innerex-2",
    question: "`AggregateException.Flatten()` ka purpose kya hai?",
    options: [
      "Exception ko ek plain string me convert karta hai",
      "Nested AggregateExceptions ko ek single-level, flat InnerExceptions list me convert karta hai",
      "Sab exceptions ko discard karke ek generic exception deta hai",
      "Task ko synchronously re-run karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Jab nested tasks fail hote hain, `AggregateException.InnerExceptions` khud ek aur `AggregateException` contain kar sakta hai. `Flatten()` is nesting ko collapse karke ek flat list deta hai jisme sab actual root-cause exceptions directly accessible hote hain, bina manual recursive unwrapping ke.",
    difficulty: "medium",
  },
  {
    id: "innerex-3",
    question: "`throw new OrderServiceException(\"Order save failed\", ex)` likhna kis wajah se `throw ex;` se fundamentally different hai?",
    options: [
      "Koi fark nahi, dono same karte hain",
      "Ye ek genuinely NAYA exception object hai jiska apna sahi stack trace hai, aur original `ex` `InnerException` me preserved rehta hai",
      "Ye original exception ko permanently discard kar deta hai",
      "Ye sirf `throw ex;` ka alag naam hai",
    ],
    correctIndex: 1,
    explanation:
      "Ye ek genuinely naya exception create karta hai (jo ek naya, correct throw point hai, isliye uska stack trace bhi sahi hai), aur explicitly original `ex` ko `InnerException` me pass karta hai — koi information lost nahi hoti. `throw ex;` ke ulat, jo SAME exception object ka stack trace corrupt karta hai.",
    difficulty: "medium",
  },
  {
    id: "innerex-4",
    question: "`Task.WhenAny` aur `Task.WhenAll` ke exception-handling behavior me kya fark hai?",
    options: [
      "Dono identical hote hain",
      "`WhenAny` pehle-complete-hue task ka exception directly deta hai (agar wo fail hua); `WhenAll` sab failures ko AggregateException me wrap karta hai, jismein se await sirf pehla deta hai",
      "`WhenAny` kabhi exception nahi deta",
      "`WhenAll` sirf ek task allow karta hai",
    ],
    correctIndex: 1,
    explanation:
      "`Task.WhenAny` sirf ek task (jo pehle complete hua) track karta hai, agar wo fail hua uska exception directly milta hai. `Task.WhenAll` sab tasks ke results wait karta hai, agar multiple fail hon, unhe `AggregateException` me wrap karta hai — lekin `await Task.WhenAll(...)` sirf pehla exception directly throw karta hai catch block me.",
    difficulty: "medium",
  },
];

export default quiz;
