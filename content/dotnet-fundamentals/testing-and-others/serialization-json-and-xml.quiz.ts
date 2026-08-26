import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "serialization-json-xml-1",
    question:
      ".NET Core 3.0 ke baad ASP.NET Core ka default JSON serializer kaunsa hai?",
    options: [
      "Newtonsoft.Json",
      "System.Text.Json",
      "XmlSerializer",
      "BinaryFormatter",
    ],
    correctIndex: 1,
    explanation:
      "`System.Text.Json` .NET Core 3.0 (2019) se ASP.NET Core ka built-in default JSON serializer hai — better performance aur koi external NuGet dependency ki zaroorat nahi. Newtonsoft.Json (option A) pehle standard tha, abhi bhi advanced scenarios me use hota hai lekin default nahi. XmlSerializer (option C) JSON ke liye nahi hai. BinaryFormatter (option D) deprecated hai aur JSON serializer hai hi nahi.",
    difficulty: "easy",
  },
  {
    id: "serialization-json-xml-2",
    question:
      "Ek team ke paas ek third-party API integration hai jo runtime pe unpredictable, polymorphic JSON shape return karta hai. Kaunsi library iske liye historically zyada ergonomic hai?",
    options: [
      "System.Text.Json ka JsonSerializer.Deserialize<T>() strongly-typed approach",
      "Newtonsoft.Json ka JObject/LINQ-to-JSON dynamic parsing",
      "XmlSerializer",
      "BinaryFormatter",
    ],
    correctIndex: 1,
    explanation:
      "Newtonsoft.Json ka `JObject.Parse(...)` aur LINQ-to-JSON API dynamic/unpredictable JSON structures ke saath kaam karne ke liye historically zyada mature aur ergonomic raha hai. System.Text.Json (option A) strongly-typed deserialization ke liye best hai jab shape predictable ho, aur iska JsonDocument/JsonNode equivalent improve ho raha hai lekin historically kam mature tha. Options C aur D is scenario ke liye relevant nahi hain.",
    difficulty: "hard",
  },
  {
    id: "serialization-json-xml-3",
    question:
      "`BinaryFormatter` ko naye .NET code me kyun avoid karna chahiye?",
    options: [
      "Sirf isliye kyunki ye purana hai aur naya syntax nahi hai",
      "Ye untrusted input deserialize karte waqt remote code execution ka genuine security risk create karta hai",
      "Ye sirf .NET Framework me kaam karta hai",
      "Ye JSON format support nahi karta",
    ],
    correctIndex: 1,
    explanation:
      "`BinaryFormatter` ko Microsoft ne officially deprecated kiya (aur .NET 9+ me by default disable/remove kiya) kyunki ye insecure deserialization vulnerability class ka risk create karta tha — untrusted binary data deserialize karne par arbitrary code execute ho sakta tha. Ye sirf 'outdated' hone se zyada serious hai. Option C factually galat hai (ye .NET Core me bhi available tha, ab remove ho raha hai). Option D irrelevant hai — BinaryFormatter binary format ke liye hai, JSON se comparison hi nahi.",
    difficulty: "medium",
  },
  {
    id: "serialization-json-xml-4",
    question:
      "XML serialization aaj kis context me sabse zyada relevant hai?",
    options: [
      "Naye greenfield REST APIs ke primary data format ki tarah",
      "Legacy SOAP/WCF-era system interop ke liye",
      "Ye completely obsolete hai, koi bhi use nahi karta",
      "High-performance microservices communication ke liye",
    ],
    correctIndex: 1,
    explanation:
      "XML serialization mostly legacy interop context me relevant hai — purane SOAP-based/WCF systems jo abhi bhi XML expect karte hain, ya kuch specific config/document formats. Naye REST APIs almost hamesha JSON use karte hain (option A galat), aur XML poori tarah obsolete bhi nahi hai (option C galat) — legacy interop ek genuine, ongoing use case hai. Option D typically JSON ya binary protocols (protobuf) ka domain hai, XML ka nahi.",
    difficulty: "medium",
  },
];

export default quiz;
