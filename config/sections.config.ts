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
    slug: "databases",
    title: "Databases",
    description: "Deep dives into specific database engines and query optimization.",
    icon: "Database",
    enabled: false,
    modules: [],
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
