import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "assemblies-metadata-manifest-tr-1",
    question: "Assembly kya hai, aur ye kya-kya components bundle karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Wipro"],
    shortAnswer: "Assembly `.NET` ka deployment/versioning/type-loading unit hai (`.dll`/`.exe`) — IL code, metadata, aur manifest bundle karta hai.",
    detailedAnswer:
      "Ek assembly physically ek `.dll` ya `.exe` file hai jisme teen cheezein hoti hain: (1) IL code — compiled methods, (2) Metadata — har type/method/field/attribute ka self-describing catalog, (3) Manifest — assembly ki apni identity (naam, version) aur uski dependencies (referenced assemblies) ki list. Ye teeno mil kar assembly ko self-sufficient banate hain — CLR ko load karne ke liye kisi external registry/documentation ki zaroorat nahi.",
    followUp: "Reflection ka metadata se kya connection hai?",
  },
  {
    id: "assemblies-metadata-manifest-tr-2",
    question: "Metadata assembly ke andar kya role play karta hai, aur Reflection ke saath iska connection kya hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Metadata har type/method/field ka self-describing catalog hai; Reflection runtime pe directly isi metadata ko padh kar type information return karta hai.",
    detailedAnswer:
      "Compile hone ke baad, assembly ke andar har defined type ke baare me complete information (methods, parameters, return types, attributes) binary format me store ho jaati hai — ye metadata hai. Jab tum `typeof(X).GetMethods()` jaisa Reflection call karte ho, CLR is metadata ko hi query kar raha hota hai, koi 'magic' nahi — assembly khud apne baare me sab kuch bata sakti hai bina source code ke.",
  },
  {
    id: "assemblies-metadata-manifest-tr-3",
    question: "Manifest specifically kya store karta hai, aur CLR isse kaise use karta hai runtime pe?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Manifest assembly ki identity (naam, version) aur referenced assemblies ki list store karta hai — CLR isse padh kar dependencies resolve karta hai load-time pe.",
    detailedAnswer:
      "Jab CLR ek assembly load karta hai aur usme koi type kisi doosri assembly (dependency) se referenced hota hai, CLR manifest padh kar exactly janta hai kaunsi assembly, kaunsa version chahiye. Ye ek built-in dependency-resolution mechanism hai jo assembly ke andar hi embedded hai — koi separate registry file (jaise purani COM-era Windows Registry) ki zaroorat nahi padti.",
  },
  {
    id: "assemblies-metadata-manifest-tr-4",
    question: "Ek team ka claim hai ki 'metadata aur manifest same cheez hain, dono ek hi kaam karte hain.' Ye kitna accurate hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Galat — metadata poora self-describing type catalog hai (broader), manifest uska ek specific subset hai jo sirf identity aur dependencies focus karta hai.",
    detailedAnswer:
      "Metadata assembly ke andar defined har cheez ka description hai — types, methods, fields, properties, attributes, sab. Manifest is metadata ka hi ek narrower, specific hissa hai — sirf assembly ki apni identity (naam, version, culture) aur external dependencies pe focused. Har manifest metadata ka part hai, lekin metadata sirf manifest tak limited nahi hai — ye scope ka fark interview me test hota hai.",
    redFlag: "'Metadata aur manifest interchangeable terms hain' bolna — scope ka fundamental difference miss karta hai.",
  },
  {
    id: "assemblies-metadata-manifest-tr-5",
    question: "'Could not load file or assembly X, Version=1.0.0.0' jaisa error kis situation me aata hai, aur iska root cause kya hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Jab dependent assembly ka manifest ek specific version reference karta hai jo runtime pe available nahi hai (kisi upgrade/downgrade ki wajah se) — version mismatch CLR ko load fail karwa deta hai.",
    detailedAnswer:
      "Har assembly ka manifest apni dependencies ke exact required version ko record karta hai. Agar koi dependency upgrade ho jaaye (jaise `1.0.0.0` se `2.0.0.0`) lekin dependent assembly ka manifest abhi bhi `1.0.0.0` expect kar raha ho, CLR load-time pe fail ho jaata hai — ye is exact tarah ke error se manifest ho jaata hai. `.NET Framework` me isse 'assembly binding redirect' (`web.config`/`app.config` me) se solve kiya jaata tha.",
    followUp: "Modern `.NET` (Core/5+) me dependency version conflicts kaise handle hote hain — kya wahi mechanism hai?",
  },
  {
    id: "assemblies-metadata-manifest-tr-6",
    question: "Kya IntelliSense (jab ek referenced .dll ke methods dikhata hai) source code ki zaroorat padti hai kaam karne ke liye?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer: "Nahi — IntelliSense assembly ki metadata padh kar hi type/method information dikha sakta hai, source code available hona zaroori nahi.",
    detailedAnswer:
      "Assembly ki metadata self-describing hoti hai — har method ka naam, parameters, return type sab compiled binary ke andar hi stored hote hain. Yehi wajah hai ki koi bhi third-party NuGet package (jiska source code na ho) bhi IntelliSense me methods/parameters properly dikhata hai — tooling directly assembly ki metadata query kar raha hota hai, source code parse nahi kar raha.",
    redFlag: "'IntelliSense sirf source code available hone par kaam karta hai' bolna — metadata ka self-describing nature miss karta hai.",
  },
  {
    id: "assemblies-metadata-manifest-tr-7",
    question: "Kya modern .NET (Core/.NET 5+) me multi-file assemblies (ek logical assembly, multiple physical .dll files me split) common hain?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi — multi-file assemblies ek `.NET Framework`-era concept tha jo modern `.NET` (Core/5+) support hi nahi karta; sab single-file assembly model follow karta hai.",
    detailedAnswer:
      "`.NET Framework` me technically multi-file assemblies possible thi — ek logical assembly ka manifest, code, aur resources alag-alag physical files me split ho sakte the. Practically ye rare tha, aur modern `.NET` (Core, `.NET 5+`) ne is feature ko completely drop kar diya — ab har assembly single, self-contained `.dll`/`.exe` file hoti hai jisme IL, metadata, manifest sab ek hi jagah hote hain.",
  },
  {
    id: "assemblies-metadata-manifest-tr-8",
    question: "Ek naya developer sochta hai ki assembly sirf 'compiled code ka container' hai, kuch aur nahi. Ye samajh kahan incomplete hai?",
    type: "trap",
    difficulty: "beginner",
    shortAnswer: "Incomplete hai — assembly compiled IL ke saath-saath metadata (self-describing type info) aur manifest (identity + dependencies) bhi carry karta hai, jo Reflection, tooling, aur dependency resolution ko enable karta hai.",
    detailedAnswer:
      "'Sirf compiled code' wali samajh Reflection, IntelliSense, aur dependency-resolution jaise real capabilities ko explain nahi kar paati. Assembly ek self-sufficient package hai — usme IL (execution ke liye), metadata (self-description ke liye, Reflection/tooling enable karta hai), aur manifest (identity aur dependency-tracking ke liye) teeno hote hain. Ye poora design .NET ko bina external registry/header files ke robust type-loading aur versioning dene ke liye banaya gaya hai.",
    redFlag: "Assembly ko sirf 'compiled DLL' bolna bina metadata/manifest ka mention kiye — ye interview me incomplete answer maana jaata hai.",
  },
];

export default questions;
