# api-design

Placeholder for the API Design section. Not built yet.

To activate this section:

1. Add module folders here, e.g. `content/api-design/rest-fundamentals/pagination.mdx`,
   following the same frontmatter schema used by `content/system-design` (see
   [`lib/types.ts`](../../lib/types.ts) for the `TopicFrontmatter` shape).
2. In [`config/sections.config.ts`](../../config/sections.config.ts), set this
   section's `enabled: true` and fill in its `modules` array (id, title,
   description, order — id must match the folder name used above).

No routing or component changes are needed — `/api-design` and
`/api-design/<slug>` start rendering automatically once content exists.
