# ADR 0002 — Scoped evaluation replaces the Stepper's feed-then-restore

**Date:** 2026-09-24
**Status:** Accepted

Supersedes: [ADR 0001](0001-stepper-evaluator-seam.md), Decision #3 (deferred scoped evaluation)

## Context

ADR 0001 built the Stepper on the Evaluator's existing API and deliberately
**deferred** scoped evaluation, accepting a temporary feed-then-restore dance in
the Stepper: transiently `setVar` current values into the Evaluator's shared
`vars` map before each `evaluate`, then write the originals back at the end.

The Stepper now exists, and the pain ADR 0001 predicted is felt:

1. A run **mutates shared Evaluator state** as a side effect, so re-running from
   the same baseline depends on the restore step actually executing.
2. The restore ran only on the happy path — a mid-run throw skipped it, leaking
   mutated state.

ADR 0001 said to revisit once the Stepper existed and the pain was real. It is.

## Decision

Add the optional scope argument foreseen in ADR 0001:

```ts
evaluate(ast, identList?, scope?: Scope)   // Scope = ReadonlyMap<string, number>
```

Identifiers resolve from `scope` **first**, then fall back to the persistent
`vars` map. `scope` is read-only (`ReadonlyMap`) — the Evaluator never writes it.
This makes the Evaluator a pure calculator: environment in → value out.

The Stepper owns a private `working` map as its source of truth, passes it as
`scope` on every formula run, and no longer touches the Evaluator during a run.

## Implementation

- **Evaluator** (`evaluator/evaluator.ts`, `evaluator/types.ts`): added the
  `Scope` type; threaded `scope` through `evaluate`, `evalNode`, `evalNumber`,
  and `validate`. The `Ident` case resolves scope-first; `validate` treats a name
  as defined if it is in `scope` **or** `vars`.
- **Formulate** (`formule.ts`): `run(formulae, scope?)` forwards `scope` into
  `evaluate`.
- **Stepper** (`stepper/stepper.ts`): seeds `working` once from the Evaluator,
  mutates it in place per step (left-to-right, so later rules see earlier
  updates), and passes it as `scope`. Removed the per-step `setVar` and the
  end-of-run restore.

## Consequences

- A Stepper run leaves the Evaluator **untouched** — no side effect, so no
  restore, and re-running from the same baseline is inherent rather than
  bookkeeping. The throw-skips-restore hazard is gone.
- The mutation concern is fixed at the root, exactly as ADR 0001 anticipated the
  seam would do; the workaround is deleted, not worked around.
- Scope is optional, so every existing scopeless caller is unchanged. The full
  suite (118 tests) stays green.
- The Evaluator is now a true calculator; future callers that need a transient
  environment can supply one without disturbing shared state.

## Status of follow-ups (from ADR 0001)

- [x] `getVar` on Evaluator — done
- [x] Scoped `evaluate(ast, identList?, scope?)` — done (this ADR)
