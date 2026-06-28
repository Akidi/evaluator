import { describe, expect, it } from "vitest";
import { Stepper } from "./stepper";
import { Evaluator } from "../evaluator/evaluator";
import { UndefinedVariableError } from "../evaluator/errors";

// ============================================================================
// GUIDING SCAFFOLD — proposed design, written 2026-06-28. Adjust freely; these
// tests ARE the spec, so changing a decision means changing the test.
//
// Confirmed design decisions (from review Q&A):
//   - Base value of each tracked var = its CURRENT value on the Evaluator
//     (set via evaluator.setVar before stepping). Unset -> UndefinedVariableError.
//   - Increments may be full FORMULAS, not just numbers.
//   - run() returns BOTH a final snapshot and the full timeline.
//
// Assumptions I made that you should sanity-check (each has a test below):
//   A1. Spec grammar:
//         spec      := rule (';' rule)* ';' totalSteps
//         rule      := name ':' incrementFormula ':' divisor      (compact)
//                    | '(' name ',' incrementFormula ',' divisor ')'  (explicit)
//       The explicit form is the escape hatch when the formula contains ':'
//       (ternary). Splitting MUST be paren/ternary-depth aware — only split on
//       ';' / ':' / ',' at depth 0 (see A5 / the clamp + ternary tests).
//   A2. "every N steps" => the rule fires on step i when (i % divisor === 0),
//       1-indexed. divisor 1 fires every step.
//   A3. The timeline includes a step-0 snapshot (base values, before any
//       increment), then one snapshot per step 1..total. length === total + 1.
//   A4. Increment formulas are evaluated against the CURRENT evolving snapshot
//       (so a rule can read another tracked var at its current stepped value),
//       and rules within one step apply in SPEC ORDER (left to right).
//   A5. run() MUTATES the passed Evaluator's vars as it steps (it reuses the
//       evaluator to evaluate increment formulas). If you'd rather it not
//       clobber caller state, that's a design change — flag it.
//   A6. Snapshots/`final` carry only the TRACKED vars (the rule names), keyed
//       by name. Non-tracked setVars (constants like a STR used inside a
//       formula) are NOT included in the snapshot.
//
// Proposed types (to live in stepper/types.ts):
  // type Snapshot   = { step: number; vars: Record<string, number> };
  // type StepResult = { final: Record<string, number>; timeline: Snapshot[] };
  // interface IStepper { run(spec: string): StepResult; }
// Constructor: new Stepper(evaluator)  — stepper builds its own Lexer/Parser.
// ============================================================================

describe("Stepper", () => {
  it("applies a single compact rule every step (Level:1:1)", () => {
    const evaluator = new Evaluator();
    evaluator.setVar("Level", 1);
    const stepper = new Stepper(evaluator);

    const result = stepper.run("Level:1:1; 3");

    expect(result.final).toEqual({ Level: 4 });
  });

  it("returns a timeline with a step-0 base snapshot plus one per step", () => {
    const evaluator = new Evaluator();
    evaluator.setVar("Level", 1);
    const stepper = new Stepper(evaluator);

    const result = stepper.run("Level:1:1; 3");

    expect(result.timeline).toEqual([
      { step: 0, vars: { Level: 1 } },
      { step: 1, vars: { Level: 2 } },
      { step: 2, vars: { Level: 3 } },
      { step: 3, vars: { Level: 4 } },
    ]);
  });

  it("only fires a rule on steps divisible by its divisor (CON:3:2)", () => {
    const evaluator = new Evaluator();
    evaluator.setVar("CON", 10);
    const stepper = new Stepper(evaluator);

    const result = stepper.run("CON:3:2; 4");

    // fires on steps 2 and 4 only -> 10 -> 13 -> 16
    expect(result.timeline.map((s) => s.vars.CON)).toEqual([10, 10, 13, 13, 16]);
    expect(result.final).toEqual({ CON: 16 });
  });

  it("tracks multiple rules against one shared total-step count", () => {
    const evaluator = new Evaluator();
    evaluator.setVar("Level", 1);
    evaluator.setVar("CON", 10);
    const stepper = new Stepper(evaluator);

    const result = stepper.run("Level:1:1; CON:3:2; 4");

    expect(result.final).toEqual({ Level: 5, CON: 16 });
  });

  it("evaluates a formula increment against the evolving snapshot, in spec order", () => {
    const evaluator = new Evaluator();
    evaluator.setVar("CON", 10);
    evaluator.setVar("HP", 0);
    const stepper = new Stepper(evaluator);

    // CON updates first each step, then HP += CON (its already-updated value)
    const result = stepper.run("CON:2:1; HP:CON:1; 2");

    // step1: CON 12, HP += 12 -> 12 ; step2: CON 14, HP += 14 -> 26
    expect(result.final).toEqual({ CON: 14, HP: 26 });
  });

  it("supports the explicit ( name , formula , divisor ) form for ternary increments", () => {
    const evaluator = new Evaluator();
    evaluator.setVar("L", 4);
    const stepper = new Stepper(evaluator);

    // ternary ':' would collide with the field separator in compact form,
    // so the explicit comma-separated form is required here.
    const result = stepper.run("(L, L < 5 ? 2 : 1, 1); 3");

    // step1: 4<5 -> +2 -> 6 ; step2: 6<5 false -> +1 -> 7 ; step3: -> +1 -> 8
    expect(result.final).toEqual({ L: 8 });
  });

  it("splits the explicit form depth-aware so commas inside a call don't break it", () => {
    const evaluator = new Evaluator();
    evaluator.setVar("CON", 10);
    evaluator.setVar("HP", 0);
    const stepper = new Stepper(evaluator);

    // clamp(CON, 0, 99) contains commas that must NOT be treated as field separators
    const result = stepper.run("(HP, clamp(CON, 0, 99), 1); 2");

    expect(result.final).toEqual({ HP: 20 });
  });

  it("throws UndefinedVariableError when a tracked var has no base value set", () => {
    const evaluator = new Evaluator();
    const stepper = new Stepper(evaluator);

    expect(() => stepper.run("Ghost:1:1; 2")).toThrow(UndefinedVariableError);
  });
});
