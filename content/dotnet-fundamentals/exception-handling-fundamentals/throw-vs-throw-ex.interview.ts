import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "throwex-tr-1",
    question: "`throw;` aur `throw ex;` me exact difference kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon"],
    shortAnswer: "`throw;` original stack trace preserve karta hai; `throw ex;` stack trace ko current line se reset kar deta hai.",
    detailedAnswer: "`throw;` (bina expression, sirf keyword) caught exception object ko as-is rethrow karta hai — CLR uske `StackTrace` property ko touch nahi karta, original throw location intact rehti hai. `throw ex;` exception ko treat karta hai jaise ye ek naya throw ho, current line se — `StackTrace` overwrite ho jaata hai, original location (deep, jahan exception genuinely origin hua tha) permanently lost ho jaati hai. Behavior (exception propagate hona) same hai, lekin debugging ke liye available information bilkul alag.",
    followUp: "Agar tumhe naya exception type throw karna ho lekin original ko preserve bhi rakhna ho, kya karoge?",
  },
  {
    id: "throwex-tr-2",
    question: "Ye do code snippets same failure ke liye alag stack traces dete hain — kyun?\n```csharp\n// A\ncatch (Exception ex) { throw; }\n// B\ncatch (Exception ex) { throw ex; }\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "A original stack trace show karega (deep throw location tak); B sirf is catch block ki line se show karega.",
    detailedAnswer: "Snippet A me `throw;` exception object ko unchanged propagate karta hai — jab ye eventually log hoga, poora original call chain dikhega jahan exception actually throw hua tha. Snippet B me `throw ex;` `StackTrace` ko overwrite kar deta hai is line se — logged trace me deep origin ka koi mention nahi hoga, sirf itna dikhega ki exception is catch block se throw hua, jo misleading hai.",
  },
  {
    id: "throwex-tr-3",
    question: "Production incident me stack trace sirf ek generic catch block ki line dikha raha hai, exact root cause line nahi. Ye kis code pattern ki wajah se ho sakta hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "Almost certainly kahin `throw ex;` use hua hai jahan `throw;` hona chahiye tha.",
    detailedAnswer: "Ye ek bahut common real-world debugging scenario hai — jab koi engineer 'log and rethrow' likhta hai `catch (Exception ex) { _logger.LogError(ex, ...); throw ex; }`, stack trace us catch block ki line se reset ho jaata hai. Fix: `throw ex;` ko `throw;` se replace karo — behavior same rahega (exception propagate hoga) lekin ab poora original stack trace preserve rahega, root cause identify karna bahut aasan ho jaayega.",
    redFlag: "Sirf 'exception kahin se aa raha hai' bolna without connecting the missing-stack-trace symptom to the throw-ex root cause.",
  },
  {
    id: "throwex-tr-4",
    question: "Kya `throw ex;` ka koi genuinely valid use case hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Practically nahi — Roslyn analyzer (CA2200) tak isko anti-pattern flag karta hai. Almost hamesha `throw;` ya `throw new Wrapper(msg, ex)` hi sahi choice hai.",
    detailedAnswer: "Kabhi-kabhi candidates soch sakte hain 'agar mujhe fresh stack trace chahiye jo bas is point se shuru ho' to `throw ex;` valid hoga — lekin practically ye almost kabhi genuinely desirable nahi hai, kyunki debugging ke liye original context hamesha zyada valuable hota hai. Agar tumhe genuinely ek naya, clean throw-point chahiye, better approach ek naya wrapper exception throw karna hai (`throw new SomeException(msg, ex)`) jisme original `InnerException` me preserved rehta hai — best of both worlds.",
    redFlag: "'throw ex; kabhi kabhi theek hai clean stack trace ke liye' — ye genuinely galat guidance hai, almost never justified.",
  },
  {
    id: "throwex-tr-5",
    question: "`ExceptionDispatchInfo.Capture(ex).Throw()` kya karta hai, aur ye `throw;` se kab zyada useful hota hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Original stack trace preserve karke exception rethrow karta hai, lekin catch block ke bahar (jaise stored exception, async continuation) bhi use ho sakta hai — `throw;` sirf catch block ke andar directly valid hai.",
    detailedAnswer: "`throw;` sirf uss exact `catch` block ke andar likh sakte ho jahan exception caught hua. Agar tumhe exception ko kahin store karna hai (jaise `Task.Exception`, ya ek list of failed operations) aur baad me, kisi doosri jagah se, original trace ke saath rethrow karna hai, `throw;` directly kaam nahi karega. `ExceptionDispatchInfo.Capture(ex).Throw()` (System.Runtime.ExceptionServices) is gap ko fill karta hai — ye original stack trace ko as-if-rethrown-from-original-point preserve karta hai, chahe call kahin bhi ho, catch block ke andar ya bahar.",
  },
  {
    id: "throwex-tr-6",
    question: "Ye code kya karega?\n```csharp\ntry\n{\n    Level1();\n}\ncatch (Exception ex)\n{\n    Console.WriteLine(ex.StackTrace);\n    throw;\n}\n```",
    type: "code-output",
    difficulty: "beginner",
    shortAnswer: "Original stack trace print hoga (Level1 se), phir exception unchanged propagate hoga upar.",
    detailedAnswer: "`ex.StackTrace` yahan already original location reflect karega (jahan exception `Level1()` ke andar throw hua). `throw;` phir usi exception object ko unchanged rethrow karta hai — koi modification nahi hoti stack trace me is is point ke baad bhi, jab tak wo bhi `throw;` use kare, na ki `throw ex;`.",
  },
  {
    id: "throwex-tr-7",
    question: "Team code review me guideline set karna hai: 'catch-log-rethrow' pattern ke liye. Exact rule kya likhoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "'Agar exception ko unchanged rethrow karna hai, hamesha `throw;` use karo, kabhi `throw ex;` nahi.' Lint rule (CA2200) enforce karo CI me.",
    detailedAnswer: "Practical guideline: log-and-rethrow ke liye hamesha `throw;` (bare). Agar naya exception type banana hai to `throw new SpecificException(message, ex)` — original `InnerException` me. `throw ex;` ko explicitly prohibited pattern banao, aur CI pipeline me Roslyn analyzer `CA2200` ko warning-as-error treat karo taaki koi accidentally ye pattern merge na kar sake.",
  },
  {
    id: "throwex-tr-8",
    question: "Ye code kya karega — kaunsi exception aur kaisa stack trace?\n```csharp\nvoid Outer()\n{\n    try { Inner(); }\n    catch (Exception ex) { throw ex; }\n}\nvoid Inner() => throw new InvalidOperationException(\"boom\");\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer: "`InvalidOperationException(\"boom\")` propagate hoga, lekin stack trace sirf `Outer()`'s catch-block line se shuru dikhega — `Inner()` ka mention gayab hoga.",
    detailedAnswer: "Exception type aur message unchanged rehte hain (`throw ex;` sirf `StackTrace` reset karta hai, exception object khud replace nahi hota). Lekin logged/printed stack trace me `Inner()` ki entry missing hogi — jaise exception seedha `Outer()` ke catch block se hi throw hua ho. Ye exactly wo information-loss hai jo `throw;` (bare) se avoid ho jaata.",
  },
];

export default questions;
