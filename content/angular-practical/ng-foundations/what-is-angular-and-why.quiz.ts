import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "what-is-angular-and-why-1",
    question:
      "Ek SPA (Single-Page App) me link click karne par kya hota hai?",
    options: [
      "Browser server se ek naya poora HTML page maangta hai aur re-render karta hai",
      "JavaScript screen ka sirf badla hua hissa update karta hai; data JSON me aata hai, poora page reload nahi hota",
      "Server har click par ek nayi .html file generate karke bhejta hai",
      "Kuch nahi hota jab tak aap manually page refresh na karo",
    ],
    correctIndex: 1,
    explanation:
      "SPA me HTML shell ek hi baar load hota hai; uske baad navigation aur data updates JavaScript handle karta hai aur server se data JSON ke roop me aata hai, HTML nahi. Option A aur C MPA (multi-page app) ka behaviour describe karte hain. Option D galat — SPA me navigation router ke through turant hota hai, refresh ki zaroorat nahi.",
    difficulty: "easy",
  },
  {
    id: "what-is-angular-and-why-2",
    question:
      "Angular ko 'framework' kehte hain, sirf 'library' nahi. Iska practical matlab kya hai?",
    options: [
      "Angular ka size kisi library se bada hota hai, bas isliye",
      "Angular aapki app ka structure decide karta hai aur aapka code uske rules ke andar chalta hai — routing, forms, DI, HTTP official aur bundled aate hain",
      "Framework ka matlab hai ki wo sirf TypeScript me likha gaya hai",
      "Library sirf frontend ke liye hoti hai, framework backend ke liye",
    ],
    correctIndex: 1,
    explanation:
      "Library aap zaroorat par bulate ho; framework aapki app ka overall shape control karta hai aur ek integrated toolset (router, forms, DI, HttpClient, testing) official deta hai. Option A size ek side-effect hai, definition nahi. Option C galat — React bhi TS me likha ja sakta hai par library hai. Option D galat — dono frontend/backend dono jagah ho sakte hain.",
    difficulty: "easy",
  },
  {
    id: "what-is-angular-and-why-3",
    question:
      "AngularJS aur Angular ke beech sahi rishta kya hai?",
    options: [
      "Dono same framework hain, AngularJS bas chhota naam hai",
      "AngularJS Angular ka naya version hai (v15+)",
      "AngularJS (v1.x) ek alag purana framework hai; Angular (v2+) ek complete rewrite hai — alag mental model, TypeScript, components",
      "Angular sirf mobile ke liye hai, AngularJS web ke liye",
    ],
    correctIndex: 2,
    explanation:
      "AngularJS v1.x ($scope, controllers, digest cycle) aur Angular v2+ (components, TypeScript, DI) do alag frameworks hain — beech me poora rewrite hua. Interview me 'Angular' hamesha v2+ matlab rakhta hai. Option A/B ulta batate hain. Option D galat — dono web frameworks hain (Angular mobile ke liye alag tools jaise Ionic use karta hai).",
    difficulty: "medium",
  },
  {
    id: "what-is-angular-and-why-4",
    question:
      "In me se kaunsa kaam Angular (bina extra library) built-in NAHI deta, jabki React use alag se chunna padta hai?",
    options: [
      "Client-side routing",
      "Reactive forms aur validation",
      "HTTP client for API calls",
      "In sab ke liye Angular official solution deta hai — routing, forms, aur HttpClient sab bundled hain",
    ],
    correctIndex: 3,
    explanation:
      "Angular ka core selling point yahi hai: `@angular/router`, `@angular/forms`, aur `@angular/common/http` sab ek hi versioned release me official aate hain. React me routing (React Router), forms (react-hook-form etc.), aur data fetching aap alag-alag chunte ho. Isliye options A, B, C teenon galat hain as 'not built-in' — sahi jawaab D hai.",
    difficulty: "medium",
  },
];

export default quiz;
