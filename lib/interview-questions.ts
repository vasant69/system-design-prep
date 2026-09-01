// Full Stack Interview Prep — Complete Question Bank.
//
// Verbatim transcription of the user-provided "Full Stack Interview Prep"
// document (Full Stack Developer, 4+ yrs Fintech; SQL / Angular / Node.js /
// ASP.NET Core Web API). No answers by design — each item carries the
// follow-ups an interviewer would drill into. Rendered as-is by
// app/interview-mode/page.tsx.

export type IQQuestion = { q: string; followups?: string[] };

export type IQCategory = {
  id: string;
  number: number;
  /** Display override for the number label, e.g. "16b". Falls back to `number`. */
  numLabel?: string;
  title: string;
  note?: string;
  questions: IQQuestion[];
};

export type IQPart = {
  id: string;
  label: string;
  title: string;
  blurb?: string;
  categories: IQCategory[];
};

export const INTERVIEW_PREP_META = {
  title: "Full Stack Interview Prep — Complete Question Bank",
  profile:
    "Full Stack Developer, 4+ yrs Fintech experience | Stack: SQL, Angular, Node.js, ASP.NET Core Web API",
  scope:
    "Everything a technical interview loop for this profile can realistically touch — core stack (theory + practical), system design, DSA basics, and the cross-cutting engineering topics (auth, security, patterns, DevOps, cloud) that senior-ish full-stack rounds pull from.",
  disclaimer:
    "No answers included by design — each item has follow-ups nested under it the way a real interviewer drills deeper. Question count is intentionally large; skim first, then go deep only where you're weak.",
};

