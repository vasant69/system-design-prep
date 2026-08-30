import type { SectionConfig } from "@/lib/types";

/**
 * Single source of truth for every section on the site.
 *
 * To add a new section later:
 *   1. Create content/<slug>/<module>/<topic>.mdx files.
 *   2. Add one entry below with `enabled: true` and its module list.
 * No routing or component changes are needed — [section]/page.tsx and
 * [section]/[slug]/page.tsx read everything from here + the filesystem.
 */
export const sectionsConfig: SectionConfig[] = [
  {
    slug: "system-design",
    title: "System Design",
    description:
      "Scalability, distributed systems, and end-to-end case studies — built for interview depth, not bullet points.",
    icon: "Network",
    enabled: true,
    modules: [
      {
        id: "fundamentals",
        title: "Fundamentals",
        description:
          "The vocabulary and mental models every other module builds on: what interviewers actually evaluate, the request lifecycle, latency/throughput, estimation, and scaling basics.",
        order: 1,
      },
      {
        id: "scalability-basics",
        title: "Scalability Building Blocks",
        description:
          "Load balancers, caching, CDNs, and proxies — the pieces you reach for first when a single server stops being enough.",
        order: 2,
      },
      {
        id: "data-layer",
        title: "Data Layer",
        description:
          "SQL vs NoSQL, indexing internals, replication, sharding, consistent hashing, and ACID vs BASE.",
        order: 3,
      },
      {
        id: "distributed-systems",
        title: "Distributed Systems Theory",
        description:
          "CAP, PACELC, consistency models, consensus, distributed transactions, and idempotency — the theory that shows up in every deep-dive.",
        order: 4,
      },
      {
        id: "communication-async",
        title: "Communication & Async",
        description:
          "REST vs GraphQL vs gRPC, message queues, pub/sub, realtime transports, and rate limiting.",
        order: 5,
      },
      {
        id: "reliability-ops",
        title: "Reliability & Ops",
        description:
          "Availability math, failure handling patterns, observability, and the monolith-vs-microservices trade-off.",
        order: 6,
      },
      {
        id: "case-studies",
        title: "Design Case Studies",
        description:
          "Full end-to-end walkthroughs — requirements to bottlenecks — for the systems interviewers ask about most.",
        order: 7,
      },
    ],
  },
  {
    slug: "git",
    title: "Git & GitHub",
    description:
      "The day-to-day Git a working developer actually types — branching, merging, undoing mistakes, and the GitHub PR workflow — taught through real workplace scenarios.",
    icon: "GitBranch",
    enabled: true,
    modules: [
      {
        id: "foundations",
        title: "Foundations",
        description: "The three areas every Git command moves things between, and the daily add/commit/push loop.",
        order: 1,
      },
      {
        id: "branching-collaboration",
        title: "Branching & Collaboration",
        description: "Working on a feature in parallel with teammates — branches, fetch vs pull, merge vs rebase, and resolving conflicts.",
        order: 2,
      },
      {
        id: "history-safety",
        title: "History & Undoing Mistakes",
        description: "Undoing things safely, parking half-done work with stash, keeping junk out of the repo, and reading history.",
        order: 3,
      },
      {
        id: "github-workflow",
        title: "GitHub Workflow",
        description: "Branch to PR to merge, plus contributing to someone else's repo through a fork.",
        order: 4,
      },
    ],
  },
  {
    slug: "api-design",
    title: "API Design",
    description: "REST, versioning, pagination, auth patterns, and API contracts.",
    icon: "Plug",
    enabled: false,
    modules: [],
  },
  {
    slug: "aws",
    title: "AWS",
    description:
      "Route 53, CloudFront, S3, Lambda, SES, and a deep dive into IAM — real interview answers and architecture from an actual deployed project, not just service descriptions.",
    icon: "Cloud",
    enabled: true,
    modules: [
      {
        id: "core-services",
        title: "Core Services",
        description:
          "Route 53, CloudFront, S3, Lambda, and SES — how they work internally, real project configuration, common mistakes, cost, and security for each.",
        order: 1,
      },
      {
        id: "architecture-strategy",
        title: "Architecture & Interview Strategy",
        description:
          "How the five core services connect into one real architecture, how to pitch your own AWS project, service comparisons, cross-service scenario questions, and the red flags that make candidates sound junior.",
        order: 2,
      },
      {
        id: "iam-fundamentals",
        title: "IAM Fundamentals",
        description:
          "The mental model, policy anatomy and evaluation logic, roles and temporary credentials, and users/groups/MFA — the IAM vocabulary everything else builds on.",
        order: 3,
      },
      {
        id: "iam-advanced-ops",
        title: "IAM Advanced & Operations",
        description:
          "Permissions boundaries and SCPs, cross-account access and federation, IAM for compute services, debugging access-denied, and a hands-on lab.",
        order: 4,
      },
      {
        id: "s3-fundamentals",
        title: "S3 Fundamentals",
        description:
          "The key-value mental model, storage classes and lifecycle rules, and bucket/object/versioning basics.",
        order: 5,
      },
      {
        id: "s3-advanced-ops",
        title: "S3 Advanced & Operations",
        description:
          "Security and encryption, versioning/replication/consistency, performance and presigned URLs, and a hands-on lab.",
        order: 6,
      },
    ],
  },
  {
    slug: "databases",
    title: "Database Design",
    description:
      "Relational modeling, indexing, transactions, and scaling — taught through BFSI systems: core banking ledgers, UPI, loans, credit cards, and insurance claims.",
    icon: "Database",
    enabled: true,
    modules: [
      {
        id: "relational-fundamentals",
        title: "Relational Modeling Fundamentals",
        description:
          "ER modeling, normalization, keys and constraints, financial-safe data types, and SQL query design — the vocabulary everything else builds on.",
        order: 1,
      },
      {
        id: "indexing-performance",
        title: "Indexing & Query Performance",
        description:
          "Index internals for OLTP workloads, composite and covering indexes, execution plans, partitioning, and materialized views.",
        order: 2,
      },
      {
        id: "transactions-integrity",
        title: "Transactions, Concurrency & Integrity",
        description:
          "ACID and isolation levels through the lens of a bank transfer, locking strategies, idempotency at the DB layer, distributed transactions, and CDC.",
        order: 3,
      },
      {
        id: "bfsi-data-modeling",
        title: "BFSI Data Modeling Patterns",
        description:
          "Double-entry ledgers, core banking schemas, immutable audit trails, KYC/customer history, interest accrual, and multi-currency design.",
        order: 4,
      },
      {
        id: "scaling-bfsi",
        title: "Scaling BFSI Databases",
        description:
          "Read replicas for reporting, sharding multi-branch data, CQRS for ledgers, regulatory data retention, and balance/limit caching.",
        order: 5,
      },
      {
        id: "security-compliance",
        title: "Security & Compliance",
        description:
          "Encryption, row-level security and data masking, RBI data localization, least-privilege access, and designing for auditability.",
        order: 6,
      },
      {
        id: "bfsi-case-studies",
        title: "BFSI Case Studies",
        description:
          "Full schema-design walkthroughs for the systems BFSI interviews actually ask about: core banking ledgers, UPI, loans, credit cards, claims, and fraud detection.",
        order: 7,
      },
    ],
  },
  {
    slug: "oops-dotnet",
    title: "OOP in .NET Core",
    description:
      "Object-oriented C# from CLR internals to MVC & Web API — built to clear the technical round, not to pass a quiz.",
    icon: "Boxes",
    enabled: true,
    modules: [
      {
        id: "oop-foundations",
        title: "OOP Foundations & the C# Type System",
        description:
          "Why .NET is object-oriented to its core, and what actually happens in memory: class vs object, value vs reference types, properties, constructors, and access modifiers.",
        order: 1,
      },
      {
        id: "four-pillars",
        title: "The Four Pillars, Properly",
        description:
          "Not definitions — what encapsulation, abstraction, inheritance, and polymorphism actually buy you, and where each one breaks. Overload resolution, virtual/override, method hiding, and constructor execution order.",
        order: 2,
      },
      {
        id: "abstraction-tools",
        title: "Abstraction Tools",
        description:
          "Abstract classes vs interfaces and the decision framework between them, explicit interface implementation, default interface methods, the diamond problem, static classes, and sealed/partial/nested classes.",
        order: 3,
      },
      {
        id: "advanced-oop",
        title: "Advanced OOP in C#",
        description:
          "Object class methods (ToString/Equals/GetHashCode), generics with variance, records and immutability, delegates and events, extension methods, and IDisposable/GC basics.",
        order: 4,
      },
      {
        id: "oop-in-aspnet-core",
        title: "OOP Inside ASP.NET Core MVC & Web API",
        description:
          "Where theory meets your actual project: dependency injection as OOP's real payoff, service lifetimes, controller inheritance, middleware as chain-of-responsibility, filters, DTOs, and the repository/unit-of-work debate.",
        order: 5,
      },
      {
        id: "solid-patterns",
        title: "SOLID & Patterns You'll Actually Be Asked",
        description:
          "Each SOLID principle with a real .NET refactor, plus the design patterns that actually show up in a .NET codebase — Factory, Strategy, Singleton, Decorator, Options, and Mediator/CQRS.",
        order: 6,
      },
      {
        id: "interview-delivery",
        title: "Interview Delivery & Practical Round",
        description:
          "async/await meets OOP, custom exceptions, unit testing OOP code with Moq/xUnit, rapid-fire one-liner traps, and a live low-level-design walkthrough.",
        order: 7,
      },
    ],
  },
  {
    slug: "dotnet-fundamentals",
    title: "C# & .NET Core Fundamentals",
    description:
      "The full C#/.NET Core interview checklist — type system, language fundamentals, memory & GC, collections, LINQ, async/threading, runtime architecture, ASP.NET Core, data access, design patterns, and testing. OOP proper lives in the OOP in .NET Core section.",
    icon: "Terminal",
    enabled: true,
    modules: [
      {
        id: "type-system",
        title: "Type System",
        description:
          "Value vs reference types, boxing/unboxing, System.Object, nullable types, conversions, var/dynamic/const/readonly, anonymous types, tuples, records, structs, and enums.",
        order: 1,
      },
      {
        id: "csharp-language-fundamentals",
        title: "C# Language Fundamentals",
        description:
          "Operators, control flow, pattern matching, ref/out/in, overloading, extension methods, local functions, indexers, properties, strings, deconstruction, and modern C# boilerplate.",
        order: 2,
      },
      {
        id: "memory-gc",
        title: "Memory Management & Garbage Collection",
        description:
          "Managed vs unmanaged code, GC generations and the Large Object Heap, IDisposable/Dispose vs finalizers, memory leaks, WeakReference, and Span<T>/Memory<T>.",
        order: 3,
      },
      {
        id: "collections-generics",
        title: "Collections & Generics",
        description:
          "Arrays, List/Dictionary/HashSet, queues/stacks, concurrent and immutable collections, the IEnumerable/ICollection/IList/IQueryable hierarchy, and generics with constraints.",
        order: 4,
      },
      {
        id: "exception-handling-fundamentals",
        title: "Exception Handling",
        description:
          "try/catch/finally, the exception hierarchy, throw vs throw ex, custom exceptions, exception filters, AggregateException, and global exception handling.",
        order: 5,
      },
      {
        id: "delegates-events-lambda",
        title: "Delegates, Events & Lambda",
        description:
          "Type-safe method pointers, multicast delegates, Func/Action/Predicate, lambda expressions and closures, events vs delegates, and callbacks.",
        order: 6,
      },
      {
        id: "linq-fundamentals",
        title: "LINQ",
        description:
          "Query vs method syntax, deferred vs immediate execution, IEnumerable vs IQueryable, filtering/projection/grouping/joining, aggregation, and expression trees.",
        order: 7,
      },
      {
        id: "async-threading-parallel",
        title: "Async, Threading & Parallel Programming",
        description:
          "Process vs thread, Task and the TPL, async/await mechanics, deadlocks and race conditions, locking primitives, and CPU-bound vs I/O-bound async decisions.",
        order: 8,
      },
      {
        id: "dotnet-runtime-architecture",
        title: ".NET Core Architecture & Runtime",
        description:
          "CLR internals, IL and JIT compilation, AOT, assemblies and metadata, SDK vs runtime, deployment models, Kestrel, reflection, and attributes.",
        order: 9,
      },
      {
        id: "aspnet-core-fundamentals",
        title: "ASP.NET Core Fundamentals",
        description:
          "Configuration and environments, routing, REST semantics, authentication/authorization and JWT/OAuth, CORS, logging, caching, background services, and SignalR — DI, middleware, filters, and DTOs live in OOP in .NET Core.",
        order: 10,
      },
      {
        id: "data-access-adonet-efcore",
        title: "Data Access — ADO.NET & EF Core",
        description:
          "ADO.NET fundamentals, EF Core's DbContext/DbSet, migrations, change tracking, loading strategies, the N+1 problem, transactions and concurrency, and Dapper vs EF Core.",
        order: 11,
      },
      {
        id: "design-patterns-architecture",
        title: "Design Patterns & Architecture",
        description:
          "Structural and behavioural patterns not already covered in OOP in .NET Core, plus layered/clean/onion architecture and microservices vs monolith.",
        order: 12,
      },
      {
        id: "testing-and-others",
        title: "Testing & Others",
        description:
          "Unit and integration testing, mocking, TDD, serialization, file I/O, date/time handling, regular expressions, HttpClient, and source generators.",
        order: 13,
      },
    ],
  },
  {
    slug: "interview-prep",
    title: "Interview Preparation",
    description:
      "A self-contained, exam-ready pack for the exact stack most full-stack interviews test — ASP.NET Core Web API, Angular, SQL, and AWS (S3 + Lambda) — plus the Git/GitHub commands you're expected to just know. Basic to advanced.",
    icon: "GraduationCap",
    enabled: true,
    modules: [
      {
        id: "dotnet-web-api",
        title: "ASP.NET Core Web API — Deep Dive",
        description:
          "Project anatomy, routing, model binding, DI, middleware, filters, exception handling, versioning, Swagger, JWT auth, minimal APIs, rate limiting, and async performance.",
        order: 1,
      },
      {
        id: "angular-deep-dive",
        title: "Angular — Deep Dive",
        description:
          "Architecture, components, data binding, directives, DI, component communication, routing, forms, RxJS, HTTP interceptors, change detection, lifecycle hooks, state management, performance, and testing basics.",
        order: 2,
      },
      {
        id: "sql-deep-dive",
        title: "SQL — Deep Dive",
        description:
          "Core querying and joins through window functions, indexing, normalization, transactions, locking, stored procedures, triggers/views, injection defense, and query optimization.",
        order: 3,
      },
      {
        id: "aws-s3-deep-dive",
        title: "AWS S3 — Deep Dive",
        description:
          "Core concepts, storage classes and lifecycle, permissions, versioning and replication, encryption, presigned URLs, performance, event notifications, consistency, and cost optimization.",
        order: 4,
      },
      {
        id: "aws-lambda-deep-dive",
        title: "AWS Lambda — Deep Dive",
        description:
          "Core concepts, triggers and event sources, execution lifecycle and cold starts, configuration, IAM, environment variables and layers, VPC integration, error handling, cost, and serverless patterns.",
        order: 5,
      },
      {
        id: "github-commands",
        title: "GitHub Commands",
        description:
          "The actual command-line muscle memory — init/clone/status, add/commit/push/pull, branching, merge vs rebase, stash, history/undo, remotes, tags, PR workflow, GitHub Actions basics, and the advanced rescue commands.",
        order: 6,
      },
    ],
  },
  {
    slug: "code-flow",
    title: "Code Flow",
    description:
      "One project, start to production. We build a single BFSI-flavored Employee Management Web API from an empty folder to a Dockerized, tested, secured service — every concept lands in the same codebase, explained line by line, with the thinking behind each change.",
    icon: "Workflow",
    enabled: true,
    modules: [
      {
        id: "foundations-first-run",
        title: "Foundations & First Run",
        description:
          "The C# you actually need for a Web API, the HTTP/REST/JSON mental model, creating the project with dotnet new, walking Program.cs and the .csproj line by line, and the first GET endpoint running in Swagger.",
        order: 1,
      },
      {
        id: "crud-in-memory",
        title: "CRUD with In-Memory Data",
        description:
          "The Employee model, attribute routing, all four verbs (GET/POST/PUT/DELETE) with correct status codes, and why you never expose the entity — Models vs DTOs and mapping, manual then AutoMapper.",
        order: 2,
      },
      {
        id: "layered-architecture",
        title: "Layering: Controller → Service → Repository",
        description:
          "The thinking behind layers, interfaces and why they exist, extracting the service layer, the repository pattern, dependency injection, and service lifetimes with the captive-dependency trap.",
        order: 3,
      },
      {
        id: "data-access-efcore",
        title: "Database: EF Core + SQL Server",
        description:
          "DbContext and DbSet, connection strings and config, migrations, the repository backed by EF Core, LINQ queries, async/await end to end and why, a related Department entity with relationships and the N+1 problem, and transactions.",
        order: 4,
      },
      {
        id: "cross-cutting-concerns",
        title: "Cross-Cutting Concerns",
        description:
          "Middleware and the request pipeline, global exception handling, validation from DataAnnotations to FluentValidation, configuration and appsettings and IOptions and secrets, logging with ILogger and Serilog, and customizing Swagger.",
        order: 5,
      },
      {
        id: "security",
        title: "Security",
        description:
          "Authentication vs authorization, JWT end to end and issuing tokens, [Authorize] with roles/policies/claims, password hashing and the user store, and hardening: HTTPS, CORS, rate limiting, and security headers.",
        order: 6,
      },
      {
        id: "real-world-features",
        title: "Real-World Features",
        description:
          "Pagination, filtering and sorting, KYC document file upload, calling an external PAN-verification API with IHttpClientFactory, background services with BackgroundService and an outbox, and caching with IMemoryCache then Redis.",
        order: 7,
      },
      {
        id: "quality-and-architecture",
        title: "Quality & Architecture",
        description:
          "SOLID as real refactors of our code, unit testing the service layer with xUnit and Moq, integration testing with WebApplicationFactory, restructuring into Clean Architecture, API versioning, and performance tuning.",
        order: 8,
      },
      {
        id: "deployment",
        title: "Deployment",
        description:
          "Production configuration and environments, Docker with a Dockerfile and docker-compose plus SQL Server, health checks, and a CI/CD and hosting overview.",
        order: 9,
      },
    ],
  },
  {
    slug: "nodejs",
    title: "Node.js",
    description:
      "Node.js from absolute zero to a strong practical level — the V8/libuv internals, the event loop, async patterns, modules, streams, and concurrency. Taught in Hinglish, why before what, with a decision framework for every choice.",
    icon: "Hexagon",
    enabled: true,
    modules: [
      {
        id: "js-for-node",
        title: "JavaScript You Need for Node.js",
        description:
          "The specific JavaScript that Node's whole model rests on: functions as values and callbacks, closures, promises built from scratch, async/await, error handling, and the modern syntax (this/arrow, destructuring) you'll read everywhere.",
        order: 1,
      },
      {
        id: "node-internals",
        title: "What Node.js Is & How It Works Internally",
        description:
          "What Node actually is, how it differs from browser JavaScript, the V8 engine, what a 'runtime environment' means, how your code gets executed, and the event-driven architecture that ties it together.",
        order: 2,
      },
      {
        id: "event-loop",
        title: "The Event Loop, Call Stack & Queues",
        description:
          "The single most-asked Node topic, done properly: the call stack, libuv and the thread pool, the callback queue vs the microtask queue, the event loop's phases, and worked examples from easy to tricky.",
        order: 3,
      },
      {
        id: "sync-async",
        title: "Blocking vs Non-Blocking, Sync vs Async",
        description:
          "What 'blocking' really does to a single-threaded server, the difference between synchronous and asynchronous APIs, and a production decision framework for when each is the right call.",
        order: 4,
      },
      {
        id: "async-patterns",
        title: "Callbacks, Promises & Async/Await",
        description:
          "Callbacks and callback hell, promises in depth, async/await in practice, error handling across async boundaries, and util.promisify plus the Promise combinators (all/allSettled/race/any).",
        order: 5,
      },
      {
        id: "modules-and-npm",
        title: "Modules, CommonJS / ESM & npm",
        description:
          "CommonJS and ES Modules, require vs import and how resolution works, npm and the registry, package.json field by field, package-lock and semver, dependencies vs devDependencies, and npm scripts / npx.",
        order: 6,
      },
      {
        id: "builtin-modules",
        title: "Core Built-in Modules & process",
        description:
          "The standard library you reach for daily: fs, path, os, crypto, util, and the process object — plus environment variables and how to handle config safely.",
        order: 7,
      },
      {
        id: "buffers-streams-files",
        title: "Buffers, Streams & File Handling",
        description:
          "Buffers and binary data, the streams mental model, readable/writable/transform streams, pipe and pipeline, real file-handling patterns, and working with JSON at scale.",
        order: 8,
      },
      {
        id: "http-and-events",
        title: "HTTP Servers & EventEmitter",
        description:
          "Building an HTTP server with the core http module, the request and response objects, basic routing, EventEmitter and custom events, and why HTTP request/response are themselves streams.",
        order: 9,
      },
      {
        id: "concurrency-and-performance",
        title: "Concurrency & Performance",
        description:
          "What single-threaded really means, worker threads for CPU work, child processes, the cluster module, Node performance concepts, and a walkthrough of finding and fixing a real bottleneck.",
        order: 10,
      },
    ],
  },
  {
    slug: "angular-practical",
    title: "Angular Practical",
    description:
      "One project, empty folder to production. We build a single Employee Management System in modern Angular — standalone components, signals, and the new control flow — every concept landing in the same app, taught in Hinglish with the 'why' before the 'what', explained line by line.",
    icon: "Component",
    enabled: true,
    modules: [
      {
        id: "ng-foundations",
        title: "Foundations & First Run",
        description:
          "What Angular is and why it exists, the CLI, the project structure walked file by file, standalone components, how the app boots from main.ts, and the first component rendering on screen.",
        order: 1,
      },
      {
        id: "components-templates-binding",
        title: "Components, Templates & Data Binding",
        description:
          "Component anatomy, template syntax, interpolation and property/attribute/class/style binding, event binding, two-way binding with signals, the new @if/@for/@switch control flow, lifecycle hooks, and how change detection decides what to re-render.",
        order: 2,
      },
      {
        id: "directives-pipes",
        title: "Directives & Pipes",
        description:
          "Built-in attribute directives, writing a custom attribute directive for the EMS, built-in pipes for dates and currency and numbers, writing a custom pipe, and the pure-vs-impure performance trap.",
        order: 3,
      },
      {
        id: "component-communication",
        title: "Component Communication & Reusable UI",
        description:
          "@Input and @Output (and the new input()/output() functions), template reference variables, ViewChild, content projection with ng-content, and building genuinely reusable presentational components — a data table, a card, a confirm modal.",
        order: 4,
      },
      {
        id: "services-di-rxjs",
        title: "Services, DI, RxJS & Signals",
        description:
          "Services and why logic leaves the component, dependency injection and the injector tree, Observables and the operators you actually use, Subject and BehaviorSubject, Signals and computed, the async pipe, and a service-as-store approach to state management.",
        order: 5,
      },
      {
        id: "ng-routing",
        title: "Routing",
        description:
          "Configuring routes, routerLink and navigation, route and query parameters, nested and child routes, lazy loading feature areas, functional route guards for auth, and resolvers that pre-load data — wiring up Login, Dashboard, and the Employees shell.",
        order: 6,
      },
      {
        id: "http-and-apis",
        title: "HTTP & Talking to a Backend API",
        description:
          "HttpClient setup, typed request/response models against a defined REST contract, environment configuration for API URLs, error handling, functional HTTP interceptors, JWT authentication end to end — login, token storage, auth guard, and token refresh.",
        order: 7,
      },
      {
        id: "forms-and-crud",
        title: "Forms, Validation & CRUD",
        description:
          "Template-driven vs reactive forms and when to use which, FormBuilder and FormGroup/FormControl, built-in and custom and async validators, showing errors well, and the full Add / Edit / Delete Employee flow against the API.",
        order: 8,
      },
      {
        id: "ng-real-world-features",
        title: "Real-World Features",
        description:
          "Server-side pagination, filtering and debounced search, file upload for the Documents screen, a notifications feed, and the Departments, Roles & Permissions, and Leave Requests screens — the features every internal admin app actually needs.",
        order: 9,
      },
      {
        id: "quality-performance-deploy",
        title: "Quality, Performance & Deployment",
        description:
          "Angular Material and CDK concepts, performance work — OnPush, trackBy, @defer, signals — security basics like XSS and sanitization and safe token storage, unit testing with TestBed and HttpTestingController, and the production build and deployment.",
        order: 10,
      },
    ],
  },
];
