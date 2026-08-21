import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "idxoltp-1",
    question: "OLTP systems (jaise core banking) mein indexing trade-off analytics warehouses se zyada acute kyun hota hai?",
    options: [
      "OLTP databases B-Tree support hi nahi karte",
      "OLTP tables read aur write dono heavy simultaneously hote hain, jabki analytics mein writes batch window tak limited hote hain",
      "Analytics databases indexes use hi nahi karte",
      "OLTP tables hamesha chhote hote hain isliye index zaroori nahi",
    ],
    correctIndex: 1,
    explanation:
      "Analytics warehouse mein bulk load ek batch window mein hota hai aur baaki time sirf reads chalte hain, isliye jitne marzi indexes daalo, write cost sirf uss window mein pay hota hai. OLTP mein reads aur writes continuously, saath-saath ho rahe hain, isliye har naya index directly live write latency badhata hai. B-Tree support (A) sab relational databases mein hota hai. Analytics databases indexes use karte hain (C galat). Table size (D) is trade-off se unrelated hai.",
    difficulty: "easy",
  },
  {
    id: "idxoltp-2",
    question: "Ek team `Transaction` table ke har column (amount, status, channel, remarks) pe index laga deti hai 'just in case' future queries ke liye. Iska sabse likely negative effect kya hoga?",
    options: [
      "Read queries slow ho jaayengi",
      "Insert/update throughput drop ho sakta hai kyunki har write ab multiple B-Tree structures update kar rahi hai",
      "Table ka data corrupt ho jaayega",
      "Kuch bhi negative nahi hoga, sirf extra storage lagega",
    ],
    correctIndex: 1,
    explanation:
      "Har additional index har insert/update pe extra B-Tree maintenance cost daalta hai — high-TPS table pe yeh throughput ceiling ko directly neeche la sakta hai. Reads (A) actually is se affect nahi hote, balki unmein se zyada tar ka koi benefit bhi nahi milta agar low-cardinality columns indexed hain. Data corruption (C) is scenario ka natural consequence nahi hai. 'Sirf storage' (D) galat hai kyunki write latency bhi directly impacted hoti hai.",
    difficulty: "medium",
  },
  {
    id: "idxoltp-3",
    question: "Ek table mein clustered index kya define karta hai?",
    options: [
      "Sirf ek in-memory cache jo query results store karta hai",
      "Table ki actual physical row ordering on disk",
      "Kitne indexes ek table pe ho sakte hain",
      "Query optimizer ka statistics cache",
    ],
    correctIndex: 1,
    explanation:
      "Clustered index table ki physical storage order define karta hai — isliye ek table mein sirf ek clustered index ho sakta hai (physical order ek hi ho sakta hai). Non-clustered indexes (ek table mein multiple ho sakte hain) separate structures hain jo row locations ko map karte hain. Options A, C, aur D clustered index ki definition se unrelated hain.",
    difficulty: "medium",
  },
  {
    id: "idxoltp-4",
    question: "Agar Transaction table ka clustering key account_id-based ho (transaction_id-based ke bajaye), to kya trade-off hota hai?",
    options: [
      "Range queries jaise 'last 30 days for this account' fast ho jaate hain, lekin insert pattern ab sequential nahi rehta aur fragmentation badh sakti hai",
      "Kuch bhi trade-off nahi hota, dono equally fast hote hain",
      "Sirf storage cost badhta hai, performance same rehti hai",
      "Reads slow ho jaate hain lekin writes fast ho jaate hain",
    ],
    correctIndex: 0,
    explanation:
      "account_id-based clustering se ek account ke saare transactions physically ek dusre ke paas store hote hain, jisse account-scoped range queries fast ho jaate hain — lekin naye transactions ab table ke end mein sequentially insert nahi hote (kisi bhi account ka transaction kabhi bhi aa sakta hai), jo page splits/fragmentation badha sakta hai. Options B, C, aur D is real trade-off ko capture nahi karte.",
    difficulty: "hard",
  },
];

export default quiz;
