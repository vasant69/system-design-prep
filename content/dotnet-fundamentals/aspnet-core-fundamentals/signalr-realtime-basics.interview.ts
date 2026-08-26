import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "signalr-tr-1",
    question: "SignalR kya hai, aur ye traditional HTTP request-response model ki kaunsi limitation solve karta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Swiggy"],
    shortAnswer: "SignalR real-time, server-to-client push communication enable karta hai — traditional HTTP me server sirf request ka response de sakta hai, khud initiate nahi kar sakta.",
    detailedAnswer:
      "Plain HTTP me server sirf tab hi client ko data bhej sakta hai jab client ne explicitly request kiya ho — server khud se unprompted data push nahi kar sakta. SignalR (WebSockets ke upar, automatic SSE/long-polling fallback ke saath) ek persistent connection maintain karta hai jisse server genuinely apni marzi se, kisi bhi client-request ke bina, connected clients ko data push kar sakta hai. Ye chat, live notifications, live dashboards jaise use cases ke liye essential hai jahan client ko 'naya data hai' ka pata turant chahiye, bina repeatedly poll kiye.",
    followUp: "Agar SignalR available na ho kisi browser/network environment me, kya hota hai?",
  },
  {
    id: "signalr-tr-2",
    question: "Hub kya hai SignalR me, aur Clients object ke targeting options kya hain?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Hub ek server-side class hai jise clients connect karte hain; Clients object All, Caller, Group, User, Client jaise targeting granularity levels provide karta hai.",
    detailedAnswer:
      "Hub SignalR ka central abstraction hai — server-side class jiske public methods clients invoke kar sakte hain, aur jo khud clients ko methods invoke kar sakta hai (push). Clients.All sab connected clients ko target karta hai, Clients.Caller sirf current request bhejne wale client ko, Clients.Group(name) ek specific named group ko (jaise ek chat room ke sab members), Clients.User(userId) ek specific authenticated user ke saare connections ko (multiple tabs/devices), aur Clients.Client(connectionId) ek exact single connection ko. Ye granularity real-world scenarios jaise 'sirf isi order ke tracking-screen wale clients ko update bhejo' ko precisely express karne deti hai.",
  },
  {
    id: "signalr-tr-3",
    question: "IHubContext<THub> kis problem ko solve karta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Ye non-Hub classes (background services, regular business logic) ko Hub ke connected clients tak push-access deta hai, bina us code ko khud Hub banaye.",
    detailedAnswer:
      "Real-world scenarios me, push-trigger karne wala event typically Hub ke andar nahi hota — jaise ek naya order database me insert hua, ek OrderService class ke andar. Bina IHubContext<THub> ke, is class ke paas Hub ke connected clients ko notify karne ka koi seedha tarika nahi hota. IHubContext<THub> ko DI se inject karke, koi bhi service class Clients.All/Group/User ke through push kar sakta hai — effectively Hub ki client-communication capability ko Hub class ke bahar bhi accessible bana deta hai.",
  },
  {
    id: "signalr-tr-4",
    question: "Ek team har feature ke liye SignalR use karne ka decision leti hai, chahe wo genuinely real-time ho ya nahi. Ye approach kahan problematic ho sakti hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "SignalR persistent-connection management, scaling considerations (sticky sessions ya backplane jaise Redis for multi-instance), aur complexity add karta hai jo genuinely simple, infrequent-update use cases ke liye unnecessary overhead hai.",
    detailedAnswer:
      "SignalR persistent connections maintain karta hai jo server-side resources consume karte hain (memory, connection tracking), aur multi-instance deployments me ek backplane (jaise Redis) chahiye hota hai taaki ek instance pe connect hua client doosri instance se triggered push bhi receive kar sake. Ye genuine infrastructure complexity hai. Agar actual requirement sirf 'har kuch minute me check karo naya data hai ya nahi' hai (jahan turant push genuinely zaroori nahi), plain polling ya ek simpler mechanism kaafi hota hai bina is complexity ke. SignalR ko default-choice banane ke bajaye, actual latency/interactivity requirement ke against evaluate karna chahiye.",
    redFlag: "'Real-time-ish' kisi bhi feature ke liye automatically SignalR reach for karna bina simpler alternatives (polling, SSE) ke trade-offs consider kiye.",
  },
  {
    id: "signalr-tr-5",
    question: "Kya SignalR Hubs authentication/authorization support karte hain, aur kaise?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Haan — [Authorize] attribute Hub class/methods pe lag sakta hai, aur Context.User se authenticated user ki ClaimsPrincipal identity access hoti hai, existing ASP.NET Core auth ke saath integrated.",
    detailedAnswer:
      "SignalR ASP.NET Core ke existing authentication middleware/pipeline ke saath directly integrate hota hai — connection establish hote waqt existing auth mechanism (jaise JWT bearer, cookie) evaluate hoti hai, aur agar valid ho, Hub methods ke andar Context.User se poori ClaimsPrincipal identity access ki ja sakti hai (roles, claims sab). [Authorize] attribute Hub class ya specific methods pe lagaya ja sakta hai taaki sirf authenticated (ya specific role/policy wale) clients hi connect/invoke kar sakein.",
  },
  {
    id: "signalr-tr-6",
    question: "Ek live order-tracking feature design karo — customer app ko real-time location updates milne chahiye sirf apne khud ke active order ke liye, na ki sab orders ke. SignalR se ye kaise implement karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Har order ke liye ek unique Group banao (jaise order ID se named), customer ko us group me add karo connect hote waqt, aur location updates sirf us specific group ko push karo.",
    detailedAnswer:
      "Jab customer apni order-tracking screen open kare (Hub se connect ho), OnConnectedAsync me (ya ek explicit Hub method call se) unhe Groups.AddToGroupAsync(Context.ConnectionId, $\"order-{orderId}\") se ek order-specific group me add karo. Jab delivery-partner ki location update ho (typically ek background/service layer se), IHubContext<TrackingHub>.Clients.Group($\"order-{orderId}\").SendAsync(\"LocationUpdate\", newLocation) call karo. Ye ensure karta hai sirf us specific order ko track kar rahe clients ko update mile, baaki sab connected clients ko nahi — Clients.All use karna yahan galat hota, sabko sab orders ke updates bhej deta.",
  },
  {
    id: "signalr-tr-7",
    question: "Long Polling fallback kaise kaam karta hai, aur ye WebSockets se kaise fundamentally alag experience deta hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer: "Long polling me client ek request bhejta hai jo server naye data aane tak (ya timeout tak) hold rakhta hai, phir response milte hi client turant naya request bhej deta hai — WebSockets ek genuinely persistent, open connection hai bina repeated request-cycle ke.",
    detailedAnswer:
      "Long polling ek HTTP request-response cycle hi hai, lekin server jaanbujh kar response ko turant nahi bhejta — jab tak koi naya data available na ho ya ek timeout na ho jaaye. Response milte hi (data ke saath, ya empty timeout ke saath) client turant ek naya request bhej deta hai, cycle repeat karta hai. Ye WebSockets se zyada overhead rakhta hai (har 'poll cycle' ek naya HTTP request/response hai, headers samet), aur thoda zyada latency (request round-trip time involved hai). WebSockets ek connection ko genuinely open rakhta hai — data kisi bhi direction me bina naya request/response cycle ke turant bheja ja sakta hai, minimal overhead ke saath.",
  },
  {
    id: "signalr-tr-8",
    question: "Multi-instance (horizontally scaled) deployment me SignalR use karne ka kya challenge hai, aur ise kaise solve karte hain?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "Ek client Instance A se connected ho sakta hai, jabki push-trigger karne wala event Instance B pe process ho — bina coordination ke, Instance B ka push Instance A ke client tak nahi pahunch sakta. Solution: ek backplane (jaise Redis) jo instances ke beech messages relay karta hai.",
    detailedAnswer:
      "SignalR connections in-memory, per-instance state hote hain by default — agar client Instance A se WebSocket connection maintain kar raha hai, aur ek order-created event Instance B pe (jahan us request ko load balancer ne route kiya) trigger hota hai, Instance B directly Instance A ke connected client ko push nahi kar sakta kyunki unke beech koi shared state nahi hai. SignalR ka Redis backplane (ya Azure SignalR Service, jo managed solution hai) is problem ko solve karta hai — sab instances ek shared Redis pub/sub channel se connect hote hain, isliye koi bhi instance pe trigger hua push automatically sab instances ko relay ho jaata hai, jo phir apne respective connected clients ko deliver kar dete hain.",
  },
];

export default questions;
