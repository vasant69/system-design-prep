import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "testing-basics-1",
    question: "Ek Angular component test me property set karne ke baad DOM check kiya, lekin purana content dikh raha hai. Sabse likely reason kya hai?",
    options: [
      "fixture.detectChanges() call karna bhool gaye",
      "TestBed configure hi nahi hua",
      "Jasmine spy sahi se setup nahi hua",
      "Component ka selector galat hai",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - Angular test environment automatically change detection nahi chalata, isliye property set karne ke baad DOM update dekhne ke liye detectChanges() explicitly call karna padta hai. Option B galat hai - agar TestBed configure na hota to createComponent hi fail ho jaata, aage tak pahuchte hi nahi. Option C galat hai - spies service dependencies ke liye hote hain, DOM update se unka direct lena dena nahi. Option D galat hai - selector issue se component hi render nahi hota, ye alag tarah ki error deta.",
    difficulty: "easy",
  },
  {
    id: "testing-basics-2",
    question: "Ek component jisme UserService inject hoti hai (jo real HTTP call karti hai), unit test me isse kaise handle karna chahiye?",
    options: [
      "TestBed provider ya jasmine spy se UserService ko mock karna, real HTTP call avoid karna",
      "Real UserService use karna taaki test 'zyada realistic' ho",
      "UserService ko component se hata dena test ke waqt",
      "Test ko skip kar dena kyunki HTTP dependency hai",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - mocking dependency test ko fast, predictable, aur network-independent banata hai, jo unit testing ka core principle hai. Option B galat hai - real HTTP calls unit tests ko slow aur flaky banate hain, aur external service pe dependency create karte hain. Option C galat hai - service hatana component ko broken state me test karna hoga, jo real usage represent nahi karta. Option D galat hai - dependency hone se test skip karna galat approach hai, mocking exactly isi problem ka solution hai.",
    difficulty: "medium",
  },
  {
    id: "testing-basics-3",
    question: "Shallow testing aur deep testing ke beech trade-off kya hai?",
    options: [
      "Shallow tests fast aur focused hote hain lekin parent-child integration miss kar sakte hain; deep tests realistic hote hain lekin slower hain",
      "Deep testing hamesha better hota hai, shallow testing ka koi use case nahi",
      "Shallow testing sirf services ke liye hota hai, deep testing sirf components ke liye",
      "Dono me koi real difference nahi, sirf naming convention alag hai",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - shallow testing child components ko stub karke sirf parent logic test karta hai (fast, focused, but integration miss ho sakta hai), deep testing real child tree render karta hai (realistic, integration bugs pakadta hai, but slower aur heavier setup). Option B galat hai - deep testing hamesha better nahi, uska cost (speed, setup complexity) real hai isliye shallow tests bhi valid choice hain. Option C galat hai - dono terms components ke context me hi primarily use hoti hain, services ka isse direct connection nahi. Option D galat hai - ye ek meaningful architectural trade-off hai, sirf naming ka farak nahi.",
    difficulty: "medium",
  },
  {
    id: "testing-basics-4",
    question: "TestBed.configureTestingModule() ka primary purpose kya hai?",
    options: [
      "Ek isolated Angular testing module create karna jisme component/service test ke liye dependencies, providers, aur imports configure hote hain",
      "Production build ke liye Angular app ko compile karna",
      "Sirf Jasmine ke describe/it blocks ko register karna",
      "Karma test runner ko start karna",
    ],
    correctIndex: 0,
    explanation: "Sahi jawab pehla hai - TestBed ek chhota, isolated Angular module banata hai specifically test ke liye, jisme mock providers, imports (standalone components ke liye), etc configure kiye ja sakte hain. Option B galat hai - production build Angular CLI ke build commands se hota hai, TestBed uska hissa nahi. Option C galat hai - describe/it Jasmine ka apna syntax hai, TestBed se independent hai. Option D galat hai - Karma runner ko start karna test execution infrastructure ka kaam hai, TestBed sirf Angular-specific module setup provide karta hai jiske andar tests chalte hain.",
    difficulty: "medium",
  },
];

export default quiz;
