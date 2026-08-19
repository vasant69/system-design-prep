import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "pstp-1",
    question: "Image resize jobs ke liye ek pool of 10 workers hai jo ek shared queue sunte hain. Ek naya job aata hai. Point-to-point model mein kya hona chahiye?",
    options: [
      "Sabhi 10 workers ussi job ko independently process karte hain",
      "Sirf ek worker job ko uthata hai aur process karta hai, baaki 9 kuch nahi karte us job ke liye",
      "Job automatically 10 sub-tasks mein split ho jaata hai",
      "Job sabse pehle available worker ko reject kar diya jaata hai",
    ],
    correctIndex: 1,
    explanation:
      "Point-to-point (task queue) model mein workers ek doosre se compete karte hain — sirf ek worker jeetega aur job process karega, duplicate processing avoid karne ke liye. Sabhi workers ka process karna (A) wasted compute aur duplicate output create karega. Auto-split (C) aur reject (D) point-to-point ka behavior nahi hai.",
    difficulty: "easy",
  },
  {
    id: "pstp-2",
    question: "Order status change event ko notification service, analytics service, aur matching service teeno ko independently reach karna hai. Yeh kaunsa messaging pattern hai aur kyun?",
    options: [
      "Point-to-point, kyunki ek hi event hai",
      "Pub/sub, kyunki har service ek independent subscriber hai jisse apni khud ki copy chahiye event ki",
      "Point-to-point, kyunki sirf ek service ko actually respond karna hai",
      "Yeh koi messaging pattern nahi, sync API calls honi chahiye",
    ],
    correctIndex: 1,
    explanation:
      "Jab ek event multiple independent, unrelated systems ke liye relevant ho aur har ek ko apni poori copy chahiye ho, yeh pub/sub hai — publisher ko yeh jaanne ki zaroorat nahi ki kitne/kaunse subscribers hain. Point-to-point mein sirf ek consumer ko message milta, jo yahan galat hoga kyunki teeno services ko event chahiye.",
    difficulty: "medium",
  },
  {
    id: "pstp-3",
    question: "Kafka consumer groups ke baare mein sabse accurate statement kaunsa hai?",
    options: [
      "Ek hi consumer group ke andar behavior pub/sub jaisa hota hai, alag groups ke beech point-to-point",
      "Ek hi consumer group ke andar behavior point-to-point jaisa hota hai (load balanced), alag consumer groups ke beech behavior pub/sub jaisa hota hai (har group ko poora stream milta hai)",
      "Consumer groups sirf fault-tolerance ke liye hote hain, delivery pattern se unrelated",
      "Ek partition ek group ke multiple consumers ko simultaneously assign ho sakta hai",
    ],
    correctIndex: 1,
    explanation:
      "Kafka ka design: same group ke andar consumers partitions ke liye compete karte hain (load balanced, point-to-point jaisa), lekin alag-alag groups independently poora stream padhte hain (broadcast, pub/sub jaisa). Option A directions ulti hain. Option C aur D factually galat hain — ek partition ek time pe ek hi consumer instance (per group) ko assign hota hai.",
    difficulty: "hard",
  },
  {
    id: "pstp-4",
    question: "Ek team ne galti se ek broadcast use-case (order status change ko 3 services tak pahunchana) ke liye point-to-point queue use kar diya. Sabse likely symptom kya hoga?",
    options: [
      "Sabhi 3 services ko har event double milega",
      "Sirf ek service ko event milega, baaki 2 services ka state silently stale reh jaayega bina kisi visible error ke",
      "System crash ho jaayega turant",
      "Koi impact nahi padega, dono patterns functionally same hain",
    ],
    correctIndex: 1,
    explanation:
      "Point-to-point mein har message sirf ek consumer ko milta hai — agar teen services ko event chahiye tha lekin point-to-point queue use hui, sirf ek service (jo pehle message uthaye) ko milega, baaki do services ka state silently out-of-sync reh jaayega, jo debug karna especially mushkil hota hai kyunki koi explicit error nahi aata.",
    difficulty: "medium",
  },
];

export default quiz;
