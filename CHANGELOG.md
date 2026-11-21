# Changelog

## 0.1.2 (fixes)
- `sliding-indicator`: the pill ignored reduced motion (it still slid over 280ms). `segmented-control` shares it.
- `skeleton`: `useSkeleton` restarted its minimum hold when the skeleton appeared, so it held longer than asked.

## 0.1.2 (2026-11-21)
- `tactile`: remove `--ease-pop`, it duplicated `--ease-spring` on a change too small to see.
- `tabs`, `segmented-control`: the press squish releases on `--ease-spring`.

## 0.1.1 (2026-11-21)
- `tactile`: add `--ease-slide` (no overshoot) for anything that travels across a container.
- `tabs`, `sliding-indicator`: the pill uses `--ease-slide`. With `--ease-spring` it overshot the list edge by about 22px on a long move.

## 0.1.0 (2026-11-21)
- `tactile`, `button`, `tabs`, `sliding-indicator`, `segmented-control`, `skeleton`, with examples.
