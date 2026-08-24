import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "choosing-collection-tr-1",
    question: "Ek high-level framework do jisse tum kisi bhi naye scenario me sahi collection choose kar sako, sirf specific collections yaad rakhe bina.",
    type: "conceptual",
    difficulty: "intermediate",
    askedAt: ["TCS", "Infosys", "Amazon", "Microsoft"],
    shortAnswer: "Pehle actual access pattern identify karo (index/key/uniqueness/ordering/insertion-position), phir us pattern ko internal data structure se map karo (contiguous memory = index-fast, hash table = key-fast, linked nodes = known-position-insert-fast, tree = sorted-fast).",
    detailedAnswer:
      "Framework: (1) Poocho — mujhe kya chahiye: index se access, key se lookup, sirf uniqueness, hamesha sorted order, ya frequent known-position insertion? (2) Us requirement ko matching internal data structure se jodo — contiguous memory (Array/List) index-access-optimized hai, hash table (Dictionary/HashSet) key/membership-optimized hai, linked nodes (LinkedList) known-position-insertion-optimized hai, balanced tree (Sorted*) sorted-order-optimized hai. (3) Reasoning bolo, sirf naam nahi — 'kyun' fast hai wo dikhao. Ye approach kisi bhi naye, unseen scenario pe generalize ho jaata hai.",
    followUp: "Agar mujhe do access patterns EK SAATH chahiye ho, tab kya karoge?",
  },
  {
    id: "choosing-collection-tr-2",
    question: "Ek e-commerce checkout system me cart items ko store karna hai jahan: (a) fast add/remove chahiye, (b) duplicate products avoid karne hain, (c) total item count fast chahiye. Kaunsa collection design karoge?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "`Dictionary<ProductId, CartItem>` — ProductId key se O(1) add/remove/lookup, keys automatically unique (duplicate-avoid), aur `.Count` O(1) hai.",
    detailedAnswer:
      "`Dictionary<ProductId, CartItem>` teeno requirement satisfy karta hai ek saath: Dictionary keys inherently unique hoti hain (duplicate ProductId automatically overwrite/reject ho jaata hai, depending on chosen Add pattern), `Add`/`Remove`/lookup sab O(1) average key ke through, aur `.Count` property O(1) hai. Agar sirf `List<CartItem>` use karte, duplicate-check manually O(n) hota har add pe, aur remove bhi O(n).",
  },
  {
    id: "choosing-collection-tr-3",
    question: "Ye trick question hai — ek naya developer kehta hai 'HashSet<T> hamesha List<T> se better hai kyunki O(1) hai.' Ismein kya galat hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Oversimplified — HashSet sirf membership/uniqueness ke liye better hai. Agar ordering, duplicates, ya index access chahiye, List (ya koi doosra collection) sahi choice hoga. 'O(1) hamesha better' ek incomplete mental model hai.",
    detailedAnswer:
      "Big-O sirf ek dimension hai (typically membership-check speed), lekin har collection ke apne trade-offs hain. `HashSet<T>` koi ordering guarantee nahi deta, duplicates allow nahi karta, aur index-based access support nahi karta — agar tumhe ordered sequence ya duplicates ki zaroorat hai, `HashSet` galat choice hai chahe uska Contains fast ho. 'Sabse fast collection' ek meaningless concept hai bina context ke — sahi sawaal hamesha 'is specific access pattern ke liye kaunsa best hai' hai.",
    redFlag: "Kisi bhi collection ko universally 'best' bolna bina access-pattern context ke — ye batata hai trade-off-based thinking nahi hai.",
  },
  {
    id: "choosing-collection-tr-4",
    question: "Ek graph traversal implement karna hai — BFS ke liye kaunsa collection use karoge, DFS ke liye kaunsa, aur kyun?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer: "BFS ke liye `Queue<T>` (FIFO — pehle-discovered node pehle process hota hai). DFS ke liye `Stack<T>` (LIFO — sabse recently-discovered node pehle explore hota hai), ya recursion (jo internally call-stack use karta hai, conceptually same).",
    detailedAnswer:
      "BFS (Breadth-First Search) level-by-level explore karta hai — jo node pehle discover hua, wahi pehle process hona chahiye, exactly FIFO semantics, isliye `Queue<T>` natural fit hai. DFS (Depth-First Search) ek path ko poora explore karta hai pehle wapas aane se pehle — jo node sabse recently discover hua, wahi pehle explore hota hai, exactly LIFO semantics, isliye `Stack<T>` (ya equivalent recursion, jo runtime ka apna call stack use karta hai) natural fit hai.",
  },
  {
    id: "choosing-collection-tr-5",
    question: "Ek reporting dashboard ko top-10 highest-value transactions hamesha maintain karke rakhni hai, real-time incoming transactions ke saath (naya transaction aa sakta hai jo list me insert ho ya na ho). Kaunsa collection approach loge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "`SortedSet<Transaction>` (ya ek min-heap-jaisa structure) — hamesha sorted state maintain karta hai O(log n) insert ke saath, aur agar size 10 se badh jaaye, smallest ko remove kar sakte ho.",
    detailedAnswer:
      "`SortedSet<Transaction>` (custom `IComparer<Transaction>` value ke basis pe) genuinely fit hai — har naya transaction insert hone par O(log n) me sahi sorted position pe chala jaata hai. Agar `Count > 10` ho jaaye, `Min` (ya first element, comparer ke direction ke hisaab se) remove kar do — ye top-10 ko maintain karta hai bina baar-baar poori list re-sort kiye. Ek `List<T>` + manual `.Sort()` har insert ke baad much slower hota (O(n log n) per insert vs O(log n)).",
    followUp: "Agar `SortedSet` me duplicates (same value wale, alag transactions) ho sakte hon, kya problem aa sakti hai?",
  },
  {
    id: "choosing-collection-tr-6",
    question: "Chhote datasets (10-15 items) ke liye kya HashSet aur List ka performance-difference practically matter karta hai?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer: "Nahi, practically nahi — chhote n ke liye constant-factor overhead (hashing computation) List ke simple linear scan se zyada bhi ho sakta hai. Ye distinction bade datasets/high-frequency operations me hi genuinely matter karta hai.",
    detailedAnswer:
      "Big-O asymptotic behavior batata hai — bade `n` ke liye trends. Chhote, fixed-size collections (jaise 10-15 items) ke liye, `List<T>.Contains()`'s O(n) linear scan itna chhota hai ki `HashSet<T>`'s hashing overhead (hash computation, bucket lookup) se practically indistinguishable ya kabhi-kabhi slower bhi ho sakta hai constant-factor overhead ki wajah se. Ye distinction genuinely tab matter karta hai jab dataset bada ho (thousands+) ya operation bahut high-frequency ho (tight loops, per-request hot paths). Over-optimizing chhote, rarely-hit collections ke liye premature optimization ho sakta hai.",
    redFlag: "Har jagah blindly 'HashSet fast hai' bolna bina consider kiye ki dataset size aur access-frequency genuinely matter karte hain ya nahi is specific context me.",
  },
  {
    id: "choosing-collection-tr-7",
    question: "Ye poora module cover karne ke baad — agar interviewer poochhe 'sabse important cheez jo tum is topic se le kar jaa rahe ho,' kya answer doge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer: "Har collection ka performance profile uske internal data structure (contiguous memory vs hash table vs linked nodes vs tree) ka direct, explainable consequence hai — collection choice ek REASONING exercise hai, memorization nahi.",
    detailedAnswer:
      "Sabse important takeaway: collections 'arbitrary features ka bag' nahi hain, unka har Big-O characteristic seedha unke internal implementation se aata hai. Ye samajh lene ke baad, koi bhi naya collection (chahe interview me pehli baar naam suna ho) predict kiya ja sakta hai — 'ye kaisa store karta hai data internally?' poochkar hi uska performance profile derive kiya ja sakta hai. Ye rote-learning se bahut zyada resilient approach hai kisi bhi naye ya twisted scenario ke liye.",
  },
  {
    id: "choosing-collection-tr-8",
    question: "Ek real-time chat application me 'online users' ka set maintain karna hai jise (a) frequently add/remove karna hai users join/leave karte waqt, (b) frequently check karna hai 'kya user X online hai,' aur (c) UI me alphabetically sorted list dikhani hai. Design karo.",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer: "`HashSet<string> onlineUsers` fast add/remove/membership-check ke liye; UI display ke waqt `onlineUsers.OrderBy(name => name)` (LINQ) se on-demand sorted list generate karo — hamesha-sorted collection maintain karna unnecessary hai agar sorting sirf display-time pe chahiye.",
    detailedAnswer:
      "Core operations (join/leave/membership-check) `HashSet<string>` se O(1) average ho jaate hain — ye sabse frequent operations hain, isliye inhe optimize karna priority hai. Sorted display ek LESS frequent operation hai (sirf UI-render pe chahiye, har add/remove pe nahi) — isliye `SortedSet<string>` maintain karna (jo har insert O(log n) banata) overkill hai. Better approach: `HashSet` maintain karo fast core-operations ke liye, aur jab display chahiye ho, `.OrderBy()` se on-demand sort karo — ye 'optimize for the frequent operation' principle ka concrete example hai.",
    followUp: "Agar sorted-display bhi HAR SECOND real-time update hoti (high frequency), kya approach badalta?",
  },
];

export default questions;
