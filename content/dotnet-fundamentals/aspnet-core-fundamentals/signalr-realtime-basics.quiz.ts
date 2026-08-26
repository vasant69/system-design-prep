import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "signalr-1",
    question: "SignalR ki transport fallback chain kya hai jab WebSockets available na ho?",
    options: [
      "Sirf WebSockets support karta hai, koi fallback nahi hai",
      "WebSockets -> Server-Sent Events -> Long Polling",
      "Long Polling -> WebSockets -> Server-Sent Events",
      "SignalR HTTP/2 use karta hai hamesha, transport negotiation nahi hoti",
    ],
    correctIndex: 1,
    explanation:
      "SignalR pehle WebSockets try karta hai (best case — true bidirectional, low latency). Agar available na ho (proxy/firewall/browser restrictions), Server-Sent Events try karta hai. Agar wo bhi na ho, sabse basic fallback Long Polling use karta hai. Ye automatic negotiation SignalR ka genuine value hai. Options A, C, D is fallback mechanism ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "signalr-2",
    question: "Ek regular business-logic service class (jo Hub nahi hai) se SignalR-connected clients ko push karna hai. Kaunsa mechanism use karoge?",
    options: [
      "Ye possible hi nahi hai, sirf Hub class se push kiya ja sakta hai",
      "IHubContext<THub> inject karo service me, uske through Clients.Group/All/User se push karo",
      "Ek naya Hub instance manually 'new' karke create karo",
      "Service ko khud ek Hub banana padega",
    ],
    correctIndex: 1,
    explanation:
      "IHubContext<THub> specifically isi purpose ke liye design hua hai — ye kisi bhi DI-managed class (background service, regular business logic) ko us Hub ke connected clients tak access deta hai, Hub class ke andar hue bina. Options A, C, D is mechanism ke existence/approach ko galat represent karte hain.",
    difficulty: "hard",
  },
  {
    id: "signalr-3",
    question: "Server-Sent Events (SSE) aur SignalR me fundamental difference kya hai communication direction ke regard me?",
    options: [
      "Dono exactly same bidirectional communication provide karte hain",
      "SSE sirf unidirectional hai (server-to-client), SignalR genuinely bidirectional hai",
      "SSE bidirectional hai, SignalR sirf unidirectional hai",
      "Dono sirf client-to-server communication support karte hain",
    ],
    correctIndex: 1,
    explanation:
      "Server-Sent Events sirf server-se-client streaming support karta hai — client server ko is same connection se data nahi bhej sakta (alag HTTP request chahiye hogi). SignalR (jab WebSockets transport use ho raha ho) genuinely bidirectional hai — client server ko methods invoke kar sakta hai, server client ko push kar sakta hai, same persistent connection pe. Options A, C, D in dono technologies ke actual communication model ko galat represent karte hain.",
    difficulty: "medium",
  },
  {
    id: "signalr-4",
    question: "Ek team 'kabhi-kabhi user ko check karna chahiye ki naya email aaya ya nahi' jaisi simple, low-frequency-update feature ke liye SignalR implement karti hai. Ye decision kaisa hai?",
    options: [
      "Perfect choice hai, SignalR har real-time scenario ke liye best hai",
      "Potentially overkill — plain polling ya simpler mechanism is low-stakes, infrequent-update case ke liye sufficient ho sakta tha, bina SignalR ki connection-management complexity ke",
      "SignalR is use case ke liye technically kaam hi nahi karega",
      "Ye decision irrelevant hai, sab real-time libraries same complexity rakhte hain",
    ],
    correctIndex: 1,
    explanation:
      "SignalR persistent connections manage karta hai, jo genuinely low-frequency, non-urgent updates ke liye unnecessary infrastructure complexity/overhead add kar sakta hai. Simple periodic polling (jaise har few minutes check karna) aksar sufficiently simple aur adequate hota hai jab true instant-push genuinely zaroori na ho. Options A, C, D is trade-off consideration ko galat represent karte hain — SignalR sab scenarios ke liye automatically best choice nahi hai.",
    difficulty: "hard",
  },
];

export default quiz;
