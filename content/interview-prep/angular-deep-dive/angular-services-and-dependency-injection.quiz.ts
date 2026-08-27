import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "di-services-1",
    question: "`@Injectable({ providedIn: 'root' })` ka kya matlab hai?",
    options: [
      "Har component ko service ka apna alag instance milega",
      "Poore application me sirf ek hi singleton instance banega, aur unused hone pe ye tree-shakeable bhi hai",
      "Service sirf AppComponent ke andar hi use ho sakti hai",
      "Service ko manually har jagah 'new' karna padega",
    ],
    correctIndex: 1,
    explanation: "providedIn: 'root' Angular ko batata hai ki ye service root injector level pe registered ho, jisse pura app ek hi shared instance use karta hai, aur agar koi bhi component isko import/use nahi karta to build ke waqt ye bundle se tree-shake ho jaata hai.",
    difficulty: "easy",
  },
  {
    id: "di-services-2",
    question: "Ek `CheckoutComponent` apne `providers: [CartService]` array me `CartService` list karta hai. Agar `CheckoutComponent` do baar independently render ho (jaise ek modal me aur ek page pe), to kya hoga?",
    options: [
      "Dono jagah exact same CartService instance share hogi",
      "Har render ke liye ek naya, isolated CartService instance banega — dono ka state alag hoga",
      "Doosri baar render karne pe error aayega",
      "CartService sirf pehli baar hi provide hogi, doosri baar undefined milega",
    ],
    correctIndex: 1,
    explanation: "Component-level providers har component instantiation ke saath ek naya injector, aur isliye ek naya service instance create karte hain. Dono renders ka CartService state completely isolated rahega — root-provided service ke ulat, jahan sirf ek instance pura app share karta hai.",
    difficulty: "medium",
  },
  {
    id: "di-services-3",
    question: "Ek config string (jaise API base URL) ko constructor injection ke through provide karne ke liye kya use karna padta hai, aur kyun?",
    options: [
      "Directly type string use karke inject kar sakte hain, koi extra step nahi chahiye",
      "InjectionToken banani padti hai, kyunki TypeScript ke primitive types (string, interface) runtime pe exist nahi karte jise Angular resolve kar sake",
      "Sirf @Injectable class hi inject ho sakti hai, strings kabhi nahi",
      "@HostListener use karna padta hai",
    ],
    correctIndex: 1,
    explanation: "TypeScript types compile time pe erase ho jaate hain, isliye runtime pe Angular ke DI system ke paas 'string' jaisa koi identifier nahi hota resolve karne ke liye. InjectionToken ek runtime-existing unique identifier create karta hai jise provider aur @Inject() dono reference kar sakte hain.",
    difficulty: "hard",
  },
  {
    id: "di-services-4",
    question: "Agar ek service kahin bhi injector chain me provide nahi ki gayi (na root pe, na kisi component/module pe), to component isko constructor me request karne pe kya hoga?",
    options: [
      "Compile-time error, build hi fail ho jaayega",
      "Runtime pe NullInjectorError throw hoga",
      "Service silently undefined ho jaayegi bina kisi error ke",
      "Angular automatically ek default empty instance bana dega",
    ],
    correctIndex: 1,
    explanation: "DI resolution runtime pe hoti hai — agar injector tree me top tak koi provider nahi milta, Angular runtime pe NullInjectorError throw karta hai. Ye compile-time check nahi hai, isliye missing providers aksar sirf app run karne pe hi pakde jaate hain.",
    difficulty: "medium",
  },
];

export default quiz;
