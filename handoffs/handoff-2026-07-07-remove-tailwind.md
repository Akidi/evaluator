# Handoff — Remove Tailwind / rebuild `+page.svelte` on design system: Task 1–2 done, Task 3 next

**Date:** 2026-07-07

## Goal

Different track from the evaluator work (that's finished — see prior handoff `handoffs/2026-06-26T222321-HANDOFF.md`, now stale). Current work: remove Tailwind entirely from the `app` SvelteKit workspace and rebuild `app/src/routes/+page.svelte` on the existing `$lib/components` atomic-design library + `$lib/assets/css` token stylesheet. Presentation-layer only — no engine/evaluator/parser/lexer/stepper files touched.

## AI-specific notes

- Caveman mode always-on per global CLAUDE.md.
- Package manager is **pnpm** only — never npm/npx.
- Test command: `CI=true pnpm test` (plain `vitest run` flakes with a config error).
- This work is running as a spec-driven-development (sdd) flow: plan at `docs/superpowers/plans/2026-07-07-remove-tailwind-design-system-rebuild.md`, progress ledger at `.superpowers/sdd/progress.md`, per-task briefs/reports at `.superpowers/sdd/task-N-brief.md` / `task-N-report.md`, review diffs at `.superpowers/sdd/review-<sha>..<sha>.diff`.
- Baseline commit for this whole effort: `88d2cf2`.

## State — Task 1 and Task 2 complete, both reviewed clean

Per `.superpowers/sdd/progress.md`:
- **Task 1** (remove Tailwind from build config/tooling): complete, commits `88d2cf2..12dd4fc`, review Approved, no Critical/Important issues.
- **Task 2** (replace `layout.css` with the token stylesheet): complete, commit `64e26e3`, review Approved, no issues.

Current HEAD is `64e26e3` ("feat: wire in the design-system token stylesheet, replacing Tailwind"). Working tree clean except untracked `.claude/`. Branch is 6 commits ahead of `origin/main` (not pushed).

`CI=true pnpm test` passes 119 tests; the only failure is a pre-existing, unrelated one (`app/src/lib/vitest-examples/Welcome.svelte.spec.ts` — a vitest-browser-svelte example file that needs Browser Mode but runs in the forks pool; not part of this work, not a regression).

## Next: Task 3 — Rebuild the page skeleton, shared inputs, and Tabs shell

Not started. Full details in the plan doc, but summary:
- Modify `app/src/routes/+page.svelte` only.
- Update script-block imports to pull `Heading`/`Button`/`Tag` from `$lib/components/atoms`, `PageShell`/`Stack`/`Grid`/`Cluster` from `$lib/components/layouts`, `Card`/`FormField`/`Tabs`/`TabList`/`Tab`/`TabPanel` from `$lib/components/molecules`.
- Replace the `<main>` markup (Tailwind utility classes) with the new component-based structure — leaves two placeholder comments (`TASK4_EVALUATE_TAB_PLACEHOLDER`, `TASK5_STEPPER_TAB_PLACEHOLDER`) for Tasks 4/5 to fill in later.
- All existing `$state`/`$derived`/functions in the script block are preserved verbatim — only markup/imports change.
- Verify via dev server: page title renders, Variables/Custom-functions cards render and are interactive, no console errors.
- Commit: `feat: rebuild page skeleton and shared inputs on the design system`.

After Task 3: Task 4 (Evaluate tab), Task 5 (Stepper tab), Task 6 (final verification pass) remain, each fully spec'd in the plan doc with exact markup to paste in.

## Pointers

- Plan: [docs/superpowers/plans/2026-07-07-remove-tailwind-design-system-rebuild.md](docs/superpowers/plans/2026-07-07-remove-tailwind-design-system-rebuild.md) — has exact code for every remaining task/step.
- Progress ledger: `.superpowers/sdd/progress.md`
- Design spec (intent, not exact markup): `docs/superpowers/specs/2026-07-07-remove-tailwind-design-system-rebuild-design.md`
- ADR referenced from earlier stepper work: `docs/adr/0001-stepper-evaluator-seam.md`
- Prior (now-stale) handoff for the evaluator track: `handoffs/2026-06-26T222321-HANDOFF.md`
