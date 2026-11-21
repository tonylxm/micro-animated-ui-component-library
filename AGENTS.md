# AGENTS.md

Personal shadcn registry (Vite + React + Tailwind 4 + Base UI) and its gallery site.

## Non-negotiables
- Only `src/registry/default/` ships. Site code lives in `src/site/` and never imports into registry files.
- Registry files import `@/lib/utils` and `@/registry/default/ui/<name>`, so shadcn rewrites them on install.
- Motion follows the `frontend-design` skill (motion.md, tactile.md). Transition named properties only, never `transition: all`. Every motion has a reduced-motion path.
- Changing an item bumps the version in its first-line comment and adds a CHANGELOG entry.
- New items: write from the idea, never copy another registry's code. Add a provenance line in `src/site/items.tsx` and the README table.

## Checks
`pnpm build`, `pnpm exec shadcn registry validate`, `pnpm test:e2e`, and a browser-e2e pass on the gallery.

## Workflow
- Solo: commit to `main`. Conventional Commits, scope is the item name (`feat(button): ...`).
