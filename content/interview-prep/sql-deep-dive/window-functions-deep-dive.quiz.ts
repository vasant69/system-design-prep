import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "window-1",
    question: "PARTITION BY (window function ke andar) aur GROUP BY mein sabse bada difference kya hai?",
    options: [
      "Dono exactly same kaam karte hain, sirf syntax alag hai",
      "PARTITION BY rows ko collapse nahi karta, har row preserved rehti hai; GROUP BY rows ko groups mein collapse kar deta hai",
      "PARTITION BY sirf text columns pe kaam karta hai, GROUP BY sirf numbers pe",
      "GROUP BY hamesha window function ke andar hi use hota hai",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — yeh core distinction hai: window function ka PARTITION BY input row count ko preserve karta hai, har row ko uske partition ka aggregate value attach kar deta hai, jabki GROUP BY rows ko collapse karke ek row per group bana deta hai. A galat hai, output row count clearly different hota hai. C galat hai, data type se koi relation nahi. D galat hai, GROUP BY independently bhi use hota hai, window function ke bina.",
    difficulty: "medium",
  },
  {
    id: "window-2",
    question: "Agar teen posts ka views count tie ho (sabse top pe), to ROW_NUMBER, RANK, aur DENSE_RANK teenon kya value denge?",
    options: [
      "Teenon function same values denge kisi bhi case mein",
      "ROW_NUMBER: 1,2,3 (arbitrary); RANK: 1,1,1 phir agla row 4; DENSE_RANK: 1,1,1 phir agla row 2",
      "ROW_NUMBER hamesha error dega ties pe",
      "RANK aur DENSE_RANK dono hamesha same result dete hain, sirf ROW_NUMBER alag hai",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — ROW_NUMBER ties ko arbitrary sequential numbers deta hai, RANK tied rows ko same rank deta hai lekin agle rank mein gap chhodta hai (1,1,1,4), DENSE_RANK same rank deta hai bina gap ke (1,1,1,2). A galat hai, teenon ka tie-handling clearly different hai. C galat hai, ROW_NUMBER ties pe error nahi deta, bas arbitrary order mein number deta hai. D galat hai, RANK aur DENSE_RANK bhi ek dusre se different hote hain jab ties ke baad agla number aata hai.",
    difficulty: "hard",
  },
  {
    id: "window-3",
    question: "Har category ka top 3 highest-revenue product nikaalna hai. Yeh WHERE rn <= 3 directly same query mein kyun nahi likh sakte jahan ROW_NUMBER() OVER (...) AS rn compute ho raha hai?",
    options: [
      "SQL mein WHERE clause total 3 conditions se zyada support nahi karta",
      "Window functions WHERE se pehle available nahi hoti — WHERE logically window function evaluation se pehle chalta hai, isliye CTE ya subquery zaroori hai",
      "ROW_NUMBER function sirf ORDER BY ke saath kaam karta hai, WHERE ke saath nahi",
      "PARTITION BY aur WHERE ek saath kabhi use nahi ho sakte",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — window functions logically WHERE ke baad evaluate hoti hain, isliye same-level WHERE unhe reference nahi kar sakta; is column (rn) ko filter karne ke liye ek CTE ya subquery mein wrap karke outer query mein WHERE lagana padta hai. A galat hai, yeh koi arbitrary limit nahi hai SQL mein. C galat hai, ROW_NUMBER ka WHERE se koi direct incompatibility nahi hai, issue evaluation order ka hai. D galat hai, PARTITION BY aur WHERE saath use ho sakte hain, bas alag purpose ke liye.",
    difficulty: "medium",
  },
  {
    id: "window-4",
    question: "SUM(daily_revenue) OVER (ORDER BY order_date) query mein ORDER BY ka kya effect hai?",
    options: [
      "Koi effect nahi, sirf result ko sort karta hai display ke liye",
      "Yeh running/cumulative total banata hai — har row tak ka sum, default frame ki wajah se (start se current row tak)",
      "Yeh error dega kyunki SUM ke saath ORDER BY allowed nahi",
      "Yeh poori table ka ek hi grand total har row pe repeat karega",
    ],
    correctIndex: 1,
    explanation: "Sahi answer B hai — jab SUM() OVER mein ORDER BY diya jaata hai bina explicit frame ke, default frame 'start of partition to current row' ban jaata hai, jisse ek running/cumulative total ban jaata hai. A galat hai, ORDER BY yahan sirf display sorting nahi hai, yeh frame define karta hai jo actual computation change karta hai. C galat hai, yeh valid aur bahut common SQL pattern hai. D galat hai, woh tab hota jab ORDER BY diya hi na jaata (sirf PARTITION BY ke saath poori partition ka fixed total repeat hota).",
    difficulty: "medium",
  },
];

export default quiz;
