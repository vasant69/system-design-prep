import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "mocking-moq-nsub-1",
    question:
      "Moq me `Mock<IEmailService>` se actual usable fake instance kaise nikalte hain?",
    options: [
      "Seedha mock variable ko pass kar dete hain, kyunki wo khud IEmailService hai",
      "`.Object` property access karke",
      "`.Instance` property access karke",
      "`Substitute.For<IEmailService>()` call karke",
    ],
    correctIndex: 1,
    explanation:
      "`Mock<T>` khud `T` nahi hai — ye ek wrapper class hai jiski `.Object` property actual fake `T` instance deti hai. Option A galat hai kyunki `Mock<T>` aur `T` alag types hain. Option C fictional property naam hai. Option D NSubstitute ka syntax hai, Moq ka nahi.",
    difficulty: "easy",
  },
  {
    id: "mocking-moq-nsub-2",
    question:
      "NSubstitute me interaction verify karne ke liye kya use hota hai (Moq ke `Verify` ke equivalent)?",
    options: [
      "`.Confirm()`",
      "`.Received(n)`",
      "`.Setup()`",
      "`.Check()`",
    ],
    correctIndex: 1,
    explanation:
      "NSubstitute me `substitute.Received(n).MethodCall(...)` interaction verify karta hai — Moq ke `mock.Verify(...)` ka functional equivalent. `.Setup()` Moq ka behavior-configuration syntax hai (option C), aur options A aur D fictional methods hain.",
    difficulty: "medium",
  },
  {
    id: "mocking-moq-nsub-3",
    question:
      "Moq me agar ek method call ke liye `Setup` nahi kiya gaya, aur wo method call ho jaata hai, kya hota hai?",
    options: [
      "Test compile hi nahi hoga",
      "Runtime exception aata hai turant",
      "Default value (jaise 0, null) silently return hota hai, koi exception nahi",
      "Moq automatically real implementation call kar deta hai",
    ],
    correctIndex: 2,
    explanation:
      "Unsetup method calls Moq me silently type ka default value return karte hain (int ke liye 0, reference type ke liye null) — koi exception nahi aata. Ye ek common gotcha hai jo galat-positive tests create kar sakta hai agar developer expect kare ki koi warning/error milega. Options A, B, aur D sab factually galat hain.",
    difficulty: "hard",
  },
  {
    id: "mocking-moq-nsub-4",
    question:
      "'Mock' aur 'Stub' me technical difference kya hai?",
    options: [
      "Koi difference nahi, dono same cheez hain",
      "Mock interactions verify karta hai; Stub sirf predetermined values return karta hai, verification nahi",
      "Stub sirf Moq me milta hai, Mock sirf NSubstitute me",
      "Mock async methods ke liye hai, Stub sync ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Technically ek mock wo test double hai jiske against interactions (call hua ya nahi, kitni baar) verify kiye jaate hain, jabki stub sirf canned values return karta hai bina verification concern ke. Options C aur D fictional/galat distinctions hain — dono libraries dono patterns support karti hain.",
    difficulty: "medium",
  },
];

export default quiz;
