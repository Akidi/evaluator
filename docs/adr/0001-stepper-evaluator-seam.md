# ADR 0001 — How the Stepper consumes the Evaluator

**Date:** 2026-06-30
**Status:** Accepted

Related: [Stepper Syntax Design](../superpowers/specs/2026-06-29-stepper-syntax-design.md)

## Context

The Stepper runs increment rules over N steps, evaluating each rule's formula
against the *current* values of tracked variables. The Evaluator is the only
thing that can evaluate a formula, but its current API resolves variables from
its **own persistent `vars` map** (the `Ident` case in `evalNode`).

Two consequences fall out of that design:

1. **Reading a value requires the full pipeline.** There is no `getVar`, so the
   only way to read a stored number is to lex → parse → `evaluate` a bare
   identifier — a lot of machinery to fetch a number the Evaluator already holds
   in a `Map`.
2. **Computing a formula forces a write to shared state.** To evaluate
   `Level|Level|1`, the Stepper must `setVar("Level", current)` into the
   persistent map *before* calling `evaluate`. The run therefore mutates the
   Evaluator as a side effect — which is undesirable when a caller wants to
   re-run from the same baseline with a different formula.

The question raised: *does the Evaluator need to change to support the Stepper?*

## Decision

**The Evaluator does not need to change for the Stepper to exist.** Build the
Stepper on the current API first. Specifically:

1. **Build the Stepper now, on today's API.** Stepper owns a `working` map as the
   source of truth (feeds `final` and `timeline`). It seeds that map from the
   Evaluator once at the start, then loads working values into the Evaluator
   transiently before each `evaluate`. Originals are kept in a local copy and
   written back at the end so a run leaves no lasting side effect.

2. **Add `getVar(name): number | undefined` to the Evaluator now.** Small, honest
   addition that removes the "parse a bare identifier just to read a number"
   smell. The Evaluator already owns the `vars` map; exposing a reader is in
   scope. *(Being implemented alongside this ADR.)*

3. **Defer scoped evaluation until the Stepper exists and the pain is felt.**
   The architecturally correct seam is an optional scope argument:

   ```ts
   evaluate(ast, identList?, scope?)  // resolve from `scope` first, then `vars`
   ```

   This turns the Evaluator into a true calculator (environment in → value out)
   and makes the Stepper's transient `setVar` / local-copy / restore dance
   unnecessary — the mutation concern disappears at the root rather than being
   worked around. It is deliberately **not** done yet: designing the seam before
   the Stepper exists risks the wrong abstraction.

## Consequences

- The Stepper ships against a stable API; no evaluator surgery blocks rung 1.
- The Stepper's behavioral tests assert only on `run`'s result, never on
  Evaluator state, so adopting scoped `evaluate` later is a pure refactor — every
  green test stays green.
- Until scoped evaluation lands, the Stepper carries a small amount of
  feed-then-restore bookkeeping. This is accepted as temporary.
- When scoped evaluation is added, revisit this ADR (supersede with a follow-up)
  and remove the restore bookkeeping from the Stepper.

## Status of follow-ups

- [ ] `getVar` on Evaluator — in progress
- [ ] Scoped `evaluate(ast, identList?, scope?)` — deferred until Stepper is working
