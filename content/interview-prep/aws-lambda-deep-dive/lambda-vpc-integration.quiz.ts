import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "lambda-vpc-1",
    question: "Lambda function ko RDS instance (private subnet me) se connect karne ke liye kya karna zaroori hai?",
    options: [
      "Kuch nahi, Lambda by default sabhi VPC resources reach kar sakta hai",
      "Function ko usi VPC ke subnets aur security groups ke saath configure karna, taaki ENI attach ho aur security group rules se traffic allow ho",
      "RDS instance ko public subnet me move karna",
      "Sirf RDS security group me 0.0.0.0/0 allow karna, Lambda config change ki zaroorat nahi",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — Lambda default managed VPC me chalta hai jahan se private subnet resources reachable nahi, isliye function ko explicitly target VPC ke subnet IDs aur security group IDs ke saath configure karna padta hai. Option 1 galat hai, private resources default se reachable nahi. Option 3 database ko insecurely public karta hai. Option 4 galat hai, Lambda side ka VPC config bhi zaroori hai.",
    difficulty: "easy",
  },
  {
    id: "lambda-vpc-2",
    question: "2019 se pehle VPC-attached Lambda cold starts itne slow kyun the?",
    options: [
      "Lambda service tab exist hi nahi karti thi",
      "Har unique subnet+security-group combination ke liye naya ENI create karna padta tha jo 10 second se 1 minute+ le sakta tha",
      "VPC Lambda hamesha 900 second timeout use karta tha",
      "Memory allocation VPC Lambda ke liye kam thi",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — ENI creation ek slow EC2 API operation hai, aur pehle har naye execution environment ko apna dedicated ENI chahiye hota tha unique subnet+SG combination ke liye. Hyperplane ENI (2019) ne shared, pre-created ENIs introduce kiye jo is problem ko fix kiya. Options 1, 3, aur 4 factually galat hain.",
    difficulty: "medium",
  },
  {
    id: "lambda-vpc-3",
    question: "Ek Lambda function VPC me configure kiya gaya RDS access ke liye, lekin ab wo external Stripe API call nahi kar pa raha (timeout ho raha hai). Sabse likely root cause kya hai?",
    options: [
      "Stripe API down hai",
      "Lambda ka timeout bahut kam set hai",
      "VPC me attach hone se function ne default internet access khoo diya, aur NAT Gateway (ya equivalent route) configure nahi kiya gaya",
      "RDS connection Stripe call ko block kar raha hai",
    ],
    correctIndex: 2,
    explanation: "Sahi jawab option 3 hai — jaise hi function VPC me configure hota hai, wo private subnet se hi operate karta hai aur default internet route nahi hota jab tak NAT Gateway (ya applicable endpoint) na ho. Ye ek bahut common production gotcha hai. Options 1, 2, aur 4 possible ho sakte hain lekin diye gaye context me sabse likely aur classic cause NAT Gateway missing hona hai.",
    difficulty: "medium",
  },
  {
    id: "lambda-vpc-4",
    question: "Lambda function ko sirf S3 aur DynamoDB access karna hai (koi RDS ya private resource nahi), VPC ke andar se. Cost-efficient approach kaunsi hai?",
    options: [
      "NAT Gateway lagao, saari traffic usse route karo",
      "Gateway VPC Endpoint use karo S3 aur DynamoDB ke liye — free, aur traffic AWS backbone pe rehta hai",
      "Function ko VPC me hi mat rakho aur alag se ek EC2 proxy banao",
      "Interface Endpoint use karo har service ke liye, sabse sasta option yahi hai",
    ],
    correctIndex: 1,
    explanation: "Sahi jawab option 2 hai — S3 aur DynamoDB ke liye Gateway VPC Endpoints available hain jo free hain aur NAT Gateway ki zaroorat khatam karte hain in specific services ke liye. Option 1 unnecessarily NAT Gateway cost add karta hai. Option 3 overkill hai. Option 4 galat hai kyunki Interface Endpoints hourly + data charge lagate hain, Gateway Endpoints se mehenge.",
    difficulty: "hard",
  },
];

export default quiz;
