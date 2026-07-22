<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Documentation — READ THIS FIRST

Before writing ANY code, read these files in order:

1. `docs/INDEX.md` — documentation map with topic index (use this to find relevant files)
2. `docs/architecture/database.md` — Prisma schema (source of truth for all data models)
3. `docs/features/patient-management.md` — assessment form fields, TypeScript interfaces, Zod schemas, session generation
4. `docs/guidelines/ai-rules.md` — hard constraints: no `any`, HIPAA rules, Server Action patterns, testing conventions

For feature-specific work, use the **Topic Index** in `docs/INDEX.md` to find the exact file and section.

## Key Rules

- TypeScript strict mode — never use `any`
- Server Components by default — only add `'use client'` when needed
- Server Actions for all mutations — never API routes for forms
- Zod validation on client AND server — never trust client input
- No patient PII in logs, localStorage, or URL params
- Use Shadcn UI components + Tailwind theme tokens only
