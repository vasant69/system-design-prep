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
    slug: "dotnet-api",
    title: "ASP.NET Core Web API",
    description:
      "Controllers, DI, EF Core, API design, and security in ASP.NET Core — the backend Web API stack, not the MVC/Razor UI layer.",
    icon: "Code2",
    enabled: true,
    modules: [
      {
        id: "api-fundamentals",
        title: "API Fundamentals",
        description:
          "The request lifecycle and Program.cs, the middleware pipeline, attribute routing and controllers, action results and status codes, and model binding/validation.",
        order: 1,
      },
      {
        id: "di-middleware",
        title: "DI, Middleware & Cross-Cutting Concerns",
        description:
          "The DI container and service lifetimes, configuration and the options pattern, structured logging, writing custom middleware, filters vs middleware, and global exception handling.",
        order: 2,
      },
      {
        id: "efcore-data-access",
        title: "Data Access with EF Core",
        description:
          "DbContext and change tracking, migrations, LINQ-to-Entities query translation, relationships and loading strategies, concurrency control, the repository/unit-of-work debate, and EF Core performance tuning.",
        order: 3,
      },
      {
        id: "api-design-practices",
        title: "API Design & Best Practices",
        description:
          "REST design principles, Minimal APIs vs Controllers, versioning and OpenAPI/Swagger, HttpClient/IHttpClientFactory, pagination/filtering/sorting, and rate limiting/response caching.",
        order: 4,
      },
      {
        id: "dotnet-security",
        title: "Security — AuthN & AuthZ",
        description:
          "JWT bearer authentication, ASP.NET Core Identity, roles/policies/claims-based authorization, CORS, secrets management and HTTPS/HSTS, and SQL injection prevention with EF Core.",
        order: 5,
      },
      {
        id: "testing-production",
        title: "Testing & Production Readiness",
        description:
          "Unit testing with xUnit/Moq, integration testing with WebApplicationFactory, caching strategies, background jobs, health checks/observability, and deployment basics.",
        order: 6,
      },
    ],
  },
  {
    slug: "english-learning",
    title: "English Learning",
    description: "Interview communication, vocabulary, and spoken English practice.",
    icon: "Languages",
    enabled: false,
    modules: [],
  },
];
