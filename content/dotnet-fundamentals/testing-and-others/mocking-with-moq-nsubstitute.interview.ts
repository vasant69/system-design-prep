import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "mocking-moq-nsub-tr-1",
    question: "Moq aur NSubstitute me fundamental difference kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys"],
    shortAnswer:
      "Functionally equivalent hain, syntax style alag hai — Moq explicit Setup/Verify API deta hai, NSubstitute call-style syntax deta hai.",
    detailedAnswer:
      "Dono ek interface ka fake implementation banate hain test purposes ke liye, same core features (return values, exception setup, call verification, argument matchers) dete hain. Moq me `new Mock<T>().Object` se instance milta hai aur `Setup`/`Verify` explicit calls hain. NSubstitute me `Substitute.For<T>()` seedha usable instance deta hai aur syntax normal method calls jaisa padhta hai.",
    followUp: "Kaunsa aap prefer karoge aur kyun?",
  },
  {
    id: "mocking-moq-nsub-tr-2",
    question: "Mock aur Stub me kya difference hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Mock interactions verify karta hai (call hua ya nahi); Stub sirf predetermined values return karta hai, koi verification concern nahi.",
    detailedAnswer:
      "Ye classic test-double terminology hai. Mock ka use tab hota hai jab tumhe check karna ho ki koi specific method call hua ya nahi (jaise 'email bheja gaya'). Stub ka use tab hota hai jab tumhe bas ek predetermined value chahiye taaki test ka baaki logic chal sake, without caring ki wo call track ho raha hai ya nahi. Practically Moq/NSubstitute dono se dono patterns implement kiye ja sakte hain.",
  },
  {
    id: "mocking-moq-nsub-tr-3",
    question: "Agar Moq me ek method ka Setup nahi kiya gaya aur wo method call ho jaaye, to kya hoga?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Exception nahi aayega — type ka default value (0, null, false) silently return hoga.",
    detailedAnswer:
      "Ye common misconception hai ki unsetup call se exception aayega. Moq loose mocking behavior follow karta hai by default — agar Setup nahi mila, wo bas default(T) return kar deta hai. Isse false-passing tests ban sakte hain agar developer assume kare ki missing setup pakda jaayega.",
    redFlag: "Ye kehna ki Moq unsetup calls pe automatically fail/throw ho jaata hai — ye galat hai aur real debugging me confusion create kar sakta hai.",
  },
  {
    id: "mocking-moq-nsub-tr-4",
    question: "Ek naya junior developer team me join karta hai jise Moq ka syntax confusing lag raha hai. Kya karoge?",
    type: "scenario",
    difficulty: "beginner",
    shortAnswer:
      "Ye ek genuine consideration hai — agar team NSubstitute ki taraf shift kare to onboarding easier ho sakta hai, lekin existing codebase me consistency ka trade-off bhi dekhna padega.",
    detailedAnswer:
      "Real teams isko exactly is tarah handle karte hain — NSubstitute ka concise, real-code-jaisa syntax onboarding ko easier bana sakta hai. Lekin agar existing codebase already Moq-heavy hai, poori codebase migrate karna significant effort hai jiska ROI shayad justify na ho. Practical answer: naye projects me NSubstitute try kar sakte ho, lekin existing test suite ko forcibly migrate karna zaroori nahi.",
  },
  {
    id: "mocking-moq-nsub-tr-5",
    question: "Kya Moq aur NSubstitute ek hi test project me saath use kiye ja sakte hain?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "Technically haan (dono independent NuGet packages hain), lekin practically avoid karna chahiye — consistency maintain karna better hai.",
    detailedAnswer:
      "Koi hard technical restriction nahi hai jo dono ko ek saath use karne se roke — dono independent libraries hain jo koi conflicting global state maintain nahi karti. Lekin ek hi codebase me do mocking styles mix karna readability aur maintainability ke liye bura hai, isliye teams practically ek library standardize karti hain.",
  },
  {
    id: "mocking-moq-nsub-tr-6",
    question: "`It.IsAny<T>()` (Moq) aur `Arg.Any<T>()` (NSubstitute) ka kya purpose hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Ye argument matchers hain jo bolte hain 'is parameter ki koi bhi value ho, match kar do' — exact value specify karne ki zaroorat nahi.",
    detailedAnswer:
      "Jab tumhe ek method setup/verify karna ho lekin exact argument value se matlab na ho (sirf ye matter kare ki method call hua, kis specific string ke saath hua wo nahi), `It.IsAny<T>()`/`Arg.Any<T>()` use karte hain. Isse tests brittle nahi hote — agar exact argument value future me change ho, test bina reason ke fail nahi hoga.",
  },
  {
    id: "mocking-moq-nsub-tr-7",
    question: "Over-mocking kya hota hai aur ye kyun problematic hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Har chhoti dependency (jaise simple DTOs/value objects) ko bhi mock karna — isse tests brittle aur unreadable ho jaate hain, jab real instance use karna simpler hota.",
    detailedAnswer:
      "Mocking sirf un dependencies ke liye karni chahiye jinka real behavior test ke liye impractical ho (external services, DB calls, time-dependent code). Simple value objects/DTOs ko mock karna unnecessary complexity add karta hai — real instance banake use karna zyada readable aur less fragile hota hai, kyunki mock setup khud maintenance burden ban jaata hai.",
    redFlag: "Har single dependency ko reflexively mock karna, chahe wo trivial value object ho — ye signal karta hai candidate ne mocking ka 'kab zaroori hai' wala judgment nahi seekha.",
  },
];

export default questions;
