# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Confirmed product feedback, 2026-09-25
- Keep this new site inside `peilin-stillwater`; do not replace the original portfolio.
- Full confirmed resume name is 谢沛霖. Show it in the upper-left without a trailing period; remove the period from About too.
- Homepage must immediately explain personal profile + portfolio, with a meaningful central introduction and related content entrances.
- Water click sounds, fluid pointer/touch trails, and a mechanical rotating time selector with quiet ticks are desired. Provide sound and reduced-motion controls.
- About photo should be clearly larger; text should stay readable. Preserve detailed resume and three real screenshots per project.

## Updated feedback, 2026-09-25 (second review)
- Public identity is a personal resume and portfolio, not a product named Stillwater. New repo and Pages path: peilin-portfolio. Keep the local source folder in place.
- Remove the floating featured-project card entirely. Keep “谢沛霖的个人空间”, use concise factual homepage content and direct resume/work entrances instead of a large abstract slogan.
- Use consistent non-italic typography with properly paired Chinese and Latin fonts.
- Water needs an actual recorded splash/ripple sound, not an oscillator or electronic beep. Preserve real recording provenance and permission. Mechanical watch-like ticks for the time wheel should be more audible but short and controlled.
