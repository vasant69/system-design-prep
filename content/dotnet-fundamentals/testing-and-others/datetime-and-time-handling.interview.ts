import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "datetime-time-handling-tr-1",
    question: "DateTime aur DateTimeOffset me kya fark hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["Microsoft", "Amazon", "Flipkart"],
    shortAnswer:
      "DateTime.Kind (Utc/Local/Unspecified) sirf metadata hai jo easily ambiguous ho jaata hai; DateTimeOffset ek explicit UTC offset carry karta hai, jisse ye unambiguous point-in-time represent karta hai.",
    detailedAnswer:
      "DateTime ka Kind property value ko khud transform nahi karta — bahut saari operations (raw ADO.NET reads, kuch deserialization paths) Unspecified de deti hain, jisse downstream code galat assumption bana sakta hai. DateTimeOffset explicit offset (jaise +05:30) value ke saath store karta hai, isliye ye structurally unambiguous hai ki ye kaunsa absolute moment represent karta hai.",
    followUp: "Database me DateTime store karte waqt kya precaution leni chahiye?",
  },
  {
    id: "datetime-time-handling-tr-2",
    question: "DateTime.Kind = Unspecified milne par kya assume karna chahiye?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Kuch bhi assume nahi karna chahiye bina context verify kiye — ye explicitly 'pata nahi UTC hai ya local' represent karta hai, aur blindly convert karna galat result de sakta hai.",
    detailedAnswer:
      "Unspecified ek 'unknown' state hai, na UTC na Local. Agar developer isse `.ToLocalTime()` call kare bina verify kiye ki underlying data actually UTC hai, .NET wrongly assume karega ki value already local hai aur galat (ya no-op) conversion karega. Sahi approach: application-level convention establish karo (jaise 'database se aane wali sab values UTC hain') aur explicitly `DateTime.SpecifyKind(value, DateTimeKind.Utc)` set karo before conversion.",
    redFlag: "Ye kehna ki Unspecified ka matlab local time hota hai, ya UTC hota hai — dono galat hain, ye genuinely unknown state hai.",
  },
  {
    id: "datetime-time-handling-tr-3",
    question: "Ek reporting service `DateTime.Now` use kar raha hai UTC-stored flight-departure times ke against comparison karne ke liye. Kya galat ho sakta hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Do alag time references (server-local time vs UTC-stored data) bina conversion ke compare kiye ja rahe hain, jisse galat 'already departed' ya 'not yet departed' results aa sakte hain.",
    detailedAnswer:
      "Agar server IST (+05:30) me chal raha hai aur `DateTime.Now` use kiya jaaye, ye local wall-clock time deta hai. Agar isse UTC-stored data se directly compare kiya jaaye bina explicit conversion ke, comparison 5.5 ghante ka systematic error carry karega. Fix: consistently `DateTimeOffset.UtcNow` (ya `DateTime.UtcNow`) use karo comparisons ke liye jab underlying data UTC me stored hai.",
  },
  {
    id: "datetime-time-handling-tr-4",
    question: "TimeSpan aur DateTime me conceptual difference kya hai?",
    type: "conceptual",
    difficulty: "beginner",
    shortAnswer:
      "DateTime ek specific point in time (calendar date + time) represent karta hai; TimeSpan ek duration/difference represent karta hai, koi specific calendar moment nahi.",
    detailedAnswer:
      "DateTime 'kab' ka answer deta hai (jaise '2026-08-25 14:30'). TimeSpan 'kitni der' ka answer deta hai (jaise '3 ghante 30 minute'). Do DateTime values ko subtract karne se ek TimeSpan milta hai — `endTime - startTime` ek duration return karta hai, koi date nahi.",
  },
  {
    id: "datetime-time-handling-tr-5",
    question: "DateOnly/TimeOnly C# 10 me kyun introduce kiye gaye, jab DateTime se hi kaam chal sakta tha?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Purana pattern (DateTime use karke time part ignore karna) intent ko ambiguous rakhta tha aur accidental time-component bugs ka risk create karta tha — dedicated types se intent compiler-level explicit ho gaya.",
    detailedAnswer:
      "Jab 'date of birth' jaisi field ke liye DateTime use hota tha, `00:00:00` time-part ek arbitrary placeholder tha jise galti se meaningful value samajh liya ja sakta tha (jaise timezone conversion se accidentally date shift ho jaana). DateOnly/TimeOnly is ambiguity ko eliminate karte hain — type khud declare karta hai ki sirf date (ya sirf time) relevant hai, aur ye SQL ke DATE/TIME types se bhi cleanly map hote hain EF Core me.",
    followUp: "DateOnly ko EF Core me kaunse SQL column type se map kiya jaata hai?",
  },
  {
    id: "datetime-time-handling-tr-6",
    question: "Kya `DateTime.UtcNow` aur `DateTimeOffset.UtcNow` me koi practical difference hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Dono UTC time dete hain, lekin DateTime.UtcNow ka Kind sirf 'Utc' hota hai (metadata, easy to lose/mishandle downstream), jabki DateTimeOffset.UtcNow explicit +00:00 offset carry karta hai, jo structurally zyada robust hai serialization/deserialization ke through.",
    detailedAnswer:
      "Dono same instant represent karte hain, lekin DateTimeOffset zyada 'self-describing' hai — agar value kisi aisi API se serialize/deserialize ho jo Kind metadata preserve nahi karti (jaise kuch JSON libraries), DateTime ka Kind silently lost ho sakta hai, resulting Unspecified. DateTimeOffset ka offset value ka intrinsic part hai, isliye ye information loss kam hota hai. Isi wajah se naye APIs (jaise ASP.NET Core ke kuch modern patterns) DateTimeOffset ko prefer karte hain.",
  },
  {
    id: "datetime-time-handling-tr-7",
    question: "Ek API response me 'createdAt' field JSON me kis format me bhejna best practice hai?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "ISO 8601 format me UTC time, explicit 'Z' ya offset ke saath (jaise 2026-08-25T09:00:00Z), taaki consuming clients unambiguously interpret kar sakein.",
    detailedAnswer:
      "ISO 8601 ek widely-supported, unambiguous standard hai jo timezone information explicitly carry karta hai. System.Text.Json by default DateTimeOffset/DateTime ko is format me serialize karta hai. Ye consuming frontend/mobile clients ko exact moment pata karne deta hai bina guess kiye ki server kis timezone me tha jab response bana.",
  },
];

export default questions;
