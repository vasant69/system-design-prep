import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "r53-1",
    question: "Zone apex (naked domain, jaise myproject.com) pe CNAME record kyun nahi daal sakte?",
    options: [
      "AWS ne technically block kar rakha hai bina reason ke",
      "RFC 1034 ke hisaab se jis naam pe CNAME hai us naam pe koi doosra record nahi ho sakta, aur apex pe SOA/NS records mandatory hote hain",
      "CNAME sirf HTTP pe kaam karta hai, HTTPS pe nahi",
      "Zone apex pe records daalna hi allowed nahi hai",
    ],
    correctIndex: 1,
    explanation:
      "RFC 1034 ke rule ke hisaab se CNAME 'exclusive' hota hai — jis naam pe woh hai wahan koi aur record co-exist nahi kar sakta. Zone apex pe SOA aur NS records hamesha mandatory hote hain, isliye CNAME wahan conflict create karega. ALIAS isi problem ko solve karta hai kyunki wo protocol level pe seedha A record return karta hai. Option A factually galat hai (ye AWS ka arbitrary decision nahi, RFC-driven hai). Option C aur D dono galat premises hain.",
    difficulty: "medium",
  },
  {
    id: "r53-2",
    question: "Route 53 me DNS record change kiya, lekin user 'DNS propagation me 24-48 ghante lagte hain' bol raha hai. Ye kitna sach hai?",
    options: [
      "Poora sach hai — Route 53 khud itna time leta hai propagate karne mein",
      "Route 53 khud ~60 seconds mein globally propagate ho jaata hai; delay downstream resolvers ki cached (TTL-based) entries ki wajah se hota hai",
      "Ye sirf tab sach hai jab hosted zone private ho",
      "Propagation time record type pe depend karta hai, A record fast hota hai TXT se",
    ],
    correctIndex: 1,
    explanation:
      "Route 53 API status INSYNC ~60 seconds mein ho jaata hai — yani AWS ke saare nameservers pe change turant propagate ho jaata hai. Jo delay dikhta hai wo downstream resolvers (ISP DNS, etc.) ki cached entries ki wajah se hai jo unke TTL tak purana answer serve karte rehte hain. Option A galat hai. Option C irrelevant hai (public/private se koi lena dena nahi). Option D bhi galat premise hai — record type se propagation speed decide nahi hoti.",
    difficulty: "medium",
  },
  {
    id: "r53-3",
    question: "Multivalue Answer routing policy ko load balancer ka replacement kyun NAHI maana ja sakta?",
    options: [
      "Multivalue sirf ek IP return karta hai, load balancer nahi",
      "Multivalue sirf healthy IPs ki list return karta hai (client-side pick) — koi real-time health-based weighting, connection draining, ya SSL termination nahi hai",
      "Multivalue routing health checks support hi nahi karta",
      "Multivalue sirf private hosted zones ke liye kaam karta hai",
    ],
    correctIndex: 1,
    explanation:
      "Multivalue 8 tak healthy IPs return karta hai aur client khud ek choose karta hai — ye ek DNS-level, client-side distribution hai. Ek real load balancer traffic ke beech baithta hai, real-time health monitor karta hai, connection draining karta hai, aur SSL terminate kar sakta hai. Option A galat hai (multiple IPs return kar sakta hai). Option C galat hai — multivalue actually health checks support karta hai (Simple routing nahi karta). Option D bhi galat hai, ye public zones mein bhi kaam karta hai.",
    difficulty: "hard",
  },
  {
    id: "r53-4",
    question: "Ek failover setup mein health check interval 30 seconds hai, failure threshold 3 hai, aur DNS TTL 60 seconds hai. Total failover time approximately kitna hoga?",
    options: [
      "30 seconds", "90 seconds", "~150 seconds", "~300 seconds",
    ],
    correctIndex: 2,
    explanation:
      "Formula hai: detection time (interval × threshold) + DNS TTL = (30 × 3) + 60 = 90 + 60 = ~150 seconds. Isi wajah se failover setups mein TTL jaan-boojh kar kam (60 seconds ya usse kam) rakha jaata hai — taaki total failover time minimize ho. Options A aur B sirf detection time ka hissa hain, TTL nahi jodte. Option D overestimate hai.",
    difficulty: "hard",
  },
];

export default quiz;
