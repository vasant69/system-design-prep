import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "query-params-for-filters-and-pagination-1",
    question: "Route param (`:id`) aur query param (`?page=2`) me kya farak hai?",
    options: [
      "Koi farak nahi",
      "Route param path ka required, order-sensitive hissa hai (resource identity); query param optional aur order-independent hai (filters, page, sort, tab)",
      "Query params sirf POST requests me kaam karte hain",
      "Route params optional hote hain, query params required",
    ],
    correctIndex: 1,
    explanation:
      "Missing route param = no route match / 404. Missing query param = bas default value. Isliye `:id` resource identify karta hai, aur `?search=&page=&sort=` view state capture karte hain.",
    difficulty: "easy",
  },
  {
    id: "query-params-for-filters-and-pagination-2",
    question: "`router.navigate([], { queryParams: { page: 2 } })` (bina `queryParamsHandling`) kya karta hai baaki query params ke saath?",
    options: [
      "Unhe preserve karta hai",
      "Unhe hata deta hai — default behaviour saare existing query params ko replace kar deta hai; baaki rakhne ke liye `queryParamsHandling: 'merge'` chahiye",
      "Unhe merge karta hai",
      "Error deta hai",
    ],
    correctIndex: 1,
    explanation:
      "Default me `queryParams` object poore query string ko replace karta hai. Filter update karte waqt `queryParamsHandling: 'merge'` zaroori hai warna `search`, `sort` etc. gayab ho jaate hain.",
    difficulty: "medium",
  },
  {
    id: "query-params-for-filters-and-pagination-3",
    question: "Empty search box par URL saaf rakhne ke liye kya karte hain?",
    options: [
      "`queryParams: { search: '' }`",
      "`queryParams: { search: value || null }` — `null` value us param ko URL se remove kar deti hai",
      "`queryParams: { search: undefined }` hamesha kaam karta hai",
      "Kuch nahi kar sakte, `?search=` rahega",
    ],
    correctIndex: 1,
    explanation:
      "`null` (aur `undefined`) query param ko URL se hata deta hai. `''` `?search=` chhod deta hai (ganda, aur 'search for empty string' semantics). Isliye `value || null`.",
    difficulty: "medium",
  },
  {
    id: "query-params-for-filters-and-pagination-4",
    question: "Search box har keystroke par `router.navigate` karta hai. `replaceUrl: true` na dene par kya problem?",
    options: [
      "Kuch nahi",
      "Har keystroke ek nayi browser history entry banata hai — user ko search se bahar aane ke liye back button bahut baar dabana padta hai. `replaceUrl: true` + debounce isse rokta hai",
      "URL encode nahi hota",
      "Query params merge nahi hote",
    ],
    correctIndex: 1,
    explanation:
      "`replaceUrl: true` current history entry ko update karta hai push karne ke bajaye. Debounce ke saath, ek search session ek hi meaningful history entry banata hai, spam nahi.",
    difficulty: "medium",
  },
];

export default quiz;