export const INTERVIEW_PREP_PARTS: IQPart[] = [
  {
    id: "part-a",
    label: "Part A",
    title: "Core Stack",
    categories: [
      {
        id: "sql-theoretical",
        number: 1,
        title: "SQL — Theoretical",
        questions: [
          {
            q: "Explain all types of joins: inner, left, right, full outer, self join, cross join.",
            followups: [
              "How does a left join behave if you add a WHERE clause filtering on the right table's column?",
              "Difference between a self join and simply aliasing the same table twice in a query?",
            ],
          },
          {
            q: "Clustered vs non-clustered index — what's the difference?",
            followups: [
              "Can a table have more than one clustered index?",
              "How does column order in a composite index affect query performance (leftmost prefix rule)?",
            ],
          },
          {
            q: "What is normalization? Explain 1NF, 2NF, 3NF, BCNF.",
            followups: [
              "Give an example of a table that violates 2NF.",
              "When would you intentionally denormalize a schema?",
            ],
          },
          {
            q: "Explain ACID properties.",
            followups: [
              "Which ACID property is hardest to guarantee in a distributed database, and why?",
            ],
          },
          {
            q: "What are SQL isolation levels? What anomalies does each prevent (dirty read, non-repeatable read, phantom read, lost update)?",
            followups: [
              "What isolation level would you pick for a banking balance transfer, and why?",
            ],
          },
          {
            q: "What are window functions? Explain ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, PARTITION BY, NTILE.",
            followups: [
              "Difference between RANK and DENSE_RANK when there are ties?",
              "How would you find the 2nd highest salary per department using a window function?",
            ],
          },
          {
            q: "CTE vs subquery vs temp table vs derived table (inline view) — differences and when to use each?",
            followups: ["Can a CTE be recursive? Give a real use case."],
          },
          { q: "What causes a deadlock in SQL? How do you detect and prevent one?" },
          {
            q: "View vs stored procedure vs function vs trigger — differences?",
            followups: [
              "Can a view be updatable? When does that break?",
              "What's a materialized/indexed view and when would you use one?",
            ],
          },
          { q: "What is the N+1 query problem? How do you fix it?" },
          {
            q: "How do you read a query execution plan? What do you look for?",
            followups: [
              "Difference between a table scan, index scan, and index seek?",
              "What is a \"spool\" or a \"sort\" operator telling you about a bad plan?",
            ],
          },
          { q: "What is a covering index?" },
          { q: "When would you denormalize a schema for performance?" },
          {
            q: "Explain transactions — BEGIN/COMMIT/ROLLBACK, savepoints, nested transactions, transaction scope in application code.",
          },
          {
            q: "Primary key vs unique key vs foreign key — constraints and behavior differences.",
            followups: [
              "What happens to child rows on delete with CASCADE vs RESTRICT vs SET NULL?",
            ],
          },
          {
            q: "Deadlock vs lock wait/timeout — how are they different and handled differently?",
          },
          {
            q: "Pagination strategies — OFFSET/FETCH vs keyset (seek) pagination. Performance implications at scale?",
          },
          {
            q: "How do you handle very large tables? Explain table/index partitioning (range, hash, list).",
          },
          { q: "UNION vs UNION ALL — difference and performance impact." },
          {
            q: "DELETE vs TRUNCATE vs DROP — differences (logging, rollback, identity reset, permissions, triggers firing).",
          },
          {
            q: "How do you prevent SQL injection? Explain parameterized queries / prepared statements.",
          },
          {
            q: "Explain database replication — master-slave/primary-replica, read replicas, replication lag, synchronous vs asynchronous replication.",
          },
          {
            q: "Optimistic vs pessimistic locking — when would you use each (e.g., updating an account balance)?",
          },
          { q: "What is a composite index and how does the query optimizer use it?" },
          {
            q: "How do database statistics affect the query optimizer's choices, and what happens when they're stale?",
          },
          {
            q: "What's the difference between a heap table and a table with a clustered index?",
          },
          {
            q: "ORM (Entity Framework/Dapper/etc.) vs raw SQL/stored procedures — trade-offs for a fintech system?",
            followups: [
              "What is the \"leaky abstraction\" problem with ORMs, and where have you hit it?",
            ],
          },
          {
            q: "How do you design a schema so that money amounts don't suffer floating-point rounding errors?",
          },
          {
            q: "What's your approach to schema migrations in a live production database with zero downtime?",
          },
          {
            q: "Backup and recovery basics — full vs differential vs transaction log backup, RPO/RTO in plain terms.",
          },
          {
            q: "What is connection pooling and why does it matter for a high-throughput API?",
          },
          {
            q: "Explain database sharding at the SQL level — sharding key selection, cross-shard query problems.",
          },
        ],
      },
      {
        id: "sql-practical",
        number: 2,
        title: "SQL — Practical / Technical Round",
        questions: [
          { q: "Write a query to find duplicate rows in a table." },
          {
            q: "Write a query to find the Nth highest salary (using a window function, not just LIMIT/TOP).",
          },
          {
            q: "Write a query to find employees who earn more than their manager (self join).",
          },
          {
            q: "Write a query using a window function to compute a running total of transactions per user, ordered by date.",
          },
          {
            q: "Write a query to find users who have never placed an order (left join + IS NULL).",
          },
          {
            q: "Design and normalize (to 3NF) a schema for a wallet + transactions system (users, wallets, transactions, transaction_status). Justify your table/column choices.",
          },
          {
            q: "Write a recursive CTE for a hierarchical structure (e.g., an org chart or category tree).",
          },
          {
            q: "Given a slow query and its execution plan, identify the missing index and rewrite the query.",
          },
          {
            q: "Write a stored procedure that transfers money between two accounts safely inside a transaction, handling rollback on failure.",
          },
          {
            q: "Given a transactions table, write a query to detect potentially duplicate/fraudulent transactions within a short time window (same user, same amount, within N minutes).",
          },
          { q: "Write a query to find the top 3 highest-spending users per month." },
          {
            q: "Write a query to pivot transaction data (rows to columns) — e.g., monthly totals per category as columns.",
          },
          {
            q: "Write a query to calculate month-over-month percentage growth in transaction volume.",
          },
          {
            q: "Given two tables (internal ledger vs external payment provider export), write a query to find mismatched/missing records for reconciliation.",
          },
          {
            q: "Write a query to implement keyset pagination on a transactions table ordered by created_at + id.",
          },
          {
            q: "Design indexes for a `transactions` table that's queried heavily by `user_id + date range` and occasionally by `status`. Justify your index choices.",
          },
        ],
      },
      {
        id: "angular-theoretical",
        number: 3,
        title: "Angular — Theoretical",
        questions: [
          {
            q: "How does Angular's change detection work? Default vs OnPush strategy.",
            followups: [
              "What actually triggers a change detection cycle?",
              "How do Angular signals change this picture? What is zone-less change detection?",
            ],
          },
          {
            q: "Observable vs Promise vs Subject vs BehaviorSubject vs ReplaySubject vs AsyncSubject — differences and use cases.",
            followups: [
              "When would you use a BehaviorSubject instead of a plain Observable?",
            ],
          },
          { q: "Explain Angular lifecycle hooks and their order of execution." },
          {
            q: "Explain dependency injection in Angular — hierarchical injectors, `providedIn: 'root'` vs component-level providers, multi-providers, injection tokens.",
          },
          {
            q: "Reactive forms vs template-driven forms — trade-offs.",
            followups: [
              "How do you build a dynamic FormArray (e.g., adding/removing form rows)?",
              "How do you implement cross-field validation (e.g., password + confirm password)?",
            ],
          },
          {
            q: "RxJS: switchMap vs mergeMap vs concatMap vs exhaustMap — differences.",
            followups: [
              "Which operator would you use on a \"submit\" button to prevent duplicate submissions, and why?",
              "Explain `combineLatest`, `forkJoin`, `zip`, and `withLatestFrom` — when would you use each?",
            ],
          },
          {
            q: "How do you prevent memory leaks from subscriptions? Explain async pipe, takeUntil, and DestroyRef.",
          },
          {
            q: "Route guards — CanActivate, CanDeactivate, CanMatch, Resolve. Give a real use case for each.",
          },
          {
            q: "HTTP interceptors — what are common use cases (auth token injection, global error handling, retry, loading spinner)?",
            followups: [
              "How do multiple interceptors chain together, and does order matter?",
            ],
          },
          { q: "Lazy loading and preloading strategies — how and why?" },
          {
            q: "How do OnPush + immutable data + trackBy work together for performance?",
          },
          {
            q: "Angular signals vs RxJS — when would you reach for each? What is `computed()` and `effect()`?",
          },
          { q: "Standalone components vs NgModules — what changed and why?" },
          {
            q: "Content projection (`ng-content`), ViewChild vs ContentChild — differences.",
          },
          {
            q: "Custom directives — attribute directive vs structural directive, how do you build each?",
          },
          { q: "Pipes — pure vs impure, how do you build a custom pipe?" },
          {
            q: "State management approaches — service + BehaviorSubject vs NgRx vs signal-based store. Trade-offs?",
            followups: [
              "Explain the NgRx flow: actions, reducers, effects, selectors — what problem does each solve?",
            ],
          },
          {
            q: "What is Angular Universal / SSR? Why and when would you use it? What is hydration?",
          },
          {
            q: "What are micro-frontends? How does Angular support this (e.g., Module Federation)?",
          },
          {
            q: "How do you unit test a component with an injected service dependency? (TestBed, spies/mocks)",
          },
          {
            q: "Security in Angular — XSS protection, DomSanitizer, when Angular auto-sanitizes vs when you must handle it manually.",
          },
          {
            q: "Angular build optimization — tree shaking, differential loading, analyzing bundle size, lazy chunks.",
          },
          { q: "What's the difference between `ViewChild` static: true vs false?" },
          {
            q: "Explain Angular's Ivy renderer at a high level — what changed from the old ViewEngine.",
          },
          { q: "How do you handle internationalization (i18n) in Angular?" },
          {
            q: "How do you handle accessibility (a11y) in an Angular app — ARIA attributes, keyboard navigation, focus management?",
          },
          {
            q: "What is a global `ErrorHandler` in Angular and how do you use it to catch unhandled errors app-wide?",
          },
          {
            q: "What are Angular environment files, and how do you manage config across dev/staging/prod builds?",
          },
          {
            q: "What is a resolver and how does it differ from fetching data inside `ngOnInit`?",
          },
          {
            q: "How would you implement a Progressive Web App (PWA) in Angular — what does the Angular service worker give you?",
          },
          {
            q: "What's the Angular CLI doing under the hood when you run `ng build`? What are schematics?",
          },
        ],
      },
      {
        id: "angular-practical",
        number: 4,
        title: "Angular — Practical / Technical Round",
        questions: [
          {
            q: "Build a parent-child component pair from scratch using `@Input()`/`@Output()` communication — no reference.",
          },
          {
            q: "Implement a custom synchronous AND asynchronous validator for a reactive form field.",
          },
          {
            q: "Build a search-as-you-type feature: debounce input, cancel previous in-flight request, switch to latest.",
          },
          {
            q: "Build an HTTP interceptor that attaches a JWT to every request and retries once on a 401 after refreshing the token.",
          },
          {
            q: "You're given a component rendering 1000+ list items and it's laggy — optimize it (virtual scroll / OnPush / trackBy) and explain the before/after.",
          },
          {
            q: "Build a custom structural directive (e.g., `*appIf` that shows content after a delay).",
          },
          {
            q: "Implement shared state between two unrelated sibling components using a service.",
          },
          {
            q: "Write unit tests for a component that depends on an injected service, mocking the service.",
          },
          {
            q: "Build a multi-step form wizard with per-step validation and a review step at the end.",
          },
          {
            q: "You're handed a component with a memory leak (unclosed subscription) — find it and fix it.",
          },
          {
            q: "Build a table component with client-side sorting and filtering, no external library.",
          },
          {
            q: "Implement optimistic UI update for a \"like\"/\"favorite\" button (update UI immediately, roll back on API failure).",
          },
          { q: "Combine two API calls with `forkJoin` and handle partial failure gracefully." },
          {
            q: "Build a reusable confirmation-modal service that any component can call and `await` a result from.",
          },
          {
            q: "Implement route-based lazy loading for a feature module and verify it in the network tab / bundle output.",
          },
        ],
      },
      {
        id: "angular-forms",
        number: 4,
        numLabel: "4a",
        title: "Angular — Reactive Forms & Validation (Deep Dive)",
        questions: [
          {
            q: "FormControl, FormGroup, FormArray, FormRecord — what does each represent and when do you reach for each?",
          },
          {
            q: "How do you build a reactive form with FormBuilder vs instantiating FormControl/FormGroup by hand? What does FormBuilder actually save you?",
          },
          {
            q: "What is the difference between `setValue()` and `patchValue()` on a FormGroup? When does `setValue()` throw?",
          },
          {
            q: "What do `reset()`, `markAsPristine()`, `markAsTouched()`, and `markAllAsTouched()` do, and when would you call `markAllAsTouched()` on submit?",
          },
          {
            q: "Explain the control states: pristine/dirty, touched/untouched, valid/invalid, pending, disabled. Which combination decides whether you actually show an error message?",
          },
          {
            q: "Why does a disabled control not appear in `form.value`, and how do you get the full value including disabled controls?",
            followups: ["What does `getRawValue()` return that `.value` doesn't?"],
          },
          {
            q: "How do `valueChanges` and `statusChanges` work? What's the common infinite-loop bug when you subscribe to `valueChanges` and also call `patchValue()` inside that subscription?",
            followups: [
              "How does `{ emitEvent: false }` help?",
            ],
          },
          {
            q: "What is the `updateOn` option (`change` / `blur` / `submit`) and when would you switch a form or control to `blur` or `submit`?",
          },
          {
            q: "How do you build a dynamic FormArray — add row, remove row, reindex — and bind it in the template with `formArrayName` + `formGroupName`?",
          },
          {
            q: "How do you implement cross-field validation (password + confirmPassword) with a validator on the FormGroup, and how do you surface that error in the template since it lives on the group, not a control?",
          },
          {
            q: "Write a custom synchronous validator (e.g., a forbidden-value validator). What exact shape must it return on valid vs invalid?",
          },
          {
            q: "Write a custom async validator that checks username availability against an API. How do you debounce it so it doesn't fire on every keystroke?",
          },
          {
            q: "How does Angular know an async validator is still running? What is the `pending` status and how do you show a spinner for it?",
          },
          {
            q: "How do you pass a parameter into a custom validator (the validator-factory pattern)?",
          },
          {
            q: "`ValidatorFn` vs `AsyncValidatorFn` vs a directive-based validator registered with `NG_VALIDATORS` — when do you actually need the directive form?",
          },
          {
            q: "How do you add or remove validators at runtime with `setValidators()` / `addValidators()` / `removeValidators()`, and why must you call `updateValueAndValidity()` afterwards?",
          },
          {
            q: "Conditional validation: a field is required only when another field has a certain value — how do you wire that up without leaking subscriptions?",
          },
          {
            q: "`control.errors` is an object of all failing keys — how do you cleanly display just the first relevant error message per control?",
          },
          {
            q: "What is `ControlValueAccessor` and what do its four methods (`writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`) each do?",
          },
          {
            q: "Build a custom form control (star-rating or currency input) that works with `formControlName`, `[(ngModel)]`, validation, and the disabled state.",
          },
          {
            q: "Why do you register a custom control with `NG_VALUE_ACCESSOR` using `multi: true` and `forwardRef()`?",
          },
          {
            q: "How do you compose a child component's sub-form into a parent form — passing a `FormGroup` via `@Input` vs sharing a `ControlContainer`?",
          },
          {
            q: "What does providing `ControlContainer` via `viewProviders` with `formGroupName` give a sub-form component, and why is it better than passing the FormGroup as an input?",
          },
          {
            q: "Template-driven forms: how do `ngModel`, `ngForm`, `ngModelGroup`, and the exported `#f=\"ngForm\"` reference work together?",
          },
          {
            q: "Template-driven vs reactive forms — give three concrete reasons to pick reactive for a complex fintech form.",
          },
          {
            q: "How do you strictly type a reactive form (typed forms, Angular 14+)? What broke, and what do `FormControl<string>` and `nonNullable` give you?",
          },
          {
            q: "Why can `form.get('a.b.c')` return `null`, and how do you access deeply nested controls safely?",
          },
          {
            q: "After a successful submit, how do you reset the form to initial values without leaving controls `touched`/`dirty` so old errors keep showing?",
          },
          {
            q: "How do you prevent a double submit — button disabled on `form.invalid || submitting`, and why is `exhaustMap` the right operator on the submit stream?",
          },
          {
            q: "How do you map server-side validation errors (a 422 response) back onto specific form controls using `setErrors()`?",
          },
          {
            q: "What's the performance concern with a very large reactive form where `valueChanges` fires constantly, and how do `updateOn: 'blur'` and `OnPush` help?",
          },
          {
            q: "How do you build a multi-step wizard: one big FormGroup with nested groups per step vs separate FormGroups per step — and how do you validate step-by-step?",
          },
          {
            q: "How do you drive a \"you have unsaved changes\" `CanDeactivate` guard from `form.dirty`?",
          },
          {
            q: "How do you unit-test a component with a reactive form — set control values, mark touched, assert validity, and assert the emitted output on submit?",
          },
        ],
      },
      {
        id: "angular-rxjs",
        number: 4,
        numLabel: "4b",
        title: "Angular — RxJS in Angular (Deep Dive)",
        questions: [
          {
            q: "Observable vs Promise — lazy vs eager, one value vs many, cancellable vs not. Why does `HttpClient` return an Observable?",
          },
          {
            q: "Cold vs hot Observable — is an `HttpClient` request cold or hot, and what actually happens if you subscribe to it twice?",
          },
          {
            q: "Subject vs BehaviorSubject vs ReplaySubject vs AsyncSubject — the differences, and one real Angular use case for each.",
          },
          {
            q: "When do you use a `BehaviorSubject` as the backing store of a stateful service, and why expose it via `.asObservable()`?",
          },
          {
            q: "`switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap` — describe the marble behaviour and give the canonical use case for each (typeahead, parallel, ordered, submit).",
          },
          {
            q: "Which flattening operator prevents duplicate form submissions, and what goes wrong if you use `mergeMap` there instead?",
          },
          {
            q: "`combineLatest` vs `forkJoin` vs `zip` vs `withLatestFrom` — when does each emit, and when does each complete?",
          },
          {
            q: "Why does `forkJoin` emit nothing if one inner Observable never completes, and what's the fix when combining with a stream that doesn't complete?",
          },
          {
            q: "How do you handle partial failure in `forkJoin` — one of three calls fails but you still want the other two results?",
          },
          {
            q: "`debounceTime` vs `throttleTime` vs `auditTime` vs `sampleTime` — which for a search box, which for a scroll/resize handler, and why?",
          },
          {
            q: "`distinctUntilChanged` — how does it help a typeahead, and what's the gotcha when the values are objects?",
          },
          {
            q: "Build search-as-you-type: `valueChanges` → `debounceTime` → `distinctUntilChanged` → `switchMap` → handle errors without killing the stream.",
          },
          {
            q: "Why does an error inside an inner Observable in `switchMap` complete the whole outer stream, and how do you contain it (`catchError` on the inner, returning `EMPTY` or `of(...)`)?",
          },
          {
            q: "`catchError` — where do you place it (inner vs outer), what must it return, and what's the difference between returning `of([])` and rethrowing?",
          },
          {
            q: "How do you retry a failed HTTP call three times with exponential backoff using `retry({ count, delay })`?",
          },
          {
            q: "What is `finalize` good for (hiding a loading spinner), and how is it different from the `complete` callback?",
          },
          {
            q: "How do you cancel an in-flight HTTP request in Angular? What actually triggers the cancellation?",
          },
          {
            q: "List the four common fixes for subscription memory leaks: `async` pipe, `takeUntil(destroy$)`, `takeUntilDestroyed()`, and manual `unsubscribe()`. When is each appropriate?",
          },
          {
            q: "What are `takeUntilDestroyed()` and `DestroyRef` (Angular 16+), and when can you call `takeUntilDestroyed()` without passing a `DestroyRef`?",
          },
          {
            q: "The `async` pipe — what does it do on subscribe, on destroy, and on reference change? Why do two `async` pipes on the same source cause two subscriptions, and how does `*ngIf ... as` fix it?",
          },
          {
            q: "`shareReplay({ bufferSize: 1, refCount: true })` — what problem does it solve for a shared HTTP call, and what's the `refCount` true-vs-false trade-off (leak vs re-request)?",
          },
          {
            q: "How do you turn a value that changes over time (route params) into a data stream — `paramMap` → `switchMap(id => service.get(id))` → `async` pipe?",
          },
          {
            q: "`startWith`, `scan`, and `map` — how would you build a running-total or an accumulating-state stream?",
          },
          {
            q: "`EMPTY` vs `of()` vs `NEVER` — what does each do, and when do you return `EMPTY` from `catchError`?",
          },
          {
            q: "How do you combine a manual \"refresh\" button with an initial auto-load — a `Subject` merged with a startup trigger, piped into `switchMap`?",
          },
          {
            q: "Signals vs RxJS — when do you reach for a signal, when for an Observable? What do `toSignal()` and `toObservable()` bridge?",
          },
          {
            q: "What does `toSignal()` do about the initial value and about unsubscription?",
          },
          {
            q: "Why is a nested `subscribe` inside another `subscribe` an anti-pattern? Rewrite it with a higher-order mapping operator.",
          },
          {
            q: "How do you unit-test RxJS code — marble testing with `TestScheduler`, `fakeAsync` + `tick()`, or subscribing and asserting? When does each fit?",
          },
          {
            q: "How do you test a debounced typeahead in a `fakeAsync` zone with `tick(300)`?",
          },
          {
            q: "`tap` for side effects vs doing side effects in `map` or `subscribe` — when is `tap` the right tool?",
          },
          {
            q: "How do you process 100 items but cap it at five concurrent HTTP requests (`mergeMap` with a concurrency argument)?",
          },
          {
            q: "How do you share one HTTP response across multiple components without re-fetching?",
          },
          {
            q: "What is backpressure, and where might it actually bite in an Angular UI (rapid websocket messages, resize storms)?",
          },
          {
            q: "How do you convert a DOM event, a `setInterval`, or a websocket into an Observable (`fromEvent`, `interval`, `new Observable`)?",
          },
          {
            q: "Why should a service method return an Observable rather than subscribe internally and return `void`? What does the caller lose otherwise?",
          },
        ],
      },
      {
        id: "angular-services-di",
        number: 4,
        numLabel: "4c",
        title: "Angular — Services, Dependency Injection & State",
        questions: [
          {
            q: "What is a service, and why move logic out of components? Make the testability and reuse argument.",
          },
          {
            q: "`providedIn: 'root'` vs a component's `providers` array vs `providedIn: 'platform'` / `'any'` — how many instances and what scope does each give you?",
          },
          {
            q: "What are tree-shakable providers, and how does `providedIn` let the build drop an unused service?",
          },
          {
            q: "Explain the hierarchical injector tree — element injector vs environment injector. How does a component-level provider create a fresh instance for that subtree?",
          },
          {
            q: "What is an `InjectionToken`, and why do you need one for non-class dependencies (config objects, strings, primitives)?",
          },
          {
            q: "`useClass`, `useValue`, `useExisting`, `useFactory` — what does each provider recipe do? Give a real use case for `useFactory` with `deps`.",
          },
          {
            q: "What is a multi-provider (`multi: true`)? Name two Angular features built on it (`HTTP_INTERCEPTORS`, `NG_VALIDATORS`, `APP_INITIALIZER`).",
          },
          {
            q: "The `inject()` function vs constructor injection — what can `inject()` do that a constructor can't, and where is it legal to call it?",
          },
          {
            q: "What is an injection context, and why does calling `inject()` outside a constructor / factory / `runInInjectionContext` throw?",
          },
          {
            q: "`@Optional()`, `@Self()`, `@SkipSelf()`, `@Host()` — what does each resolution modifier change?",
          },
          {
            q: "What is the \"captive dependency\" problem (a singleton holding something shorter-lived), and how does it show up in Angular?",
          },
          {
            q: "How do you provide a different service implementation for dev vs prod using a token + factory + environment?",
          },
          {
            q: "`APP_INITIALIZER` — how do you load runtime config from an API before the app bootstraps?",
          },
          {
            q: "How do you share state between two unrelated sibling components with a service — `BehaviorSubject` plus an exposed Observable and setter methods?",
          },
          {
            q: "Build a minimal store service: a private `BehaviorSubject<State>`, selectors via `map` + `distinctUntilChanged`, and immutable updates.",
          },
          {
            q: "Service-with-a-Subject vs NgRx vs `signalStore` — what does each solve, and when is NgRx overkill?",
          },
          {
            q: "NgRx: what problem do actions, reducers, selectors, and effects each solve, and where does the HTTP call live?",
          },
          {
            q: "What is a memoized selector (`createSelector`), and why does it matter for `OnPush` performance?",
          },
          {
            q: "Signal-based state: `signal()`, `computed()`, `effect()`, `set()` / `update()` — build a small cart or counter store with them.",
          },
          {
            q: "When does an `effect()` run, why should you avoid writing signals inside one, and what is `allowSignalWrites`?",
          },
          {
            q: "How do you keep a service a true singleton across a lazy-loaded feature without accidentally creating a second instance?",
          },
          {
            q: "How do you unit-test a service that depends on `HttpClient` using `provideHttpClientTesting` / `HttpClientTestingModule` and `HttpTestingController`?",
          },
          {
            q: "How do you mock a service's dependency in `TestBed` with a provider override (`{ provide: X, useValue: spy }`)?",
          },
          {
            q: "What's the risk of storing a mutable object in a service and handing the same reference to several components, and how do immutability + `OnPush` fix it?",
          },
          {
            q: "How would you cache API responses in a service (in-memory `Map`, `shareReplay`, or a TTL cache) and invalidate on a mutation?",
          },
          {
            q: "Where should cross-cutting concerns live — an interceptor, a service, or a base class — for auth-token attach, logging, and error toasts?",
          },
        ],
      },
      {
        id: "angular-components-basics",
        number: 4,
        numLabel: "4d",
        title: "Angular — Components, Templates & Data Binding (Basics)",
        questions: [
          {
            q: "Which parts of the `@Component` decorator do you actually use (`selector`, `template`/`templateUrl`, `styles`, `changeDetection`, `standalone`, `imports`, `providers`, `host`)?",
          },
          {
            q: "Interpolation `{{ }}` vs property binding `[prop]` vs attribute binding `[attr.x]` — when must you use `[attr.]` (e.g., `colspan`, ARIA attributes)?",
          },
          {
            q: "Event binding `(click)` and `$event` — how do you get a typed DOM event, and what is `$event` for a custom `@Output`?",
          },
          {
            q: "Two-way binding `[(ngModel)]` — what two bindings does the \"banana in a box\" desugar to, and how do you make your own two-way-bindable `x` / `xChange` pair?",
          },
          {
            q: "`@Input()` — aliasing, required inputs, input setters vs `ngOnChanges`, and the new signal `input()` API.",
          },
          {
            q: "`@Output()` and `EventEmitter` — why is `EventEmitter` essentially a `Subject`, and should you ever `.subscribe()` to your own output inside the component?",
          },
          {
            q: "`input()`, `output()`, `model()` signal APIs (Angular 17.1+) — how do they differ from the decorators?",
          },
          {
            q: "The new control flow `@if` / `@else`, `@for` (with mandatory `track`), `@switch`, `@defer` — how do they compare to `*ngIf` / `*ngFor` / `*ngSwitch`?",
          },
          {
            q: "Why is `trackBy` (or `@for` `track`) important for a list that re-renders, and what concretely goes wrong without it?",
          },
          {
            q: "`*ngIf` with `; else tpl` and an `as` local variable — how does it help you avoid repeated evaluation / multiple subscriptions?",
          },
          {
            q: "`ng-template`, `ng-container`, `ng-content` — what is each for, and why does `ng-container` need to exist?",
          },
          {
            q: "Content projection — single-slot `<ng-content>`, multi-slot with `select`, and `@ContentChild`. Whose change detection and lifecycle owns projected content?",
          },
          {
            q: "`@ViewChild` vs `@ContentChild` — the difference, when each is available (`static: true` vs `false`), and how the signal `viewChild()` query changes this.",
          },
          {
            q: "Template reference variables (`#ref`) — what do they point to for a plain element vs a component vs a directive with `exportAs`?",
          },
          {
            q: "List the lifecycle hooks in execution order and say which run once vs on every change-detection cycle.",
          },
          {
            q: "Why does reading a `@ViewChild` in `ngOnInit` sometimes give `undefined`, and where should you read it instead?",
          },
          {
            q: "What is `ExpressionChangedAfterItHasBeenCheckedError`, what causes it, and how do you fix it properly (not with `setTimeout`)?",
          },
          {
            q: "`@HostBinding` / `@HostListener` and the `host` object — build a directive that toggles a class on click.",
          },
          {
            q: "`ngClass` vs `[class.x]` vs `ngStyle` vs `[style.x]` — which is most efficient, and which do you use for a single toggle?",
          },
          {
            q: "View encapsulation: `Emulated` vs `ShadowDom` vs `None` — what does `Emulated` actually do with those attribute selectors?",
          },
          {
            q: "`:host`, `:host-context()`, and `::ng-deep` (deprecated) — when do you need each, and what is the modern alternative to `::ng-deep`?",
          },
          {
            q: "Standalone components vs NgModules — what changed, what is `bootstrapApplication`, and how do you lazy-load a standalone component?",
          },
          {
            q: "How do you create a component dynamically and pass it data (`ViewContainerRef.createComponent`, setting inputs, `NgComponentOutlet`)?",
          },
          {
            q: "Smart (container) vs dumb (presentational) components — what belongs in each, and how does the split help `OnPush` and testing?",
          },
          {
            q: "How do you localize template text — the `i18n` attribute + `@angular/localize` vs a runtime translation library — and the trade-offs?",
          },
          {
            q: "Walk through unit-testing a component: `configureTestingModule`, `createComponent`, `detectChanges()`, querying with `By.css`, triggering events, asserting output.",
          },
        ],
      },
      {
        id: "angular-directives-pipes",
        number: 4,
        numLabel: "4e",
        title: "Angular — Directives, Pipes & Rendering",
        questions: [
          {
            q: "Attribute directive vs structural directive — what is the `*` sugar actually doing with `<ng-template>`?",
          },
          {
            q: "Build a custom attribute directive (`appHighlight`) with `ElementRef` + `Renderer2` + `@HostListener`. Why prefer `Renderer2` over touching `nativeElement` directly?",
          },
          {
            q: "Build a custom structural directive (`*appDelay=\"500\"`) using `TemplateRef` + `ViewContainerRef`.",
          },
          {
            q: "How do you pass multiple inputs into a structural directive via microsyntax (`*appIf=\"cond as value; else tpl\"`)?",
          },
          {
            q: "Pure vs impure pipes — when does a pure pipe re-run, and why is an impure pipe a performance risk?",
          },
          {
            q: "Build a custom pipe (`timeAgo`, `mask`, or `initials`) and show how you pass arguments to it.",
          },
          {
            q: "Why should you not filter or sort a large array inside a template pipe or a getter? Where should that work go instead?",
          },
          {
            q: "`async`, `date`, `currency`, `number`, `percent`, `keyvalue`, `slice`, `json` pipes — which do you use, and what's the locale gotcha (`registerLocaleData`)?",
          },
          {
            q: "How does `CurrencyPipe` / `DecimalPipe` formatting interact with a fintech need for exact decimals and Indian digit grouping (lakh/crore)?",
          },
          {
            q: "How do you build a directive that also implements `ControlValueAccessor` (e.g., an input-mask directive usable with `formControlName`)?",
          },
          {
            q: "What is `NgTemplateOutlet`, and when do you use it instead of content projection?",
          },
          {
            q: "How do you unit-test a directive — a host component in `TestBed`, or `DebugElement.injector.get(Directive)`?",
          },
          {
            q: "What triggers a directive's `ngOnChanges` vs `ngDoCheck`, and how do you react to input changes efficiently?",
          },
          {
            q: "Which `Renderer2` methods do you actually use (`addClass`, `setStyle`, `listen`, `setAttribute`), and why do they matter for SSR and security?",
          },
          {
            q: "Build an IntersectionObserver-based \"lazy load image\" directive and clean it up in `ngOnDestroy`.",
          },
          {
            q: "Dynamic component rendering with `NgComponentOutlet` vs `ViewContainerRef.createComponent` — trade-offs.",
          },
        ],
      },
      {
        id: "angular-routing",
        number: 4,
        numLabel: "4f",
        title: "Angular — Routing",
        questions: [
          {
            q: "How do you configure routes (`provideRouter` / `RouterModule.forRoot`), and why is match order sensitive (`''`, `pathMatch: 'full'`, wildcard `**`)?",
          },
          {
            q: "`routerLink`, `routerLinkActive`, `[queryParams]`, `[state]`, and programmatic `Router.navigate` / `navigateByUrl` — when do you use each?",
          },
          {
            q: "Route params vs query params vs matrix params vs route `data` vs `state` — how do you read each?",
          },
          {
            q: "Why read `paramMap` as an Observable instead of `snapshot.params`? What breaks with `snapshot` when navigating from `/user/1` to `/user/2`?",
          },
          {
            q: "Child routes, nested `<router-outlet>`, and named/secondary outlets — give a real use case for a named outlet.",
          },
          {
            q: "Lazy loading with `loadChildren` vs `loadComponent` (standalone) — how do you verify a chunk actually splits in the build output?",
          },
          {
            q: "Preloading strategies — `PreloadAllModules`, `NoPreloading`, and a custom strategy that preloads only routes flagged in `data`.",
          },
          {
            q: "Guards: `CanActivate`, `CanActivateChild`, `CanDeactivate`, `CanMatch`, `Resolve` — a concrete use case for each, and why `CanMatch` beats `CanActivate` for auth-based route swapping.",
          },
          {
            q: "Rewrite a class-based `CanActivate` guard as a functional `CanActivateFn` using `inject()`.",
          },
          {
            q: "`Resolve` vs fetching in `ngOnInit` — pros (no empty flash, data ready) and cons (navigation blocked). How do you show a loading indicator during resolve (`router.events`)?",
          },
          {
            q: "How do you protect against losing unsaved form changes with a `CanDeactivate` guard bound to `component.form.dirty`?",
          },
          {
            q: "How do you pass data to a route without putting it in the URL (`NavigationExtras.state`) and read it back (`getCurrentNavigation()`)?",
          },
          {
            q: "Using router events (`NavigationStart` / `End` / `Cancel` / `Error`), build a global route-change loading bar.",
          },
          {
            q: "Scroll position restoration and anchor scrolling — `withInMemoryScrolling` / `scrollPositionRestoration`.",
          },
          {
            q: "How do you unit-test a component that uses `ActivatedRoute` — a stub with a `paramMap` Observable, or `RouterTestingModule` / `provideRouter`?",
          },
          {
            q: "How do you handle a 404 / unknown route and a \"redirect old URL to new URL\" requirement?",
          },
        ],
      },
      {
        id: "angular-http-interceptors",
        number: 4,
        numLabel: "4g",
        title: "Angular — HttpClient & Interceptors",
        questions: [
          {
            q: "`provideHttpClient()` / `HttpClientModule`, typed responses (`http.get<T>()`), and why the response is an Observable you must subscribe to (or `async`-pipe).",
          },
          {
            q: "How do you send query params (`HttpParams`), headers (`HttpHeaders`), read the full response (`observe: 'response'`), or track progress (`reportProgress`)?",
          },
          {
            q: "Functional interceptors (`HttpInterceptorFn`, Angular 15+) vs class interceptors — how do you register each, and does order matter?",
          },
          {
            q: "Write an auth interceptor that attaches a JWT and, on a 401, refreshes the token once and retries the original request. How do you stop a refresh stampede when five requests 401 at the same time?",
          },
          {
            q: "Write a global error interceptor that shows a toast and rethrows — without swallowing the error for the caller.",
          },
          {
            q: "Build a loading-spinner interceptor — a counter in a service, guarded against going negative, using `finalize`.",
          },
          {
            q: "Build a retry interceptor with exponential backoff for idempotent GETs only — how do you decide it's safe to retry?",
          },
          {
            q: "How do you cancel a request when a component is destroyed mid-flight, and how does `switchMap` in a search feature do this automatically?",
          },
          {
            q: "How do you test an interceptor with `HttpTestingController` — assert the outgoing header, flush a 401, assert the retry?",
          },
          {
            q: "How do you do file upload with progress (`reportProgress: true`, `HttpEventType.UploadProgress`) and blob download (`responseType: 'blob'`)?",
          },
          {
            q: "How do you mock the backend in development (an in-memory interceptor, `provideHttpClient` with a fake, or MSW)?",
          },
          {
            q: "Where does response caching belong — an interceptor keyed by URL, or a service with `shareReplay`? Trade-offs.",
          },
        ],
      },
      {
        id: "angular-change-detection-perf",
        number: 4,
        numLabel: "4h",
        title: "Angular — Change Detection, Signals & Performance",
        questions: [
          {
            q: "How does Zone.js-based change detection work — what monkey-patched async API triggers a cycle, and what does \"dirty-check from the root\" mean?",
          },
          {
            q: "`Default` vs `OnPush` — with `OnPush`, what still triggers change detection for that component?",
          },
          {
            q: "Why does `OnPush` require immutable inputs? Show a bug where mutating an array in place doesn't update an `OnPush` child.",
          },
          {
            q: "`ChangeDetectorRef` — `markForCheck()`, `detectChanges()`, `detach()`, `reattach()` — when do you use `markForCheck()` vs `detectChanges()`?",
          },
          {
            q: "`trackBy` / `@for track` — describe the before/after on a 1000-row list re-render.",
          },
          {
            q: "`NgZone.runOutsideAngular()` — when do you use it (rapid mousemove, animation loop, noisy third-party lib), and how do you re-enter the zone?",
          },
          {
            q: "What is zoneless change detection (`provideExperimentalZonelessChangeDetection`), and what must the app rely on instead of Zone.js?",
          },
          {
            q: "How do signals change the change-detection story — fine-grained template dependencies — and where is Angular heading with signal-based components?",
          },
          {
            q: "`computed()` memoization and glitch-free propagation — why is a `computed` better than calling a method in the template?",
          },
          {
            q: "`@defer` blocks — triggers (`on idle`, `on viewport`, `on interaction`, `when`), plus `@placeholder` / `@loading` / `@error` — how do they cut the initial bundle?",
          },
          {
            q: "CDK virtual scrolling (`cdk-virtual-scroll-viewport`) — when is it worth it, and what's the pitfall with variable row heights?",
          },
          {
            q: "How do you profile an Angular app — Angular DevTools profiler, `ng.profiler.timeChangeDetection()`, Chrome performance — and what do you look for?",
          },
        ],
      },
      {
        id: "angular-testing-tooling",
        number: 4,
        numLabel: "4i",
        title: "Angular — Testing & Tooling",
        questions: [
          {
            q: "`TestBed` — what does `configureTestingModule` set up, and what's the cost of `compileComponents()` for a `templateUrl`?",
          },
          {
            q: "`fixture.detectChanges()` — why must you call it, and when do you need to call it twice?",
          },
          {
            q: "`fakeAsync` + `tick()` / `flush()` vs `waitForAsync` + `whenStable()` — when do you need each?",
          },
          {
            q: "How do you mock a service in a component test (`useValue: jasmine.createSpyObj(...)`) and assert it was called with the right args?",
          },
          {
            q: "`provideHttpClientTesting` / `HttpClientTestingModule` + `HttpTestingController` — `expectOne`, `flush`, `verify`.",
          },
          {
            q: "How do you test `@Output` emissions and DOM interactions (`triggerEventHandler`, native `click`)?",
          },
          {
            q: "How do you test a component that depends on `Router` and `ActivatedRoute`?",
          },
          {
            q: "Shallow vs deep component tests — `NO_ERRORS_SCHEMA` / `CUSTOM_ELEMENTS_SCHEMA` vs stubbing child components; trade-offs.",
          },
          {
            q: "What makes an Angular test flaky (missing `detectChanges`, real timers, unmocked HTTP, fixture not destroyed)?",
          },
          {
            q: "What does `ng build` do under the hood (AOT, tree-shaking, budgets, esbuild/Vite), and what are schematics (`ng generate`, `ng add`, `ng update`)?",
          },
        ],
      },
      {
        id: "angular-practical-extended",
        number: 4,
        numLabel: "4j",
        title: "Angular — Practical Build Tasks (Extended)",
        questions: [
          {
            q: "Build a reusable confirm-dialog service any component can call and `await` a boolean from (component + `Subject` + overlay).",
          },
          {
            q: "Build a generic typed data-table component: `@Input` columns + rows, client-side sort, filter, and pagination, `OnPush`, no library.",
          },
          {
            q: "Build an `<app-currency-input>` custom form control (`ControlValueAccessor`) that stores a number but displays grouped INR formatting.",
          },
          {
            q: "Build a debounced search field that cancels stale requests and shows loading / empty / error states from a single stream.",
          },
          {
            q: "Build a multi-step wizard with one typed `FormGroup`, per-step validation gating the Next button, and a review step.",
          },
          {
            q: "Build an auth flow: login form → store JWT → `CanMatch` route guard → interceptor attaches token → refresh on 401.",
          },
          {
            q: "Build an \"unsaved changes\" `CanDeactivate` guard wired to a form's `dirty` state.",
          },
          {
            q: "Build a dynamic form from a JSON schema (array of field configs → `FormGroup` + rendered controls).",
          },
          {
            q: "Build optimistic UI for a favorite/like toggle — update state immediately, roll back on API error, dedupe rapid clicks with `exhaustMap`.",
          },
          {
            q: "Build a FormArray editor for line items (add / remove / reorder) with a live total via `valueChanges` or a signal.",
          },
          {
            q: "Build a lazy-loaded route with `loadComponent` and verify the chunk split in the build.",
          },
          {
            q: "Build a global `ErrorHandler` plus an HTTP error interceptor that together log to a service and show a toast.",
          },
          {
            q: "Convert an RxJS-based component's state to signals (`toSignal`, `computed`) and note what got simpler.",
          },
          {
            q: "Build a paginated infinite-scroll list that never skips or duplicates rows as new data is prepended (keyset cursor).",
          },
          {
            q: "Write unit tests for the debounced search component using `fakeAsync` + `HttpTestingController`.",
          },
        ],
      },
      {
        id: "nodejs-theoretical",
        number: 5,
        title: "Node.js — Theoretical",
        questions: [
          {
            q: "Explain the Node.js event loop and its phases in detail (timers, pending callbacks, poll, check, close).",
          },
          {
            q: "Callback vs Promise vs async/await — how does error handling differ across the three?",
          },
          {
            q: "What is a stream? Explain the types (Readable, Writable, Duplex, Transform) and backpressure.",
          },
          { q: "Buffer vs Stream — when do you use each?" },
          {
            q: "Cluster module vs worker_threads vs child_process — differences and when to use each.",
          },
          {
            q: "Explain the Express middleware chain and how error-handling middleware differs from regular middleware.",
          },
          {
            q: "What commonly causes memory leaks in a Node app? How do you detect one (heap snapshots, `--inspect`)?",
          },
          {
            q: "What is EventEmitter used for internally in Node? How would you implement a simple pub/sub with it?",
          },
          {
            q: "Explain npm semantic versioning (`^`, `~`), `package-lock.json`, and peer dependencies.",
          },
          {
            q: "How do you manage environment/config and secrets safely across dev/staging/prod?",
          },
          {
            q: "Node security basics — helmet, rate limiting, input validation/sanitization, CORS, preventing NoSQL/SQL injection.",
          },
          {
            q: "How do microservices typically communicate? REST vs gRPC vs message queue trade-offs.",
          },
          {
            q: "Authentication approaches — session-based vs JWT vs OAuth2. Trade-offs?",
          },
          { q: "CommonJS vs ES Modules in Node — key differences." },
          {
            q: "`process.nextTick` vs `setImmediate` vs `setTimeout(fn, 0)` — execution order and why it matters.",
          },
          {
            q: "Error-first callback pattern — what is it, and how do you handle unhandled promise rejections?",
          },
          {
            q: "How do you approach logging and monitoring for a Node service in production?",
          },
          {
            q: "Unit vs integration testing in Node — how do you mock a database call in a test?",
          },
          {
            q: "How do you implement graceful shutdown (handling SIGTERM, draining in-flight requests, closing DB connections)?",
          },
          {
            q: "How would you add caching to a Node API (in-memory vs Redis)? How do you invalidate it?",
          },
          { q: "What is the difference between `require` and dynamic `import()`?" },
          {
            q: "How does Node handle uncaught exceptions vs unhandled promise rejections, and what should your app do about each?",
          },
          {
            q: "TypeScript with Node — what does it actually buy you at runtime (hint: nothing, it's compile-time) vs at dev-time?",
          },
          {
            q: "REST vs GraphQL — when would you choose GraphQL for a Node backend, and what are its downsides (caching, N+1 at resolver level)?",
          },
          {
            q: "WebSockets vs long polling vs Server-Sent Events — differences and when to use each for real-time features.",
          },
          {
            q: "ORMs in the Node world (TypeORM/Prisma/Sequelize) — how do they compare to writing raw SQL or using a query builder like Knex?",
          },
          { q: "What's the role of a reverse proxy (Nginx) in front of a Node app?" },
          {
            q: "How would you structure a monorepo containing multiple Node services (npm/yarn workspaces, Nx, Turborepo)?",
          },
        ],
      },
      {
        id: "nodejs-practical",
        number: 6,
        title: "Node.js — Practical / Technical Round",
        questions: [
          {
            q: "Build a small Express CRUD API for one resource with a centralized error-handling middleware.",
          },
          {
            q: "Implement JWT authentication: login endpoint, a protected route, and a refresh-token flow.",
          },
          {
            q: "Build a file upload endpoint that streams the file to disk instead of buffering it fully in memory.",
          },
          {
            q: "Implement rate-limiting middleware from scratch (token bucket algorithm), no library.",
          },
          { q: "You're given a snippet with a memory leak — find and fix it." },
          {
            q: "Write a script to process a large CSV file (bigger than available RAM) using streams.",
          },
          { q: "Implement a simple pub/sub system using EventEmitter across two modules." },
          { q: "Add request validation to an endpoint (e.g., with Joi or Zod, or hand-rolled)." },
          {
            q: "Write unit tests for an Express route handler, mocking the database layer.",
          },
          {
            q: "Implement graceful shutdown for an Express server — close the HTTP server, finish in-flight requests, close DB connections.",
          },
          {
            q: "Build a simple job queue processor (in-memory) that processes tasks with retry-on-failure logic and exponential backoff.",
          },
          {
            q: "Implement request logging middleware that logs method, path, status code, and response time.",
          },
          { q: "Build a WebSocket server that broadcasts a message to all connected clients." },
          {
            q: "Implement an idempotency-key check in Express middleware (reject/short-circuit a repeated request with the same key).",
          },
          {
            q: "Debug a Node process consuming 100% CPU — walk through your diagnostic approach (profiler, flame graph).",
          },
        ],
      },
      {
        id: "node-event-loop-async-internals",
        number: 6,
        numLabel: "6a",
        title: "Node.js — Event Loop, Timers & Async Internals",
        questions: [
          {
            q: "Walk through the event loop phases in order (timers, pending callbacks, poll, check, close) and what runs in each.",
          },
          {
            q: "What is the poll phase actually doing, and when does the loop block there vs move on to `check`?",
          },
          {
            q: "`process.nextTick()` vs `queueMicrotask()` vs `Promise.then()` — which queue does each use, and in what order do they drain relative to each other?",
          },
          {
            q: "`setTimeout(fn, 0)` vs `setImmediate(fn)` — which runs first, and why is the answer \"it depends\" at the top level but deterministic inside an I/O callback?",
          },
          {
            q: "Why can starving the loop with `process.nextTick()` recursion prevent I/O and timers from ever running?",
          },
          {
            q: "What is the libuv thread pool, what uses it (fs, crypto, dns.lookup, zlib), and what is `UV_THREADPOOL_SIZE`?",
          },
          {
            q: "Is network I/O handled by the thread pool? Explain why sockets use the OS async primitives (epoll/kqueue/IOCP) instead.",
          },
          {
            q: "What does \"non-blocking\" actually mean when Node is single-threaded? Where does the real concurrency come from?",
          },
          {
            q: "What is a \"blocking\" operation in Node, and name three ways to accidentally block the loop (sync fs, big JSON.parse, tight CPU loop, regex catastrophic backtracking).",
          },
          {
            q: "How do you measure event-loop lag / delay, and what tools report it (`perf_hooks.monitorEventLoopDelay`, clinic, APM)?",
          },
          {
            q: "Predict the output: a script mixing `setTimeout`, `setImmediate`, `Promise.resolve().then`, `process.nextTick`, and a sync `console.log`. Explain each line.",
          },
          {
            q: "What happens to timer accuracy under load — why is `setTimeout(fn, 100)` not exactly 100ms?",
          },
          {
            q: "What is `setInterval` drift, and how do you build a reliable recurring task instead?",
          },
          {
            q: "How does `async/await` desugar in terms of the microtask queue — how many microtask ticks does one `await` cost?",
          },
          {
            q: "What is `Atomics.wait` / `SharedArrayBuffer`, and why would you basically never use it in typical app code?",
          },
          {
            q: "How does the event loop shut down — what keeps the process alive (open handles, timers, sockets), and what is `ref()` / `unref()`?",
          },
          {
            q: "Why does an unhandled `await` on a never-resolving promise silently hang the process with exit code 0?",
          },
          {
            q: "What runs during the `close` phase, and give an example (`socket.on('close')`).",
          },
          {
            q: "How do worker threads get their own event loop, and how does message passing between them interact with each loop?",
          },
          {
            q: "What is `performance.now()` vs `Date.now()` for measuring elapsed time, and why does monotonicity matter?",
          },
          {
            q: "Explain how a single slow synchronous handler in one request degrades latency for every other concurrent request.",
          },
          {
            q: "What changed about `Promise` microtask ordering and `process.nextTick` across Node versions — why should you not rely on subtle ordering?",
          },
        ],
      },
      {
        id: "node-async-patterns",
        number: 6,
        numLabel: "6b",
        title: "Node.js — Async Patterns: Callbacks, Promises, async/await",
        questions: [
          {
            q: "The error-first callback convention — what is the signature, and why does the error come first?",
          },
          {
            q: "What is \"callback hell\" / the pyramid of doom, and what are three ways out (named functions, promises, async/await)?",
          },
          {
            q: "How does error handling differ across callbacks, promises (`.catch`), and `async/await` (`try/catch`)?",
          },
          {
            q: "Why does a `throw` inside a bare callback (not promise-wrapped) crash the process instead of being catchable by the caller?",
          },
          {
            q: "`util.promisify` — what contract must a function follow for it to work, and what is `util.promisify.custom`?",
          },
          {
            q: "`Promise.all` vs `Promise.allSettled` vs `Promise.race` vs `Promise.any` — behaviour on the first rejection and the return shape of each.",
          },
          {
            q: "With `Promise.all`, one of ten calls rejects — what happens to the other nine in-flight promises?",
          },
          {
            q: "How do you run N async tasks with a concurrency limit of K (hand-rolled pool, or `p-limit`)?",
          },
          {
            q: "`for...of` with `await` inside vs `array.map(async ...)` + `Promise.all` — sequential vs parallel, and when do you want each?",
          },
          {
            q: "Why is `array.forEach(async ...)` a bug for sequential async work, and what does it actually do?",
          },
          {
            q: "What is an unhandled promise rejection, what does modern Node do on one (`--unhandled-rejections=throw`), and how do you catch them globally?",
          },
          {
            q: "What is a floating promise, and how does `no-floating-promises` (TS/ESLint) catch it?",
          },
          {
            q: "Why is mixing `await` and `.then()` on the same chain a readability / error-handling hazard?",
          },
          {
            q: "How do you add a timeout to a promise that has no native timeout (`Promise.race` with a timer, or `AbortSignal.timeout`)?",
          },
          {
            q: "What is `AbortController` / `AbortSignal`, and how do you use it to cancel `fetch`, timers, and streams?",
          },
          {
            q: "How do you retry an async operation with exponential backoff and jitter, and how do you cap total attempts / total time?",
          },
          {
            q: "What is the difference between returning a promise from an async function and `await`-ing it before returning (`return p` vs `return await p`) — does it matter for stack traces / try-catch?",
          },
          {
            q: "How do you convert an EventEmitter-based flow (e.g., a stream) into an async iterator you can `for await ... of`?",
          },
          {
            q: "Sequential vs batched processing of a large array of async jobs — how do you avoid opening 10,000 DB connections at once?",
          },
          {
            q: "What are async generators, and give a real use case (paginating an API, streaming DB rows)?",
          },
          {
            q: "Why can a synchronous exception thrown before the first `await` in an async function behave differently from a rejection after an `await`?",
          },
          {
            q: "How do you memoize an in-flight async call so concurrent callers share one promise (cache the promise, not the result)?",
          },
        ],
      },
      {
        id: "node-streams-buffers-files",
        number: 6,
        numLabel: "6c",
        title: "Node.js — Streams, Buffers & File I/O",
        questions: [
          {
            q: "The four stream types — Readable, Writable, Duplex, Transform — with one concrete Node example of each.",
          },
          {
            q: "What is backpressure, and how does `pipe()` (or `pipeline()`) handle it for you?",
          },
          {
            q: "Flowing vs paused mode for a Readable — what switches between them (`data` listener, `pause()`, `resume()`, `read()`)?",
          },
          {
            q: "`stream.pipeline()` vs `.pipe()` — why is `pipeline` preferred (error propagation, cleanup)?",
          },
          {
            q: "How do you write a Transform stream (e.g., CSV line parser, gzip, redaction) — the `_transform` and `_flush` methods?",
          },
          {
            q: "How do you process a file larger than RAM line-by-line (`readline`, or a split Transform) without buffering it all?",
          },
          {
            q: "Buffer vs string — when does encoding matter, and what bug appears if a multi-byte UTF-8 character is split across two chunks?",
          },
          {
            q: "`Buffer.alloc` vs `Buffer.allocUnsafe` vs `Buffer.from` — why is `allocUnsafe` unsafe and when is it fine?",
          },
          {
            q: "How do you stream a file upload straight to disk or to S3 without holding it in memory (`req` is a Readable stream)?",
          },
          {
            q: "How do you stream a large response to the client (`res` is a Writable) — e.g., a CSV export of millions of rows?",
          },
          {
            q: "`highWaterMark` — what does it control, and how does tuning it trade memory for throughput?",
          },
          {
            q: "How do errors propagate through a pipe chain, and why can an unhandled error in one stream leak file descriptors?",
          },
          {
            q: "`fs.readFile` vs `fs.createReadStream` — memory profile and when each is correct.",
          },
          {
            q: "`fs.promises` vs callback `fs` vs `fs.*Sync` — when is a sync call acceptable (startup config) and when is it a crime (request path)?",
          },
          {
            q: "How do you safely write a file so a crash mid-write can't corrupt it (write to temp + atomic rename)?",
          },
          {
            q: "What is `for await (const chunk of readable)` and how does it simplify stream consumption?",
          },
          {
            q: "How do you compose gzip + encryption + a network write as one pipeline, and where do you put error handling?",
          },
          {
            q: "How would you implement a rate-limited / throttled stream (bytes per second)?",
          },
        ],
      },
      {
        id: "node-modules-npm",
        number: 6,
        numLabel: "6d",
        title: "Node.js — Modules, npm & Packaging",
        questions: [
          {
            q: "CommonJS vs ES Modules — `require`/`module.exports` vs `import`/`export`, sync vs async loading, and `__dirname` availability.",
          },
          {
            q: "How does `require` resolution work — core module, relative path, then `node_modules` walk-up? What does `require.cache` do?",
          },
          {
            q: "Why is a CJS module's `exports` a live-ish object but ESM exports are live bindings — what breaks when you reassign `module.exports` late?",
          },
          {
            q: "How do you use ESM in a package (`\"type\": \"module\"`, `.mjs`), and how do you interop with a CJS-only dependency?",
          },
          {
            q: "What is the `exports` map in `package.json`, and how does it let you define conditional / subpath entry points?",
          },
          {
            q: "`dependencies` vs `devDependencies` vs `peerDependencies` vs `optionalDependencies` — what goes where?",
          },
          {
            q: "Semver ranges: `^1.2.3` vs `~1.2.3` vs `1.2.x` vs pinned — what each allows on `npm install`.",
          },
          {
            q: "What does `package-lock.json` guarantee, and what's the difference between `npm install` and `npm ci`?",
          },
          {
            q: "What is a phantom / undeclared dependency, and why does it work locally then break in CI or Docker?",
          },
          {
            q: "`npx` — what does it actually do, and what's the security consideration with running arbitrary packages?",
          },
          {
            q: "How do npm workspaces (or pnpm / Yarn / Nx / Turborepo) structure a monorepo of multiple services, and what does hoisting do?",
          },
          {
            q: "What are `preinstall` / `postinstall` scripts, and why are they a supply-chain risk (`--ignore-scripts`)?",
          },
          {
            q: "`npm audit` — what does it check, and how do you triage a transitive vulnerability you can't directly upgrade (`overrides`)?",
          },
          {
            q: "How do you publish a package — `files` allowlist, `.npmignore`, `prepublishOnly`, `npm pack` to inspect the tarball?",
          },
          {
            q: "How do you ship a TypeScript library — `types`/`typesVersions`, `.d.ts` output, dual CJS+ESM build?",
          },
          {
            q: "What is `engines` in `package.json`, and how do you enforce a Node version in CI and locally (`.nvmrc`, Volta)?",
          },
        ],
      },
      {
        id: "node-express-http-apis",
        number: 6,
        numLabel: "6e",
        title: "Node.js — Express & HTTP API Building",
        questions: [
          {
            q: "The Express middleware chain — signature `(req, res, next)`, calling `next()` vs `next(err)` vs sending a response, and what happens if you forget `next()`.",
          },
          {
            q: "Error-handling middleware — the four-arg signature `(err, req, res, next)` — where must it sit in the chain and how do you forward async errors to it (pre-Express-5 vs Express 5)?",
          },
          {
            q: "`app.use` vs `router` — how do you structure a large API into feature routers, and how does mount-path prefixing work?",
          },
          {
            q: "Route matching order — how does Express pick a handler, and what's the gotcha with `/users/:id` vs `/users/me`?",
          },
          {
            q: "`req.params` vs `req.query` vs `req.body` — what parses each, and why isn't `req.body` populated without `express.json()`?",
          },
          {
            q: "How do you set a body-size limit, and why does it matter for DoS protection?",
          },
          {
            q: "How do you validate and coerce request input — Zod / Joi / class-validator — and where in the chain does validation belong?",
          },
          {
            q: "How do you return consistent error responses (an error shape, a status-code mapping, a base `AppError` class)?",
          },
          {
            q: "What does `res.json()` do that `res.send()` doesn't, and how do you set status + headers correctly?",
          },
          {
            q: "Idempotency keys — how do you implement middleware that short-circuits a replayed POST with the same key?",
          },
          {
            q: "How do you implement request-scoped context (a correlation ID available everywhere) with `AsyncLocalStorage`?",
          },
          {
            q: "How do you handle CORS correctly — preflight, credentials, allowed origins — and what's the risk of `origin: '*'` with cookies?",
          },
          {
            q: "How do you attach and enforce authentication middleware, and how do you make some routes public and others protected cleanly?",
          },
          {
            q: "How do you implement pagination on a list endpoint (offset vs keyset), and what do you return in the response envelope?",
          },
          {
            q: "How do you stream a large response (NDJSON / CSV) instead of building a giant array in memory?",
          },
          {
            q: "How do you implement graceful shutdown — stop accepting connections, drain in-flight requests, close DB pool, hard-exit after a timeout?",
          },
          {
            q: "Express vs Fastify vs Nest vs raw `http` — what does each buy you, and when would you pick Fastify for performance?",
          },
          {
            q: "What is the role of a reverse proxy (Nginx) in front of Node — TLS termination, compression, static files, buffering slow clients — and what is `trust proxy`?",
          },
          {
            q: "How do you handle file uploads (`multer`) — memory vs disk storage, size/type limits, and streaming to object storage?",
          },
          {
            q: "How do you version an HTTP API (URL segment vs header vs `Accept` param), and how do you deprecate a version without breaking clients?",
          },
          {
            q: "How do you set security headers (Helmet) and why does each matter (HSTS, `X-Content-Type-Options`, CSP)?",
          },
          {
            q: "How do you implement per-route and per-user rate limiting, and why is an in-memory limiter wrong behind multiple instances?",
          },
          {
            q: "How do you add request timeouts — server `headersTimeout` / `requestTimeout`, and per-handler deadlines for downstream calls?",
          },
          {
            q: "How do you generate and serve OpenAPI/Swagger docs, and why does the contract matter to frontend teams?",
          },
        ],
      },
      {
        id: "node-errors-logging-debugging",
        number: 6,
        numLabel: "6f",
        title: "Node.js — Errors, Logging & Debugging",
        questions: [
          {
            q: "`uncaughtException` vs `unhandledRejection` — what should your handler actually do (log + graceful exit, not \"keep running\")?",
          },
          {
            q: "Why is it dangerous to swallow `uncaughtException` and continue serving requests?",
          },
          {
            q: "How do you design a custom error hierarchy (`AppError`, `NotFoundError`, `ValidationError`) with a status code and an `isOperational` flag?",
          },
          {
            q: "Operational errors vs programmer errors — how do you treat each differently?",
          },
          {
            q: "Why do you lose the stack trace across async boundaries sometimes, and what is `--async-stack-traces` / `Error.captureStackTrace`?",
          },
          {
            q: "Structured logging (pino / winston) vs `console.log` — JSON logs, log levels, and why `console.log` is synchronous-ish and can block.",
          },
          {
            q: "What is a correlation/trace ID, how do you generate one per request, and how do you thread it through every log line (`AsyncLocalStorage`)?",
          },
          {
            q: "How do you redact secrets / PII (tokens, card numbers, passwords) from logs automatically?",
          },
          {
            q: "How do you take and analyze a heap snapshot to find a memory leak — what does \"retained size\" and a growing object count tell you?",
          },
          {
            q: "Common Node memory-leak causes — module-scope arrays/maps that only grow, un-removed event listeners, closures over big objects, timers never cleared.",
          },
          {
            q: "How do you profile CPU — `--prof`, `--cpu-prof`, `clinic flame`, `0x` — and read a flame graph?",
          },
          {
            q: "How do you attach a debugger (`--inspect`, `--inspect-brk`, Chrome DevTools / VS Code) to a running service?",
          },
          {
            q: "`MaxListenersExceededWarning` — what causes it and how do you fix the root cause rather than raising the limit?",
          },
          {
            q: "How do you detect and act on event-loop blocking in production (a watchdog, `blocked-at`, APM alerts)?",
          },
          {
            q: "How do you wire an APM / error tracker (OpenTelemetry, Sentry) into a Node service, and what do traces give you that logs don't?",
          },
          {
            q: "How do you reproduce and debug a bug that only happens under load or only in production?",
          },
        ],
      },
      {
        id: "node-performance-concurrency",
        number: 6,
        numLabel: "6g",
        title: "Node.js — Performance, Concurrency & Scaling",
        questions: [
          {
            q: "`cluster` vs `worker_threads` vs `child_process` — memory model, communication, and the right job for each.",
          },
          {
            q: "When does `cluster` (or a process manager running N instances) help, and when does it not (I/O-bound vs CPU-bound)?",
          },
          {
            q: "How do worker threads share memory (`SharedArrayBuffer`, `MessagePort`, `workerData`), and what gets structured-cloned vs transferred?",
          },
          {
            q: "You have a CPU-heavy task (PDF generation, image resize, crypto, big aggregation) — how do you keep it off the main loop?",
          },
          {
            q: "How do you build and reuse a worker-thread pool instead of spawning a worker per task (`piscina`)?",
          },
          {
            q: "`child_process.spawn` vs `exec` vs `execFile` vs `fork` — buffering, shell injection risk, and when to use each.",
          },
          {
            q: "Why is `exec` with interpolated user input a command-injection hole, and what's the safe alternative?",
          },
          {
            q: "How does a load balancer + N stateless Node instances scale horizontally, and what must you NOT keep in process memory (sessions, rate-limit counters, caches)?",
          },
          {
            q: "How do you find a bottleneck — is it CPU, event-loop lag, GC, a slow downstream, or connection-pool exhaustion? What signal points to each?",
          },
          {
            q: "How does the V8 garbage collector work at a high level (young/old generation, scavenge vs mark-sweep), and what causes long GC pauses?",
          },
          {
            q: "`--max-old-space-size` — when do you raise it, and why is raising it usually treating a symptom?",
          },
          {
            q: "How do you keep HTTP keep-alive connections and a connection pool healthy for a service making many downstream calls (`http.Agent`, `keepAlive`)?",
          },
          {
            q: "How do you cap concurrency to a slow downstream so your service degrades gracefully instead of piling up requests?",
          },
          {
            q: "What is a circuit breaker, and how would you add one around a flaky dependency in Node (`opossum`)?",
          },
          {
            q: "How do you benchmark an endpoint (autocannon / k6) and interpret p50/p95/p99 and throughput under increasing concurrency?",
          },
          {
            q: "What common patterns waste CPU in a hot path (JSON.parse/stringify of huge payloads, `JSON` deep-clone, sync crypto, `moment`, regex)?",
          },
          {
            q: "How do you cache computed results in-process safely (LRU with a size cap and TTL) vs pushing the cache to Redis?",
          },
          {
            q: "What is `AsyncLocalStorage`'s performance cost, and is it acceptable for per-request context?",
          },
        ],
      },
      {
        id: "node-security",
        number: 6,
        numLabel: "6h",
        title: "Node.js — Security",
        questions: [
          {
            q: "How do you prevent SQL / NoSQL injection in Node — parameterized queries, query builders, and never string-concatenating user input?",
          },
          {
            q: "What is a NoSQL injection via an object body (`{ \"$gt\": \"\" }`), and how do you stop it (sanitize, cast types, `mongo-sanitize`)?",
          },
          {
            q: "Command injection through `child_process` — the vulnerable pattern and the fix (`execFile` with an args array, allowlists).",
          },
          {
            q: "How do you validate and normalize all external input at the edge, and why is \"validate at the boundary\" a security principle, not just a correctness one?",
          },
          {
            q: "Prototype pollution — what is it, how does a malicious `__proto__` in a JSON body cause it, and how do you defend (`Object.create(null)`, schema validation, `--disable-proto`)?",
          },
          {
            q: "How do you store passwords — bcrypt / argon2id, per-user salt, a work factor you can raise over time — and why never a fast hash (MD5/SHA-256)?",
          },
          {
            q: "How do you generate secure random values (`crypto.randomBytes`, `crypto.randomUUID`) and why is `Math.random()` not acceptable for tokens?",
          },
          {
            q: "How do you compare secrets / HMACs in constant time (`crypto.timingSafeEqual`) and why does `===` leak?",
          },
          {
            q: "How do you verify an inbound webhook — HMAC signature over the raw body, timestamp tolerance, replay protection — and why must you use the raw bytes not the parsed JSON?",
          },
          {
            q: "How do you keep secrets out of the repo and out of logs — env vars, a secrets manager / Vault, `.env` only for local, and 12-factor config?",
          },
          {
            q: "SSRF — how could an \"import from URL\" or an image-proxy feature be abused to hit internal metadata endpoints, and how do you restrict it?",
          },
          {
            q: "Path traversal — how does `../../etc/passwd` sneak through a file-download endpoint, and how do you normalize and confine paths?",
          },
          {
            q: "Rate limiting and account lockout as defenses against credential stuffing and brute force — where do you apply them and what are the trade-offs?",
          },
          {
            q: "Supply-chain risk — lockfiles, `npm ci`, `--ignore-scripts`, provenance, Dependabot/Renovate, and minimizing dependency count.",
          },
          {
            q: "What does Helmet set, and which headers matter most for an API vs a server-rendered app (CSP, HSTS, `X-Frame-Options`)?",
          },
          {
            q: "How do you handle regex denial of service (ReDoS) — spotting catastrophic backtracking and using safe patterns or a timeout?",
          },
        ],
      },
      {
        id: "node-testing",
        number: 6,
        numLabel: "6i",
        title: "Node.js — Testing",
        questions: [
          {
            q: "Unit vs integration vs end-to-end for a Node API — what does each cover and what's a sane ratio?",
          },
          {
            q: "The built-in `node:test` runner vs Jest vs Vitest vs Mocha — trade-offs (ESM support, speed, mocking, watch).",
          },
          {
            q: "How do you mock a module dependency — `jest.mock`, `sinon`, or dependency injection — and why is DI easier to test than a hard `require`?",
          },
          {
            q: "How do you test an Express route handler in isolation — call it with fake `req`/`res`, or hit it through `supertest`?",
          },
          {
            q: "How do you mock the database layer — an in-memory fake, a repository interface, or `testcontainers` for a real DB?",
          },
          {
            q: "How do you test time-dependent code (`setTimeout`, TTLs, `Date.now()`) — fake timers and injectable clocks?",
          },
          {
            q: "How do you test code that uses randomness or UUIDs deterministically?",
          },
          {
            q: "How do you test retry / backoff logic without actually sleeping for seconds?",
          },
          {
            q: "How do you assert on emitted events, streamed output, or async iteration in a test?",
          },
          {
            q: "What makes a Node test flaky (real network, shared global state, unclosed handles, order dependence, real timers), and how do you find leaked handles (`--detectOpenHandles`)?",
          },
          {
            q: "How do you write an integration test that spins up the app, seeds a DB, runs requests, and tears down cleanly?",
          },
          {
            q: "What does code coverage miss — why can 100% line coverage still let a bug through?",
          },
          {
            q: "How do you structure test data / fixtures / factories so tests stay readable as they grow?",
          },
          {
            q: "How do you run tests in CI — parallelism, a fresh DB per shard, and keeping them under a few minutes?",
          },
        ],
      },
      {
        id: "node-data-access-caching",
        number: 6,
        numLabel: "6j",
        title: "Node.js — Databases, Caching & Data Access",
        questions: [
          {
            q: "Why does a connection pool matter, what happens when it's exhausted, and how do you size `min`/`max` for a given instance count?",
          },
          {
            q: "How do you run a multi-statement DB transaction correctly in Node (acquire a client, `BEGIN`/`COMMIT`/`ROLLBACK`, always release in `finally`)?",
          },
          {
            q: "Prisma vs TypeORM vs Sequelize vs Knex vs raw driver — what does each abstraction cost and buy you?",
          },
          {
            q: "What is the ORM N+1 problem in a Node API, how do you detect it (query logging), and how do you fix it (eager load / join / dataloader)?",
          },
          {
            q: "What is `DataLoader`, and how does per-request batching + caching solve N+1 in a GraphQL resolver?",
          },
          {
            q: "How do you paginate a large result set from Node without loading it all — cursor/keyset queries and streaming rows?",
          },
          {
            q: "How do you handle migrations in a Node deploy (a migration tool, run-on-boot vs a separate step, and backward-compatible changes for zero downtime)?",
          },
          {
            q: "Where do you add caching — in front of the DB (Redis read-through), in-process LRU, or HTTP caching — and how do you invalidate on write?",
          },
          {
            q: "Cache-aside vs write-through in a Node service — show the read and write path and the failure modes (stale data, thundering herd).",
          },
          {
            q: "How do you prevent a cache stampede when a hot key expires (lock / single-flight / probabilistic early expiry)?",
          },
          {
            q: "How do you use Redis for more than caching in Node — rate limiting, a distributed lock, a queue, pub/sub — and the caveats of each (Redlock debate)?",
          },
          {
            q: "How do you keep money-related reads correct under concurrency from Node — `SELECT ... FOR UPDATE`, optimistic version columns, or serializable isolation with retry?",
          },
          {
            q: "How do you retry a transient DB error (deadlock, connection reset) safely, and which errors must you NOT retry?",
          },
          {
            q: "How do you avoid leaking DB clients / handles on the error path, and how do you spot it in production (pool wait time climbing)?",
          },
          {
            q: "How would you implement a transactional outbox in a Node service so an event is published if and only if the DB write commits?",
          },
          {
            q: "How do you talk to a message broker from Node (Kafka / RabbitMQ / SQS) — consumer acking, at-least-once, and making the handler idempotent?",
          },
        ],
      },
      {
        id: "node-auth-sessions",
        number: 6,
        numLabel: "6k",
        title: "Node.js — Authentication & Sessions",
        questions: [
          {
            q: "Session-cookie auth vs stateless JWT in a Node API — where is state kept, how do you revoke, and how does each scale across instances?",
          },
          {
            q: "How do you implement server-side sessions (`express-session` + a Redis store) — cookie flags (`httpOnly`, `secure`, `sameSite`), TTL, and rolling sessions?",
          },
          {
            q: "How do you issue and verify a JWT in Node (`jsonwebtoken` / `jose`) — signing algorithm, `exp`/`iat`/`aud`/`iss`, and clock tolerance?",
          },
          {
            q: "Why must you pin the `algorithms` list when verifying a JWT, and what is the `alg: none` / algorithm-confusion attack?",
          },
          {
            q: "HS256 vs RS256 in a multi-service setup — who holds the secret vs the public key, and how do you rotate keys (a JWKS endpoint, `kid`)?",
          },
          {
            q: "Access token + refresh token flow in Node — storage on the client, refresh rotation, reuse detection, and \"logout everywhere\".",
          },
          {
            q: "When 5 concurrent requests all get a 401 and try to refresh at once, how do you single-flight the refresh on the client and/or server?",
          },
          {
            q: "How do you build role/permission checks as middleware (RBAC), and how do you avoid scattering `if (user.role === ...)` everywhere?",
          },
          {
            q: "How do you implement API-key auth for machine clients — hashing keys at rest, scoping, rotation, and rate limiting per key?",
          },
          {
            q: "OAuth2 authorization-code + PKCE flow — what does a Node backend-for-frontend actually do in each step (`passport`, or hand-rolled)?",
          },
          {
            q: "OAuth2 client-credentials flow for service-to-service — how do you fetch, cache, and refresh the token before it expires?",
          },
          {
            q: "CSRF — when is a Node API actually vulnerable (cookie auth) vs not (bearer token), and what's the mitigation (SameSite, CSRF token, double-submit)?",
          },
          {
            q: "How do you add step-up auth / MFA for a sensitive action even though the user already has a valid session?",
          },
          {
            q: "How do you store and verify TOTP secrets, and how do you rate-limit OTP verification to stop brute force?",
          },
        ],
      },
      {
        id: "node-practical-extended",
        number: 6,
        numLabel: "6l",
        title: "Node.js — Practical Build Tasks (Extended)",
        questions: [
          {
            q: "Build a CSV-to-DB import that streams a multi-GB file, validates each row, batches inserts, skips + reports bad rows, and is resumable.",
          },
          {
            q: "Build a large data export endpoint that streams NDJSON/CSV to the client without buffering, with a DB cursor.",
          },
          {
            q: "Implement an in-memory job queue with concurrency limit, retry with exponential backoff, and a dead-letter list.",
          },
          {
            q: "Implement token-bucket rate-limiting middleware from scratch (no library), then adapt it to be Redis-backed for multiple instances.",
          },
          {
            q: "Implement idempotency-key middleware backed by Redis: first request runs, replays return the stored response, concurrent replays wait.",
          },
          {
            q: "Implement graceful shutdown: stop the listener, finish in-flight requests, close DB + Redis, force-exit after a timeout, handle `SIGTERM`/`SIGINT`.",
          },
          {
            q: "Build request-context propagation with `AsyncLocalStorage` so every log line and downstream call carries the correlation ID.",
          },
          {
            q: "Build a worker-thread pool that offloads a CPU-heavy transform and returns results without blocking the API.",
          },
          {
            q: "Build a webhook receiver: verify HMAC over the raw body, dedupe by event ID, handle out-of-order delivery, ack fast and process async.",
          },
          {
            q: "Build an outgoing webhook sender with retries, exponential backoff, a max-attempts cap, and disabling of permanently-failing endpoints.",
          },
          {
            q: "Build a `fetch` wrapper with timeout (`AbortSignal`), retry on 5xx/network, circuit breaker, and structured error mapping.",
          },
          {
            q: "Build a money-transfer endpoint: DB transaction, row locking or optimistic concurrency, idempotency key, and a compensating action on partial failure.",
          },
          {
            q: "Build a WebSocket server that authenticates the connection, tracks clients, broadcasts, and cleans up on disconnect + heartbeats.",
          },
          {
            q: "Build a caching layer for a read-heavy endpoint with single-flight (no stampede), TTL, and explicit invalidation on write.",
          },
        ],
      },
      {
        id: "aspnet-theoretical",
        number: 7,
        title: "ASP.NET Core Web API — Theoretical",
        questions: [
          {
            q: "Explain the ASP.NET Core middleware pipeline. Does order matter? Give an example where it does.",
          },
          {
            q: "Explain DI lifetimes: Transient, Scoped, Singleton. What is the \"captive dependency\" problem?",
          },
          {
            q: "EF Core change tracking — what does `AsNoTracking()` do and when should you use it? Eager vs lazy vs explicit loading?",
          },
          {
            q: "How do EF Core migrations work? How do you handle migrations safely in a production deployment?",
          },
          {
            q: "How would you implement JWT authentication in a Web API? Explain token issuance, validation, refresh tokens, and claims-based authorization.",
          },
          {
            q: "Middleware vs filters vs attributes — how are they different and when do you use each?",
          },
          {
            q: "How does model binding work? What does `[ApiController]` do automatically for validation?",
          },
          { q: "How do you centralize exception handling? What is `ProblemDetails`?" },
          {
            q: "How do you configure CORS properly, and where in the pipeline does it need to sit?",
          },
          {
            q: "What are the API versioning strategies (URL segment, query string, header)? Trade-offs?",
          },
          {
            q: "Caching in ASP.NET Core — in-memory (`IMemoryCache`) vs distributed (Redis) vs output caching. How do you invalidate a cache entry?",
          },
          {
            q: "What is `IHostedService`/`BackgroundService` used for? Give a real use case.",
          },
          {
            q: "Explain the Options pattern (`IOptions<T>`, `IOptionsSnapshot<T>`, `IOptionsMonitor<T>`) for configuration.",
          },
          {
            q: "Why use structured logging (e.g., Serilog) over `Console.WriteLine`? What is a correlation ID and why does it matter?",
          },
          {
            q: "How do you unit test a controller/service that depends on EF Core? What's the role of `WebApplicationFactory` in integration tests?",
          },
          { q: "Minimal APIs vs Controller-based APIs — trade-offs?" },
          {
            q: "Async/await best practices in ASP.NET Core — how can misusing `async` cause a deadlock, and what does `ConfigureAwait` do?",
          },
          { q: "What are health checks and why are they important in production?" },
          {
            q: "How does the built-in .NET rate limiter work (fixed window, sliding window, token bucket, concurrency limiter)?",
          },
          {
            q: "Repository pattern on top of EF Core — pros and cons? Is it always necessary?",
          },
          { q: "gRPC vs REST in a .NET context — when would you pick gRPC?" },
          {
            q: "What is SignalR used for? High-level explanation of how it maintains a real-time connection (WebSockets fallback chain).",
          },
          {
            q: "How do you secure sensitive configuration (connection strings, API keys) in ASP.NET Core (User Secrets, Key Vault, environment variables)?",
          },
          {
            q: "Explain optimistic concurrency control in EF Core (`RowVersion`/concurrency tokens) — why does it matter for something like an account balance update?",
          },
          {
            q: "Kestrel vs IIS — what's Kestrel's role, and what does a reverse proxy (IIS/Nginx) add in front of it?",
          },
          {
            q: "In-process vs out-of-process hosting model on IIS — what's the difference?",
          },
          {
            q: "How do you containerize an ASP.NET Core API with Docker? What goes in a typical multi-stage Dockerfile?",
          },
          {
            q: "How do you generate and use Swagger/OpenAPI docs for a Web API, and why does that matter for frontend/consumer teams?",
          },
          {
            q: "Response compression and output caching in ASP.NET Core — when do they help vs hurt?",
          },
          {
            q: "How does culture/localization work in ASP.NET Core for a multi-region fintech product (currency formatting, decimal separators)?",
          },
          {
            q: "What's the difference between `IActionResult`, `ActionResult<T>`, and returning a POCO directly from a controller action?",
          },
          {
            q: "How would you implement request/response logging without leaking sensitive fields (card numbers, tokens) into logs?",
          },
        ],
      },
      {
        id: "aspnet-practical",
        number: 8,
        title: "ASP.NET Core Web API — Practical / Technical Round",
        questions: [
          {
            q: "Scaffold a Web API controller with full EF Core CRUD for one entity, from a blank project.",
          },
          {
            q: "Implement JWT authentication end-to-end: issue a token on login, protect an endpoint with `[Authorize]`, add role-based authorization.",
          },
          {
            q: "Write custom middleware that logs request method, path, and response time.",
          },
          {
            q: "You're given a deliberately N+1 EF Core query — fix it using `Include()` or a projection.",
          },
          {
            q: "Implement a `BackgroundService` that polls a queue/table every N seconds and processes new items.",
          },
          {
            q: "Set up global exception-handling middleware that returns a consistent JSON error response.",
          },
          {
            q: "Write an integration test for an API endpoint using `WebApplicationFactory`.",
          },
          {
            q: "Implement optimistic concurrency control on an entity update (e.g., prevent two concurrent updates from silently overwriting a wallet balance).",
          },
          {
            q: "Configure and use distributed caching (Redis) for a read-heavy endpoint, with a sensible invalidation strategy.",
          },
          {
            q: "Design and implement a money-transfer endpoint with proper transaction handling and idempotency-key support (same request replayed shouldn't double-transfer).",
          },
          {
            q: "Implement pagination (keyset-based) on a large transactions list endpoint.",
          },
          {
            q: "Add FluentValidation (or data annotations) to validate a complex request DTO with nested objects.",
          },
          {
            q: "Implement API versioning for an existing controller without breaking existing consumers.",
          },
          {
            q: "Add a health check endpoint that verifies both the database and a downstream dependency are reachable.",
          },
          {
            q: "Write a Dockerfile for the API and get it running with `docker run`, including environment-based configuration.",
          },
        ],
      },
    ],
  },
  {
    id: "part-b",
    label: "Part B",
    title: "System Design & Architecture",
    categories: [
      {
        id: "system-design-theoretical",
        number: 9,
        title: "System Design (Intermediate, Fintech-Flavored) — Theoretical",
        questions: [
          {
            q: "How does a load balancer decide where to route traffic? Explain L4 vs L7 load balancing and common algorithms (round robin, least connections, weighted).",
          },
          {
            q: "Explain caching strategies: cache-aside, write-through, write-behind. How and when do you invalidate?",
          },
          {
            q: "How do you scale a database — replication vs sharding? What is replication lag and why does it matter?",
          },
          {
            q: "Explain CAP theorem and how it applies to real distributed systems (given partitions are inevitable, what's the actual trade-off?).",
          },
          {
            q: "Why use a message queue between services? At-least-once vs exactly-once vs at-most-once delivery — what's realistically achievable?",
          },
          {
            q: "What is idempotency and why is it critical in payment APIs? How do you implement an idempotency key?",
          },
          {
            q: "Explain rate-limiting algorithms: token bucket, leaky bucket, fixed window, sliding window log/counter.",
          },
          {
            q: "What is the saga pattern for distributed transactions? Choreography vs orchestration?",
          },
          { q: "What does an API Gateway do in a microservices architecture?" },
          {
            q: "Strong consistency vs eventual consistency — when is eventual consistency acceptable, and when is it not (e.g., account balance)?",
          },
          {
            q: "How do you design for high availability — failover, redundancy, circuit breakers, retries with backoff?",
          },
          {
            q: "What is event-driven architecture? Briefly explain event sourcing and CQRS.",
          },
          {
            q: "How do you handle a distributed transaction that spans multiple services/databases without a 2-phase commit?",
          },
          {
            q: "How would you design an immutable audit trail / ledger for financial transactions?",
          },
          {
            q: "How do you prevent double-spending / race conditions when two requests try to debit the same account balance simultaneously?",
          },
          { q: "What is a circuit breaker pattern and when does it trip?" },
          {
            q: "How would you design a system to be resilient to a downstream payment provider being slow or down?",
          },
          {
            q: "What is consistent hashing and where is it used (e.g., distributed caching, sharding)?",
          },
          {
            q: "What role does a CDN play, and what would/wouldn't you put behind one in a fintech app?",
          },
          {
            q: "Explain DNS resolution at a level relevant to system design (why DNS matters for failover/latency).",
          },
          {
            q: "What is service discovery in a microservices setup, and why do you need it?",
          },
          {
            q: "What's the difference between horizontal and vertical scaling, and where does each hit a wall?",
          },
          {
            q: "How do you estimate capacity for a system (back-of-envelope: requests/sec, storage growth, bandwidth)?",
          },
          {
            q: "What is a bulkhead pattern, and how does it prevent one failing dependency from taking down the whole system?",
          },
        ],
      },
      {
        id: "system-design-practical",
        number: 10,
        title: "System Design — Practical (Design Exercises)",
        questions: [
          {
            q: "Design a digital wallet system: deposit, withdraw, transfer between users, balance check.",
          },
          {
            q: "Design a payment gateway integration layer that handles retries and idempotency correctly.",
          },
          { q: "Design a rate limiter for a public-facing API." },
          {
            q: "Design a transaction notification system (email/SMS/push) triggered on account activity.",
          },
          {
            q: "Design a high-level real-time fraud-flagging pipeline for incoming transactions.",
          },
          { q: "Design a URL shortener (classic warm-up system design question)." },
          {
            q: "Design a scalable transaction-history/ledger query system that stays fast as data grows (pagination, indexing, archiving strategy).",
          },
          {
            q: "Design a nightly reconciliation system that compares transaction records between two services and flags mismatches.",
          },
          {
            q: "Design the backend for a bill-split / group-expense feature (think Splitwise-style) with correct balance calculations.",
          },
          {
            q: "Design a system for scheduled/recurring payments (e.g., subscriptions or standing instructions).",
          },
          {
            q: "Design a KYC/document-upload and verification workflow (upload, virus-scan, review queue, status tracking).",
          },
          {
            q: "Design a system that enforces daily/monthly transaction limits per user across multiple concurrent requests.",
          },
          {
            q: "Design an audit-log service that every other microservice writes to, without becoming a bottleneck.",
          },
          {
            q: "Design a notification/alerting system for suspicious login attempts across multiple devices.",
          },
        ],
      },
      {
        id: "microservices-patterns",
        number: 11,
        title: "Microservices Architecture Patterns",
        questions: [
          {
            q: "Monolith vs microservices — what specific problems does splitting up actually solve, and what does it cost you?",
          },
          {
            q: "How do you handle shared data/config between microservices without tight coupling?",
          },
          {
            q: "Database-per-service vs shared database — trade-offs, and why is shared database usually discouraged?",
          },
          {
            q: "How do you handle versioned contracts between services (backward compatibility of APIs/events)?",
          },
          {
            q: "What is the strangler fig pattern for migrating a monolith to microservices?",
          },
          {
            q: "How do you trace a single request as it flows across 5 microservices (distributed tracing, correlation/trace IDs)?",
          },
          { q: "What is an anti-corruption layer, and when would you build one?" },
          {
            q: "How do you handle a partial failure where 2 of 3 services in a workflow succeeded and one failed?",
          },
        ],
      },
      {
        id: "message-brokers",
        number: 12,
        title: "Message Brokers (Kafka / RabbitMQ)",
        questions: [
          {
            q: "Kafka vs RabbitMQ — fundamental differences (log-based vs traditional queue) and when you'd pick each.",
          },
          {
            q: "What is a Kafka topic, partition, and consumer group? How does partitioning affect ordering guarantees?",
          },
          {
            q: "What is message ordering, and how do you guarantee order per key in Kafka?",
          },
          {
            q: "What happens when a consumer crashes mid-processing — how do you avoid losing or duplicating a message?",
          },
          { q: "What is a dead-letter queue, and how do you use one?" },
          {
            q: "Explain \"at-least-once\" delivery and why consumers need to be idempotent as a result.",
          },
        ],
      },
    ],
  },
  {
    id: "part-c",
    label: "Part C",
    title: "Data Structures & Algorithms",
    categories: [
      {
        id: "dsa-theoretical",
        number: 13,
        title: "DSA — Theoretical / Conceptual",
        questions: [
          { q: "Explain Big-O notation and best/worst/average case complexity." },
          {
            q: "Array vs Linked List — trade-offs in access, insertion, deletion.",
          },
          {
            q: "How does a hashmap work internally? How are collisions handled? What is load factor?",
          },
          { q: "Stack vs Queue — real-world use cases for each." },
          { q: "Explain the two-pointer technique with an example problem type." },
          { q: "Explain the sliding window technique with an example problem type." },
          {
            q: "Recursion vs iteration — what's the risk of deep recursion (stack overflow), and when do you prefer one over the other?",
          },
          {
            q: "Compare common sorting algorithms (bubble, insertion, selection, merge, quick, heap) by time/space complexity and stability.",
          },
          {
            q: "BFS vs DFS — differences, and which would you use for shortest path in an unweighted graph?",
          },
          {
            q: "Basic tree concepts — binary tree vs binary search tree, what property must a BST maintain?",
          },
          {
            q: "What is dynamic programming? How do you recognize a problem needs it (overlapping subproblems, optimal substructure)?",
          },
          {
            q: "Greedy vs DP — give an example where a greedy approach fails but DP works.",
          },
          {
            q: "How do you approach an unfamiliar coding problem in an interview (clarify → brute force → optimize)?",
          },
          {
            q: "What is a heap / priority queue, and what operations is it good for?",
          },
          {
            q: "What is a trie, and what kind of problems is it built for (prefix search, autocomplete)?",
          },
          {
            q: "What is backtracking, and how does it differ from plain recursion/brute force?",
          },
          {
            q: "Basic bit-manipulation concepts — how would you check if a number is a power of two, or count set bits?",
          },
          {
            q: "What is Dijkstra's algorithm used for, at a high level, and what's its complexity?",
          },
          {
            q: "What is topological sort, and what kind of problem requires it (e.g., task scheduling with dependencies)?",
          },
        ],
      },
      {
        id: "dsa-practical",
        number: 14,
        title: "DSA — Practical (Problem Patterns to Practice)",
        questions: [
          { q: "Two Sum / pair-sum-equals-target variants." },
          { q: "Longest substring without repeating characters (sliding window)." },
          { q: "Valid parentheses / balanced brackets (stack)." },
          { q: "Merge two sorted arrays or linked lists." },
          { q: "Find the duplicate number in an array." },
          { q: "Reverse a linked list (iterative and recursive)." },
          { q: "Detect a cycle in a linked list (Floyd's cycle detection)." },
          { q: "Binary tree level-order traversal (BFS)." },
          { q: "Find the Kth largest/smallest element in an array." },
          { q: "Group anagrams (hashmap-based grouping)." },
          { q: "Maximum subarray sum (Kadane's algorithm)." },
          { q: "Number of islands / basic grid DFS-BFS problem." },
          { q: "Move zeroes to the end of an array in-place." },
          { q: "Find the missing number in a range 1 to N." },
          {
            q: "Implement LRU cache (combines hashmap + doubly linked list — common in fintech-adjacent interviews too).",
          },
          { q: "Check if a binary tree is balanced / is a valid BST." },
          {
            q: "Find all pairs in an array that sum to a target (variations: unsorted, sorted, with duplicates).",
          },
          { q: "Rotate an array by K positions in-place." },
          {
            q: "Implement a basic rate limiter using a sliding window counter (DSA + system design crossover, common at fintech companies).",
          },
          {
            q: "Merge overlapping intervals (common for scheduling/time-range problems).",
          },
        ],
      },
    ],
  },
  {
    id: "part-d",
    label: "Part D",
    title: "Cross-Cutting Engineering",
    categories: [
      {
        id: "http-rest",
        number: 15,
        title: "HTTP & REST API Design",
        questions: [
          {
            q: "Explain the main HTTP methods (GET, POST, PUT, PATCH, DELETE) and their idempotency/safety guarantees.",
            followups: [
              "Is PUT idempotent? Is POST? Why does that matter for retries?",
            ],
          },
          {
            q: "What are the common HTTP status code ranges, and what do 401 vs 403 actually mean (and how are they different)?",
          },
          {
            q: "What makes an API \"RESTful\"? What is HATEOAS and is it actually used in practice?",
          },
          {
            q: "How do you design good REST resource URLs (nesting, filtering, pagination, sorting conventions)?",
          },
          { q: "What is the difference between PUT and PATCH for a partial update?" },
          { q: "How do you version a public API without breaking existing consumers?" },
          { q: "What is content negotiation (Accept/Content-Type headers)?" },
          {
            q: "How do you design an API to be idempotent for a non-idempotent operation like \"charge a card\"?",
          },
          {
            q: "What is HTTP/2 (or HTTP/3) and what does it improve over HTTP/1.1?",
          },
          {
            q: "Explain CORS from the browser's perspective — preflight requests, what triggers one.",
          },
        ],
      },
      {
        id: "auth",
        number: 16,
        title: "Authentication & Authorization",
        questions: [
          {
            q: "Session-based auth vs token-based (JWT) auth — trade-offs (statelessness, revocation, scaling).",
          },
          {
            q: "What's inside a JWT (header, payload, signature)? Is a JWT encrypted or just signed — what does that mean for sensitive data?",
          },
          {
            q: "How do you handle JWT revocation/logout if JWTs are stateless by design?",
          },
          {
            q: "Access token vs refresh token — why have both? Where should each be stored on the client (and why is localStorage risky for tokens)?",
          },
          {
            q: "Explain OAuth2 at a high level — what problem does it solve, and what are the main grant types (authorization code, client credentials)?",
          },
          {
            q: "OAuth2 vs OpenID Connect — what does OIDC add on top of OAuth2?",
          },
          {
            q: "What is SSO (Single Sign-On) and how does it typically work across multiple apps?",
          },
          {
            q: "Role-based access control (RBAC) vs claims-based / attribute-based access control (ABAC) — differences?",
          },
          {
            q: "How would you implement \"step-up authentication\" for a high-value action (e.g., requiring MFA before a large transfer)?",
          },
          {
            q: "What is CSRF, and how do you protect against it (especially relevant if you use cookies for auth)?",
          },
        ],
      },
      {
        id: "jwt-refresh-edge-cases",
        number: 16,
        numLabel: "16b",
        title: "JWT & Refresh Tokens — Tricky / Edge-Case Questions",
        questions: [
          {
            q: "If someone steals a JWT access token, how do you invalidate it before it naturally expires, given JWTs are stateless?",
            followups: [
              "Would you maintain a server-side blacklist? What does that cost you in terms of \"statelessness\"?",
            ],
          },
          {
            q: "Why is storing a JWT in localStorage considered risky? Why is an httpOnly cookie safer against XSS but not against CSRF? How would you protect against both at once?",
          },
          {
            q: "What is the \"alg: none\" JWT vulnerability, and how do you prevent it in your token verification code?",
          },
          {
            q: "Symmetric (HS256) vs asymmetric (RS256) signing — why would a microservices architecture prefer RS256?",
            followups: [
              "If Service A issues the token and Service B only verifies it, what does each side actually need (the secret vs the public key)?",
            ],
          },
          {
            q: "How do you rotate your JWT signing key without invalidating every currently-active session?",
          },
          {
            q: "What happens if there's clock skew between your auth server and your API server around the `exp`/`nbf` claims?",
          },
          {
            q: "You store user roles/permissions inside the JWT payload for fast authorization checks — what breaks when an admin revokes a user's role mid-session, before the token expires?",
          },
          {
            q: "Why have both a short-lived access token and a long-lived refresh token instead of just one long-lived token?",
          },
          {
            q: "Where should a refresh token be stored, and why (httpOnly secure cookie vs local storage vs a backend session store)?",
          },
          {
            q: "What is refresh token rotation, and how does it help detect token theft (reuse detection)?",
            followups: [
              "If a stolen refresh token is used after the legitimate user already rotated it, what should your system do?",
            ],
          },
          {
            q: "Two browser tabs both try to refresh the access token at the same time using the same refresh token — what race condition can occur, and how do you prevent it?",
          },
          { q: "How would you implement \"logout from all devices\"?" },
          {
            q: "What is a JWT replay attack, and what mitigations exist (short expiry, a nonce/`jti` claim, binding to IP/device)?",
          },
          {
            q: "If your JWT payload grows large (many claims), what problems does that cause (header size limits, cookie size limits, added latency)?",
          },
          {
            q: "How do you securely pass a JWT between a browser SPA and a backend when they're hosted on different subdomains/origins?",
          },
          {
            q: "Your access token expires while a long file upload is mid-flight — how should the client/server handle that gracefully?",
          },
        ],
      },
      {
        id: "two-factor-auth",
        number: 16,
        numLabel: "16c",
        title: "Two-Factor Authentication (2FA / MFA)",
        questions: [
          {
            q: "How does TOTP (Time-based One-Time Password, e.g., Google Authenticator) actually work under the hood?",
            followups: [
              "What role does the shared secret and the current timestamp play in generating the code?",
              "Why do TOTP validators usually allow a ±1 time-step window?",
            ],
          },
          {
            q: "SMS OTP vs authenticator-app TOTP vs push-based approval — trade-offs (security, cost, UX, SIM-swap risk)?",
          },
          {
            q: "How would you design account recovery when a user loses the device with their authenticator app?",
          },
          {
            q: "How do you rate-limit OTP verification attempts to prevent brute-forcing a 6-digit code?",
          },
          {
            q: "How would you securely store a user's TOTP secret on the server?",
          },
          {
            q: "What is \"2FA fatigue\" / MFA push-bombing, and how do you design push-based 2FA to resist it?",
          },
          {
            q: "How would you implement step-up authentication — requiring 2FA only for a sensitive action (e.g., a large money transfer) even though the user is already logged in?",
          },
          {
            q: "How do backup/recovery codes work, and how should they be stored and invalidated after use?",
          },
          {
            q: "Would you enforce 2FA on every login or only on new/unrecognized devices — what's the trade-off?",
          },
        ],
      },
      {
        id: "ldap-directory-auth",
        number: 16,
        numLabel: "16d",
        title: "LDAP & Enterprise Directory Authentication",
        questions: [
          {
            q: "What is LDAP, and what problem does it solve for enterprise authentication?",
          },
          {
            q: "Explain the LDAP bind authentication flow — how does an app verify a username/password against Active Directory/LDAP?",
          },
          {
            q: "LDAP vs OAuth2/SAML/OIDC — when would an enterprise fintech product actually need LDAP (hint: internal employee/admin tooling vs customer-facing auth)?",
          },
          {
            q: "What is LDAP injection, and how do you prevent it (same family of concern as SQL injection)?",
          },
          {
            q: "How would you integrate ASP.NET Core with an on-prem Active Directory for internal admin-tool authentication?",
          },
          {
            q: "How do you map LDAP/AD groups to application-level roles/permissions?",
          },
          {
            q: "What is LDAPS, and why would you require it over plain LDAP?",
          },
          {
            q: "What are the performance considerations of hitting an LDAP server on every request vs caching group membership?",
          },
        ],
      },
      {
        id: "patterns-solid",
        number: 17,
        title: "Design Patterns & SOLID Principles",
        questions: [
          {
            q: "Explain each SOLID principle with a short example from a system you've built.",
          },
          {
            q: "Singleton pattern — how is it implemented, and what problems can it cause (e.g., in testing, in DI containers)?",
          },
          {
            q: "Repository pattern and Unit of Work — what do they abstract, and are they redundant with EF Core's own `DbContext`?",
          },
          {
            q: "Factory pattern vs Dependency Injection — how do they relate?",
          },
          {
            q: "Strategy pattern — give an example (e.g., switching between payment providers at runtime).",
          },
          {
            q: "Observer pattern — where have you seen it used (hint: RxJS/EventEmitter are essentially this)?",
          },
          {
            q: "What is the Decorator pattern, and how does middleware relate to it?",
          },
          {
            q: "What is Clean Architecture / Onion Architecture, and why separate domain logic from infrastructure (DB, web framework)?",
          },
        ],
      },
      {
        id: "security-fundamentals",
        number: 18,
        title: "Security Fundamentals",
        questions: [
          {
            q: "Name a few items from the OWASP Top 10 and how you've mitigated them in real code.",
          },
          {
            q: "What is XSS, and how do frontend frameworks like Angular help prevent it by default?",
          },
          {
            q: "What is SQL injection, and why do parameterized queries fully prevent it?",
          },
          { q: "What is CSRF, and how is it different from XSS?" },
          {
            q: "How do you securely store passwords (hashing algorithms like bcrypt/argon2, salting)?",
          },
          {
            q: "What is HTTPS/TLS actually protecting against, at a high level (encryption in transit, certificate validation)?",
          },
          {
            q: "How would you handle PCI-DSS-adjacent concerns if your system ever touches card data (tokenization, not storing raw PAN)?",
          },
          {
            q: "What is rate limiting/throttling protecting against beyond just \"abuse\" (e.g., credential stuffing, brute force)?",
          },
          {
            q: "How do you avoid leaking sensitive data (PII, tokens, card numbers) in logs, error messages, or API responses?",
          },
        ],
      },
      {
        id: "git-version-control",
        number: 19,
        title: "Git & Version Control",
        questions: [
          {
            q: "Explain the difference between `git merge` and `git rebase`. When would you use each?",
          },
          { q: "What is a merge conflict, and how do you resolve one?" },
          {
            q: "What's your branching strategy for a team project (Git Flow, trunk-based, feature branches)?",
          },
          { q: "What does `git cherry-pick` do, and when have you used it?" },
          { q: "How do you undo a commit that's already been pushed, safely?" },
          {
            q: "What is a squash merge, and why might a team require it for PRs?",
          },
        ],
      },
      {
        id: "docker",
        number: 20,
        title: "Docker & Containerization",
        questions: [
          {
            q: "What problem does Docker solve compared to just running the app directly on a VM?",
          },
          { q: "Explain the difference between an image and a container." },
          {
            q: "What is a multi-stage Dockerfile, and why use one (smaller final image)?",
          },
          {
            q: "What is Docker Compose used for, and how would you use it to spin up your API + database + Redis locally?",
          },
          {
            q: "How do environment variables and secrets get passed into a containerized app?",
          },
        ],
      },
      {
        id: "cicd-devops",
        number: 21,
        title: "CI/CD & DevOps Basics",
        questions: [
          {
            q: "Walk through a typical CI/CD pipeline for a full-stack app (build → test → containerize → deploy).",
          },
          {
            q: "What is the difference between continuous delivery and continuous deployment?",
          },
          {
            q: "What is a blue-green deployment vs a canary deployment, and why do they reduce release risk?",
          },
          {
            q: "How do you handle a database migration as part of a zero-downtime deployment?",
          },
          { q: "What's your approach to rolling back a bad deployment quickly?" },
        ],
      },
      {
        id: "cloud-azure",
        number: 22,
        title: "Cloud Basics (Azure-Focused)",
        questions: [
          {
            q: "What is the difference between Azure App Service, Azure Functions, and running your own VM/container for hosting a Web API?",
          },
          {
            q: "What is Azure SQL Database / Managed Instance, and how does it differ from self-hosted SQL Server?",
          },
          {
            q: "What is Azure Service Bus / Azure Queue Storage used for, and how does it compare to Kafka/RabbitMQ?",
          },
          {
            q: "What is Azure Key Vault used for, and why not just put secrets in config files?",
          },
          {
            q: "What is Azure Application Insights, and what does it give you for observability?",
          },
          {
            q: "What's the difference between horizontal scaling (scale-out) settings and vertical scaling (scale-up) in a typical cloud App Service plan?",
          },
        ],
      },
      {
        id: "testing-strategy",
        number: 23,
        title: "Testing Strategy (Cross-Stack)",
        questions: [
          {
            q: "Explain the testing pyramid — unit vs integration vs end-to-end tests, and the right ratio between them.",
          },
          {
            q: "What is TDD (test-driven development), and have you practiced it — what's the actual workflow (red-green-refactor)?",
          },
          {
            q: "What makes a good unit test (isolation, determinism, speed)? What's a \"flaky test\" and what usually causes one?",
          },
          {
            q: "Mocking vs stubbing vs faking — differences, and when do you reach for each?",
          },
          {
            q: "How do you test code that depends on the current date/time or randomness?",
          },
          {
            q: "What's the difference between code coverage and actually having good tests — why can 100% coverage still hide bugs?",
          },
        ],
      },
      {
        id: "observability",
        number: 24,
        title: "Observability (Logging, Monitoring, Tracing)",
        questions: [
          {
            q: "What are the three pillars of observability — logs, metrics, traces — and what does each answer that the others don't?",
          },
          {
            q: "What is a correlation ID / trace ID, and how does it help debug an issue across multiple services?",
          },
          {
            q: "What's the difference between monitoring (dashboards/alerts) and logging (searchable event records)?",
          },
          {
            q: "What would you alert on for a payment API (error rate, latency percentiles, queue depth) and why those specifically?",
          },
          {
            q: "What's the difference between p50, p95, and p99 latency, and why do p95/p99 matter more than average latency?",
          },
        ],
      },
    ],
  },
  {
    id: "part-e",
    label: "Part E",
    title: "Domain",
    categories: [
      {
        id: "fintech-domain",
        number: 25,
        title: "Fintech-Specific / Domain Follow-ups",
        note: "Likely to come up given your background.",
        questions: [
          {
            q: "Walk me through a system you built or maintained — how was money movement/consistency handled?",
          },
          {
            q: "How did your team handle reconciliation between internal records and an external payment processor?",
          },
          {
            q: "How was idempotency handled for retried payment requests in a system you worked on?",
          },
          {
            q: "How did you handle PII/sensitive financial data — encryption at rest/in transit, masking, access control?",
          },
          {
            q: "Have you worked with any compliance/audit requirements (e.g., logging every balance-affecting change)? How was that implemented?",
          },
          {
            q: "How did your system handle a failed or partial transaction (rollback, compensating action)?",
          },
          {
            q: "What was your approach to testing money-related logic (edge cases like negative amounts, rounding, currency precision)?",
          },
          {
            q: "How would you design a system to handle multi-currency transactions and conversion correctly (precision, rounding rules)?",
          },
          {
            q: "How do you handle a scenario where a payment succeeded at the provider but your system's callback/webhook never arrived?",
          },
          {
            q: "What data type would you use to store money in the database and in application code, and why not float/double?",
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Practical Engineering Scenario Questions ("How Would You Build X").
// Kept separate from the theory bank on purpose — these are the "walk me
// through how you'd actually build this" prompts. Verbatim transcription.
// ---------------------------------------------------------------------------

export const SCENARIO_PREP_META = {
  title: "Practical Engineering Scenario Questions (\"How Would You Build X\")",
  whySeparate:
    "These aren't \"define X\" theory questions — they're the \"walk me through how you'd actually build this\" prompts (like the 10-lakh-record bulk upload one) where the interviewer wants to see your engineering judgment in real time: how you break the problem down, what you ask before designing, and what breaks at scale. No answers included — each scenario has follow-up angles the interviewer will likely push on next.",
  checklistTitle:
    "How to think about any question in this file, as a starting checklist:",
  checklist: [
    "Volume/scale: how big is \"big\" here (10 lakh rows? 10 GB file? 10k requests/sec?)",
    "Time budget: can this run synchronously, or does it need to be async/background?",
    "Failure mode: what happens to the 500,001st row if the 500,000th one fails?",
    "Idempotency/retries: what happens if the same job/request runs twice?",
    "Visibility: how does the user/caller know it's still running, done, or failed?",
    "Resource limits: memory, DB connections, downstream API rate limits.",
  ],
};

export const SCENARIO_PREP_CATEGORIES: IQCategory[] = [
  {
    id: "scn-bulk-data-operations",
    number: 1,
    title: "Bulk Data Operations",
    questions: [
      {
        q: "You need to bulk upload 10 lakh (1 million) records from a CSV/Excel file into the database. Walk me through your design.",
        followups: [
          "How do you avoid loading the whole file into memory?",
          "How do you avoid the HTTP request timing out?",
          "How would you show the user real-time progress (e.g., \"45,000 / 10,00,000 processed\")?",
          "What happens if row 500,001 has bad data — do you fail the whole batch, skip it, or stop?",
          "How do you avoid hammering the database with 10 lakh individual INSERTs?",
          "How would you make the upload resumable if the server restarts halfway through?",
          "How do you handle duplicate records within the file, and duplicates against existing DB data?",
          "How would this design change if the file were 1 crore (10 million) rows instead of 10 lakh?",
        ],
      },
      {
        q: "Design a bulk export feature — a user clicks \"Export all transactions\" and there are 50 lakh rows.",
        followups: [
          "Would you generate the file synchronously or asynchronously? Why?",
          "How do you notify the user when the export is ready (polling, email, websocket)?",
          "How do you avoid the export query itself locking or slowing down the production database?",
          "Where would you store the generated file, and how would you expire/clean it up later?",
        ],
      },
      {
        q: "Design a bulk update feature — e.g., \"mark all transactions from vendor X as reconciled\" affecting lakhs of rows.",
        followups: [
          "How do you avoid a single massive UPDATE statement locking the table for other users?",
          "How would you batch this safely, and how would you track progress/failures?",
        ],
      },
      {
        q: "Design a bulk delete feature for old records (e.g., purging transaction logs older than 7 years).",
        followups: [
          "How do you avoid a single DELETE blowing up the transaction log / taking the DB down?",
          "Would you hard-delete or soft-delete/archive first? Why?",
        ],
      },
      {
        q: "A bulk import needs to validate every row against business rules (e.g., valid account number, sufficient KYC) before committing. How do you design validation to not become the bottleneck?",
      },
      {
        q: "How would you let a user \"undo\" a bulk operation that already partially succeeded?",
      },
      {
        q: "How would you re-run only the failed rows from a bulk upload without redoing the whole file?",
      },
    ],
  },
  {
    id: "scn-file-report-processing",
    number: 2,
    title: "File & Report Processing",
    questions: [
      {
        q: "A user uploads a 2 GB CSV file — how does your API even receive it without running out of memory or hitting a request-size limit?",
      },
      {
        q: "Design a system that generates a large PDF/Excel report (e.g., annual transaction statement) on demand.",
        followups: [
          "Sync vs async generation — how do you decide?",
          "How would you paginate/chunk report generation for a report spanning millions of rows?",
        ],
      },
      {
        q: "How would you validate that an uploaded file is well-formed (correct columns, correct data types) before processing even starts?",
      },
      {
        q: "How would you process multiple uploaded files in parallel without overwhelming the system?",
      },
      {
        q: "Design a CSV-to-database import pipeline that needs to support multiple file formats/column mappings from different partner banks.",
      },
      {
        q: "How would you show a preview of the first N rows of a huge file to the user before they confirm the import?",
      },
    ],
  },
  {
    id: "scn-background-jobs",
    number: 3,
    title: "Background Jobs & Async Processing",
    questions: [
      {
        q: "How do you design a background job system for long-running tasks (bulk upload, report generation, batch reconciliation)?",
        followups: [
          "In-process job queue vs a dedicated queue (Hangfire, Azure Service Bus, BullMQ, RabbitMQ) — how do you decide?",
          "How do you handle a job that crashes halfway — does it resume, restart, or fail permanently?",
          "How do you prevent the same job from running twice if triggered twice (idempotency)?",
        ],
      },
      {
        q: "How would you implement a retry mechanism for a background job that depends on a flaky external API, with exponential backoff?",
      },
      {
        q: "How do you prioritize jobs — e.g., a small 100-row upload shouldn't wait behind someone else's 10-lakh-row upload.",
      },
      {
        q: "How do you monitor and alert if background jobs are backing up (queue depth growing) or a worker has died?",
      },
      {
        q: "How would you design a scheduled nightly batch job (e.g., interest calculation for all accounts) to run within its time window even as data grows?",
      },
    ],
  },
  {
    id: "scn-search-retrieval-scale",
    number: 4,
    title: "Search & Data Retrieval at Scale",
    questions: [
      {
        q: "Design a search/filter feature over a transactions table with crores of rows (search by user, date range, amount, status).",
        followups: [
          "Would you rely purely on SQL indexes, or introduce a search engine (Elasticsearch)? Why?",
        ],
      },
      {
        q: "Design an autocomplete/typeahead feature (e.g., searching for a beneficiary by name) that needs to respond in under 100ms.",
      },
      {
        q: "How would you implement infinite-scroll pagination on a list that's constantly getting new rows inserted (avoiding skipped/duplicated items)?",
      },
      {
        q: "How would you build a dashboard that needs to show aggregate stats (totals, counts) over a huge, constantly growing table without recalculating from scratch every time?",
      },
      {
        q: "How would you design full-text search across transaction notes/descriptions?",
      },
    ],
  },
  {
    id: "scn-realtime-notification",
    number: 5,
    title: "Real-Time & Notification Features",
    questions: [
      {
        q: "Design a feature that shows the user live progress of their bulk upload (e.g., a progress bar updating in real time).",
        followups: [
          "WebSockets vs Server-Sent Events vs polling — which would you pick here, and why?",
        ],
      },
      {
        q: "Design a notification system that sends an SMS/email/push alert on every transaction, at high volume, without becoming a bottleneck on the transaction-processing path itself.",
      },
      {
        q: "How would you design a real-time balance update so a user sees their new balance instantly after a transaction, even if the ledger update happens slightly after?",
      },
      {
        q: "Design a system for real-time fraud alerts that must evaluate every transaction within milliseconds without slowing down the transaction itself.",
      },
    ],
  },
  {
    id: "scn-third-party-integration",
    number: 6,
    title: "Third-Party Integration & Reliability",
    questions: [
      {
        q: "You call an external payment provider's API to process a transaction, and the call times out — you don't know if it succeeded on their end or not. What do you do?",
      },
      {
        q: "Design a webhook receiver for an external payment provider — how do you handle out-of-order delivery, duplicate deliveries, and verifying the webhook is genuinely from them?",
      },
      {
        q: "Design an outgoing webhook delivery system (your service notifying a partner) with retries — how do you avoid retrying forever on a permanently broken endpoint?",
      },
      {
        q: "A downstream service you depend on is rate-limited to 100 requests/sec, but your bulk job needs to call it 10 lakh times. How do you design around that?",
      },
      {
        q: "How would you design your system to gracefully degrade if a non-critical downstream dependency (e.g., a notification service) is completely down?",
      },
    ],
  },
  {
    id: "scn-data-integrity",
    number: 7,
    title: "Data Integrity & Consistency Scenarios",
    questions: [
      {
        q: "Two requests try to debit the same account at the exact same millisecond — how do you make sure you don't allow the balance to go negative incorrectly?",
      },
      {
        q: "How would you design a system so that a crashed process mid-transaction never leaves the database in a half-updated state?",
      },
      {
        q: "How would you reconcile 10 lakh transaction records between your system and a partner bank's file at the end of each day and flag mismatches?",
      },
      {
        q: "How do you guarantee an operation like \"transfer money\" either fully happens or fully doesn't, even across two different services/databases?",
      },
      {
        q: "How would you design an append-only ledger table so that historical records can never be silently altered, only corrected via new offsetting entries?",
      },
    ],
  },
  {
    id: "scn-multitenancy-security",
    number: 8,
    title: "Multi-Tenancy, Security & Compliance Scenarios",
    questions: [
      {
        q: "Design a system so that a bulk export or bulk query can never accidentally leak one tenant's/customer's data to another.",
      },
      {
        q: "How would you design row-level access control so a support agent can only see transactions they're authorized to view?",
      },
      {
        q: "How would you design an audit trail that records who changed what and when, for every balance-affecting operation, without the logging itself becoming a performance bottleneck?",
      },
      {
        q: "A bulk upload file might contain sensitive data (PII) — how do you make sure it's not sitting unencrypted on disk or in logs at any stage?",
      },
    ],
  },
  {
    id: "scn-performance-scaling",
    number: 9,
    title: "Performance & Scaling Scenarios (Feature-Level)",
    questions: [
      {
        q: "Your bulk upload of 10 lakh records currently takes 2 hours — how would you profile and figure out what's actually slow?",
      },
      {
        q: "How would you redesign a feature that works fine at 10,000 users but starts timing out at 1,000,000 users?",
      },
      {
        q: "How would you design an API endpoint that needs to handle a sudden traffic spike (e.g., salary day, everyone checking balance at once)?",
      },
      {
        q: "Your database CPU spikes every time the nightly batch job runs and it slows down live customer traffic — how do you fix this?",
      },
      {
        q: "How would you test that your bulk upload feature can actually handle 10 lakh rows before it goes to production (load testing approach)?",
      },
    ],
  },
  {
    id: "scn-fintech-operational",
    number: 10,
    title: "Fintech Operational Scenarios",
    questions: [
      {
        q: "Design a system to process end-of-day interest calculation for lakhs of savings accounts, all before the next business day starts.",
      },
      {
        q: "Design a bulk KYC-verification pipeline that has to call an external verification API for every uploaded document.",
      },
      {
        q: "Design a system for bulk-generating and sending monthly account statements to all customers.",
      },
      {
        q: "Design a recurring-payments engine that has to trigger lakhs of scheduled debits on the same day (e.g., 1st of every month) without missing any or double-charging any.",
      },
      {
        q: "How would you design a system to detect and pause suspicious bulk activity (e.g., someone trying to bulk-transfer out of many accounts rapidly)?",
      },
    ],
  },
  {
    id: "scn-batch-processing-deep-dive",
    number: 11,
    title: "Batch Processing — Deep Dive",
    questions: [
      {
        q: "What's the difference between batch processing and stream processing, and how do you decide which fits a given problem?",
      },
      {
        q: "How do you choose a batch/chunk size for processing millions of records — what goes wrong if it's too small vs too large?",
      },
      {
        q: "How would you parallelize batch processing across multiple worker threads/processes safely, avoiding two workers processing the same chunk?",
      },
      {
        q: "How do you implement checkpointing so a batch job can resume from where it left off after a crash, instead of restarting from zero?",
      },
      {
        q: "How do you make a batch job idempotent so that re-running it (accidentally, or as a retry) doesn't double-process records?",
      },
      {
        q: "What's the fastest way to bulk-insert millions of rows into SQL Server (e.g., `SqlBulkCopy`) vs doing it row-by-row through EF Core — why is the difference so large?",
      },
      {
        q: "How would you isolate failures in a batch job so that one bad record doesn't stop or corrupt the entire batch?",
      },
      {
        q: "Would you run a batch job as a single large transaction or commit in smaller chunks? What are the trade-offs (lock duration, rollback cost, partial completion on crash)?",
      },
      {
        q: "How do you schedule and coordinate batch jobs across multiple server instances so the same job doesn't accidentally run twice (distributed locking / leader election)?",
      },
      {
        q: "How do you monitor a long-running batch job's health and alert if it's stuck, crashed, or falling behind schedule?",
      },
      {
        q: "If a batch job needs to call a rate-limited external API once per record, how do you throttle it without massively slowing down the whole batch?",
      },
      {
        q: "How would you design a batch job that processes \"today's data\" but must avoid reading records that are still mid-write by the live system (dirty/in-flight reads)?",
      },
      {
        q: "Your nightly batch job used to finish in 1 hour; after 6 months of data growth it now takes 6 hours and is bleeding into business hours — how do you diagnose and fix this?",
      },
      {
        q: "How would you design a batch job's retry policy — retry the whole job, retry only failed chunks, or retry only failed rows? What decides which approach fits?",
      },
    ],
  },
];

