# Tactile UI

A personal shadcn registry: Base UI components with motion that feels physical, plus a gallery that runs on
the same components. Motion and depth rules come from the `frontend-design` skill's
[tactile.md](https://github.com/tonylxm/skills/blob/main/frontend-design/references/tactile.md).

## Items

| Item | What it is | Inspired by |
|---|---|---|
| `tactile` | Motion and depth tokens (`src/styles/tactile.css`) | Your design notes, motion.md |
| `button` | Raised button, quick press, slower spring release | shadcn base-nova, sevenui, coss |
| `tabs` | Base UI tabs with a sliding spring pill | Base UI demo |
| `segmented-control` | Single-choice toggle group that always keeps a value | coss, Milly |
| `sliding-indicator` | The pill behind segmented control, also for links and radios | Milly |
| `skeleton` | Synced shimmer and `useSkeleton` (150ms delay, 300ms hold) | cubby-ui |

Everything is written from the idea, not copied. Base UI handles behavior and accessibility.

## Use in a project

1. Add the registry to `components.json`:
   ```json
   "registries": { "@tonylxm": "https://<host>/r/{name}.json" }
   ```
2. Install: `pnpm dlx shadcn@latest add @tonylxm/button`
3. Import the tokens once, after the shadcn theme in your global CSS: `@import "../styles/tactile.css";`

Installed files are copies the project owns. Each file's first line names its item and version, so you can
tell what a project has against [CHANGELOG.md](CHANGELOG.md).

## Develop

| Command | Does |
|---|---|
| `pnpm dev` | Gallery at localhost:5173 (serves `/r/*.json` too). |
| `pnpm registry:build` | Builds `registry.json` into `public/r/` |
| `pnpm exec shadcn registry validate` | Checks the registry |
| `pnpm build` | Registry, typecheck, static site in `dist/` |
| `pnpm test:e2e` | Playwright at phone width: overflow, keyboard, reduced motion, layout shift |

Layout: `src/registry/default/` ships (ui, styles, examples). `src/site/` is the gallery only and never ships.
