import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "sb-1",
    question: "Angular XSS se kaise bachta hai by default? Kaha ye protection toot-ta hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Interpolation `{{ }}` always escapes HTML; `[innerHTML]`, `[href]`, `[src]`, `[style]` are run through `DomSanitizer` per context (dangerous tags/attributes/URLs removed). It breaks when you call `bypassSecurityTrust*` (sanitizer OFF) on content that isn't fully under your control, or feed raw user HTML into `innerHTML` via a custom pipe.",
    detailedAnswer:
      "Angular treats template values as untrusted by default, which kills the common reflected/stored XSS vectors with zero effort. The two failure modes: (1) `sanitizer.bypassSecurityTrustHtml(userHtml)` — 'trust me' — now a `<script>`/`onerror` in that HTML runs; (2) a component that does `el.nativeElement.innerHTML = value` directly, bypassing Angular entirely. Safe rich-content path: sanitize server-side with DOMPurify (tag/attr allowlist), store the clean HTML, still render through Angular's sanitizer — belt and braces. Better: store structured blocks (JSON) and render with components, removing the HTML surface.",
    followUp: "`SafeHtml` / `SafeResourceUrl` types return karne wale ek helper ko kaise review karoge?",
  },
  {
    id: "sb-2",
    question: "JWT / token ko browser me kaha store karein? Trade-offs.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Access token in memory (a signal) — small blast radius, not readable by injected script after navigation, but lost on reload. Refresh token in an `httpOnly` Secure `SameSite` cookie — JS can't read it (XSS can't steal it), needs CSRF defence. `localStorage`/`sessionStorage` = any XSS reads the token = account takeover; only a hardened fallback.",
    detailedAnswer:
      "Threat model: XSS is the common front-end compromise (a bad dependency, an `innerHTML` slip). `localStorage` fully exposes tokens to it. `httpOnly` cookies neutralise XSS token theft but open CSRF (mitigated by `SameSite=Strict/Lax` + anti-CSRF tokens for mutations). In-memory access token + `httpOnly` refresh cookie: XSS can't grab the long-lived credential, and the short access token expires in minutes. On reload, call `/auth/refresh` (cookie auto-sent) to re-obtain the access token. If cookies aren't possible, `localStorage` refresh token + strict CSP + SRI + dependency audits + sanitization discipline, and you document the accepted risk.",
    followUp: "`SameSite=Strict` refresh cookie ke saath ek external OAuth redirect flow kaise kaam karega?",
  },
  {
    id: "sb-3",
    question: "Content-Security-Policy Angular app me kaise adopt karoge? Kya break ho sakta hai?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Start with `default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'` and an allowlist for your API and any CDN. Report-only first (`Content-Security-Policy-Report-Only`) to find violations, then enforce. Breakage: inline event handlers, `eval`, inline `<script>`, CDN scripts without allowlisting, and (older setups) inline styles — Angular supports nonce/hash for its needs.",
    detailedAnswer:
      "CSP is a strong second line: even a successful XSS can't run injected scripts or exfiltrate to an unlisted host. Angular's production build doesn't need `unsafe-eval` or `unsafe-inline` for scripts. Inline styles: Angular can emit a nonce (`ngCspNonce` attribute on the root, or `CSP_NONCE` provider) so you avoid `style-src 'unsafe-inline'`. Roll out report-only, wire the `report-uri`/`report-to` endpoint, fix real violations, then flip to enforce. Add `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, and a sensible `Referrer-Policy` alongside.",
    followUp: "`ngCspNonce` / `CSP_NONCE` provider kya karta hai aur kab chahiye?",
  },
  {
    id: "sb-4",
    question: "Supply-chain / dependency risk ko ek Angular project me kaise manage karoge?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Every dependency runs with your app's privileges. Mitigate: commit a lockfile + `npm ci` in CI, `npm audit --audit-level=high` as a gate, review new deps (size, maintainers, transitive tree) before adding, keep the tree small, SRI for any CDN scripts, and Dependabot/Renovate for timely patching.",
    detailedAnswer:
      "A compromised transitive package can read `localStorage`, wrap `fetch`/`XMLHttpRequest`, inject a script, or exfiltrate form data. Concrete practices: prefer well-maintained, small libraries; check `npm ls <pkg>` for surprise transitive additions; avoid postinstall-heavy packages; pin exact versions for anything sensitive; use `overrides`/`resolutions` to force a patched transitive version; run `npm audit` and a scanner (Snyk/OSV) in CI; and treat a new dependency PR as a security review, not a rubber stamp. Also: no `<script src=cdn>` without SRI + `crossorigin`.",
    followUp: "Ek transitive dependency me high-severity vuln hai par uska koi patched version nahi — options?",
  },
  {
    id: "sb-5",
    question:
      "Feature: managers rich-text notes likh sakein jo dusre approvers dekhein. Secure design?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Don't store/render raw HTML with `[innerHTML]` + `bypassSecurityTrust`. Options: (1) sanitize on the server with DOMPurify (strict tag/attr allowlist) on save, store the clean HTML, render through Angular's sanitizer (no bypass); (2) store structured blocks (a small JSON schema) and render with components — zero HTML injection surface. Prefer (2) if the formatting needs are simple.",
    detailedAnswer:
      "The naive path (WYSIWYG -> HTML string -> `[innerHTML]` bound to it) executes any script an author embeds in every viewer's session — a stored XSS that spreads to approvers (often higher-privilege users). Server-side DOMPurify with an allowlist (`p`, `strong`, `em`, `ul`, `li`, `a[href]` with a URL scheme check) neutralises it; keeping Angular's sanitizer on is defence in depth. Structured content (blocks: paragraph, list, link) rendered by trusted components has no HTML surface at all and is easier to migrate/validate. Never trust client-side sanitization alone — the client can be bypassed.",
    followUp: "Server-side DOMPurify allowlist me `a[href]` allow karte waqt `javascript:` URLs kaise block karoge?",
  },
];

export default questions;
