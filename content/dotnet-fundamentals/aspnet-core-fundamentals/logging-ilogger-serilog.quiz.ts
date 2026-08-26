import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "logging-1",
    question: "Structured logging me `_logger.LogInformation(\"Order {OrderId} created\", orderId)` string interpolation (`$\"Order {orderId} created\"`) se better kyun hai?",
    options: [
      "Ye zyada fast hai runtime pe, koi functional difference nahi",
      "`{OrderId}` ek named, distinct field ke roop me preserve hota hai jo log sinks queryable property bana sakte hain — interpolation se ye structure permanently kho jaata hai",
      "Interpolation compile error deta hai logger methods ke saath",
      "Koi difference nahi hai, dono exactly same behave karte hain",
    ],
    correctIndex: 1,
    explanation:
      "Message-template placeholders logger ko batate hain ki kaunsi values distinct, named fields hain — modern sinks (Seq, Elasticsearch) inhe queryable properties store karte hain. String interpolation value ko already ek flat string me bake kar deta hai, isliye structured querying possible nahi rehti. Options A, C, D is core distinction ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "logging-2",
    question: "Production environment me typically kaunsa minimum log level enabled rakha jaata hai, aur kyun?",
    options: [
      "Trace — sabse detailed information chahiye hamesha",
      "Debug — development jaisa hi verbosity chahiye",
      "Information ya upar — Debug/Trace verbosity storage cost badhati hai aur important logs ko noise me dabati hai",
      "Sirf Critical — baaki sab levels waste hain",
    ],
    correctIndex: 2,
    explanation:
      "Information level aur upar (Warning, Error, Critical) production me typical default hai — ye operational visibility deta hai bina excessive verbosity ke. Trace/Debug (Options A, B) itni granular detail generate karte hain ki storage cost badh jaata hai aur genuinely important signals dab jaate hain. Sirf Critical (Option D) itna restrictive hai ki normal troubleshooting ke liye useful Information/Warning/Error logs miss ho jaayenge.",
    difficulty: "medium",
  },
  {
    id: "logging-3",
    question: "Serilog aur built-in `ILogger<T>` ka relationship kya hai?",
    options: [
      "Serilog `ILogger<T>` ko completely replace karta hai, application code bhi change karna padta hai",
      "Serilog usi `ILogger<T>` abstraction ke peeche plug-in hota hai — application call sites same rehte hain, sirf configuration/provider badalta hai",
      "Serilog aur ILogger<T> ek doosre se independent, unrelated systems hain",
      "ILogger<T> Serilog ke upar built hai, Serilog primary hai",
    ],
    correctIndex: 1,
    explanation:
      "ILogger<T> ek abstraction hai Microsoft.Extensions.Logging me. Serilog isi abstraction ke peeche apna implementation plug karta hai — application code (_logger.LogInformation(...) calls) same rehta hai, sirf startup configuration Serilog ki richer sinks/enrichers use karne ke liye badalti hai. Options A, C, D is dependency-inversion relationship ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "logging-4",
    question: "Ek exception catch karke log karte waqt `_logger.LogError(ex.Message)` use kiya gaya, `_logger.LogError(ex, \"message\")` overload nahi. Iska practical downside kya hai?",
    options: [
      "Koi downside nahi, dono same information capture karte hain",
      "Stack trace kho jaata hai — sirf top-level exception message capture hota hai, debugging ke liye zaroori context missing rehta hai",
      "Performance drastically slow ho jaata hai",
      "Application crash ho jaata hai is overload ke bina",
    ],
    correctIndex: 1,
    explanation:
      "ex.Message overload use karne se sirf ek short summary string capture hoti hai. LogError(ex, \"message\") overload poora exception object pass karta hai, jisse stack trace, inner exceptions, aur exception type sab log sink me capture hote hain — production debugging ke liye ye critical context hai jo sirf message se miss ho jaata hai. Options A, C, D is difference ke actual impact ko galat represent karte hain.",
    difficulty: "medium",
  },
];

export default quiz;
