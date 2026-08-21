import type { QuizQuestion } from "@/lib/types";

const quiz: QuizQuestion[] = [
  {
    id: "ses-1",
    question: "SPF pass ho gaya hai lekin email spoofed ho sakta hai. DMARC alignment iss problem ko kaise fix karta hai?",
    options: [
      "DMARC SPF ko replace kar deta hai, isliye spoofing khatam ho jaati hai",
      "SPF sirf Return-Path (envelope sender) ko check karta hai, jabki user ko From header dikhta hai — DMARC enforce karta hai ki SPF ya DKIM ka domain From header se match kare",
      "DMARC IP address ko encrypt kar deta hai isliye spoof karna mushkil ho jaata hai",
      "DMARC ka SPF/DKIM se koi lena dena nahi, wo bilkul alag mechanism hai",
    ],
    correctIndex: 1,
    explanation:
      "SPF technically pass ho sakta hai attacker ke apne domain se, jabki From header me victim ka domain dikh raha ho — ye do alag fields hain. DMARC ki asli value alignment enforce karna hai: SPF ya DKIM ka verified domain From header ke domain se match karna chahiye. Option A galat hai, DMARC SPF/DKIM ke upar layer hai, replace nahi karta. Option C galat mechanism describe karta hai. Option D galat hai — DMARC directly SPF aur DKIM ke results pe depend karta hai.",
    difficulty: "hard",
  },
  {
    id: "ses-2",
    question: "Custom MAIL FROM domain configure na karne se kya problem hoti hai?",
    options: [
      "Emails bhejna hi band ho jaata hai",
      "SPF check default me amazonses.com ke against hota hai, aapke domain ke against nahi — isse DMARC ke liye SPF alignment fail ho jaati hai",
      "DKIM signing kaam karna band kar deti hai",
      "Sandbox se production access nahi milta",
    ],
    correctIndex: 1,
    explanation:
      "Default MAIL FROM domain amazonses.com hota hai, isliye SPF check us domain ke against hota hai na ki aapke domain ke against. DMARC alignment ke liye SPF ya DKIM ka domain From header (aapka domain) se match karna zaroori hai — custom MAIL FROM configure karke SPF ko apne subdomain ke against check karvaya jaata hai jisse relaxed alignment pass ho jaata hai. Option A galat hai, DKIM alignment se DMARC phir bhi pass ho sakta hai. Option C unrelated hai, DKIM alag mechanism hai. Option D bhi unrelated concept hai.",
    difficulty: "medium",
  },
  {
    id: "ses-3",
    question: "Ek user ka email hard bounce hua. Sahi handling kya hai?",
    options: [
      "Kuch mat karo, agli baar phir try karo",
      "Address ko turant suppress karo aur dobara mat bhejo, kyunki hard bounce ka matlab address permanently invalid hai",
      "Sirf 3 baar retry karo phir suppress karo",
      "Complaint list me daal do, bounce list me nahi",
    ],
    correctIndex: 1,
    explanation:
      "Hard bounce ka matlab hai address permanently invalid hai (exist nahi karta ya domain galat hai) — repeated attempts sirf bounce rate badhayenge, jo 10% pe account-level sending pause tak le ja sakta hai. Isliye hard/permanent bounces turant aur permanently suppress karne chahiye. Soft/transient bounces (jaise mailbox full) ke liye limited retries theek hote hain, lekin hard bounce ke liye nahi. Option A aur C dono unnecessary risk lete hain bounce rate badhake. Option D categories ko galat mix karta hai.",
    difficulty: "medium",
  },
  {
    id: "ses-4",
    question: "Contact form me user ka email address `From` field me directly daala. Kya hoga?",
    options: [
      "Kaam kar jaayega, SES koi restriction nahi lagata From pe",
      "SES 'MessageRejected: Email address is not verified' error dega, kyunki From sirf verified identity ho sakti hai",
      "Email bhej diya jaayega lekin spam folder me chala jaayega",
      "SES automatically user ke email ko Reply-To me move kar dega",
    ],
    correctIndex: 1,
    explanation:
      "SES sirf verified identities (verified email ya domain) se `From` ke through bhejne deta hai. Arbitrary user email `From` me daalne se SES reject kar dega. Sahi approach hai `From` me apni verified identity (jaise noreply@myproject.com) rakhna aur user ka email `Reply-To` header me daalna — isse reply seedha user ko jaata hai aur domain authentication clean rehti hai. Options A, C, D sab galat behaviour describe karte hain; SES ye automatically fix nahi karta.",
    difficulty: "easy",
  },
];

export default quiz;
