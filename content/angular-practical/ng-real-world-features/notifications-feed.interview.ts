import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "nf-1",
    question: "Ek notifications feature ko kaise architect karoge — toasts aur feed?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Two separate parts. Toasts: a `Subject<Toast>` service + one `<toast-host>` near the root, auto-dismiss. Feed: a `NotificationStore` (root) holding `items` + derived `unread`, refreshed by polling (`interval` + `switchMap`, paused when the tab is hidden), with optimistic `markRead`/`markAllRead`. The header badge reads `store.unread()`.",
    detailedAnswer:
      "Keeping them separate matters: toasts are ephemeral client events (a `Subject`, no persistence); the feed is server state (a store, persisted, unread tracking). One store means the badge and the dropdown list can't disagree. Clicking a feed item optimistically marks it read and navigates to its target. Transport is a separate decision (polling / SSE / WebSocket) that the store encapsulates — components don't care how items arrive.",
    followUp: "Toast ko route change par dismiss karna chahiye ya persist? Kis basis par?",
  },
  {
    id: "nf-2",
    question: "Polling vs SSE vs WebSocket — trade-offs aur decision criteria.",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Polling: pull, seconds of delay, trivial infra, wasteful when nothing changed (mitigate with `?since=` / conditional requests). SSE: server→client push, instant, one connection, built-in auto-reconnect, one-way only, HTTP/1.1 connection limits. WebSocket: bidirectional, lowest latency, but you own reconnect/heartbeat/auth and need WS infra.",
    detailedAnswer:
      "Decision: does the feature genuinely need sub-second updates? Notifications/badges — almost never; poll every 20-60s, paused when hidden. Live dashboards, approvals that must appear instantly — SSE. Chat, collaborative editing, presence, typing indicators — WebSocket. Cost scales with real-time-ness: polling is a cron; WebSocket is a stateful connection per user you must scale, authenticate (token in the URL or first message), heartbeat, and reconnect with backoff. Start at polling; each upgrade should be justified by a real UX requirement.",
    followUp: "SSE ke HTTP/1.1 connection limit (6 per domain) ko HTTP/2 kaise solve karta hai?",
  },
  {
    id: "nf-3",
    question: "Polling pipeline ko Angular me efficiently kaise likhoge? Battery/server-friendly.",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`interval(30_000).pipe(startWith(0), filter(() => document.visibilityState === 'visible'), switchMap(() => api.getFeed()), retry({ delay: 5000 }), takeUntilDestroyed())` in a root store. Also listen to `visibilitychange` to refetch immediately on return, and back off on repeated errors.",
    detailedAnswer:
      "Refinements: (1) `?since=<lastSeenTimestamp>` so the server returns only deltas and a `304` when nothing changed; (2) exponential backoff on errors (`retry` with an increasing delay) so an outage doesn't get a request every 30s; (3) pause on `navigator.onLine === false`; (4) a single poller in the store, never per-component; (5) on `visibilitychange` → visible, trigger an out-of-cycle fetch. Use a `Subject` you `next()` on visibility change and `merge` it with the interval so both drive the same `switchMap`.",
    followUp: "`interval` + `switchMap` me agar ek request 40s le (interval 30s) to kya hota hai?",
  },
  {
    id: "nf-4",
    question: "Optimistic `markRead` implement karo. Failure par kya?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "Update the store first (`items` map to `read: true`, `unread--`), then `api.markRead(id).subscribe({ error: () => rollback })`. On failure, revert that item + increment `unread`, maybe a subtle toast. For `markAllRead`, snapshot the unread ids so you can restore precisely on failure.",
    detailedAnswer:
      "`markRead` is low-stakes, so many apps fire-and-forget and don't even roll back (a stale 'read' flag corrects on the next poll). If you do roll back: `const prev = this.state(); optimistic update; api.markRead(id).subscribe({ error: () => this.state.set(prev) })`. `markAllRead`: capture `const unreadIds = items.filter(i => !i.read).map(i => i.id)` before clearing, so a partial failure can restore exactly those. The next poll is the ultimate reconciler — the server is the source of truth.",
    followUp: "Do tabs khule hon aur ek me markAllRead ho — doosra tab kab update hoga?",
  },
  {
    id: "nf-5",
    question: "SSE connection ko Angular Observable me kaise wrap karoge, aur teardown/reconnect?",
    type: "coding",
    difficulty: "advanced",
    shortAnswer:
      "`new Observable(sub => { const es = new EventSource(url, { withCredentials: true }); es.onmessage = e => sub.next(JSON.parse(e.data)); es.onerror = e => sub.error(e); return () => es.close(); })`. `EventSource` auto-reconnects on transient drops; wrap with `retry({ delay })` for hard errors, and `takeUntilDestroyed()` for teardown.",
    detailedAnswer:
      "The teardown function (`return () => es.close()`) runs on `unsubscribe` — critical, or connections leak. `EventSource` reconnects itself with the `Last-Event-ID` header for missed messages if the server sends `id:` lines. For fatal errors (auth expired, 4xx) `onerror` fires and you should `retry` with backoff or re-authenticate. Auth: `EventSource` can't set headers, so pass the token via a cookie (`withCredentials`) or a query param (less ideal). Merge the SSE stream into the same store `switchMap`/`scan` that polling used, so the rest of the app is unchanged.",
    followUp: "`EventSource` headers set nahi kar sakta — JWT auth kaise pass karoge SSE me?",
  },
];

export default questions;
