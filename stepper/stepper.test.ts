import { beforeEach, describe, expect, it } from "vitest";
import { Stepper } from "./stepper";
import { Evaluator } from "../evaluator/evaluator";
import { UndefinedVariableError } from "../evaluator/errors";

const evaluator = new Evaluator();

describe("Stepper", () => {
  beforeEach(() => {
    evaluator.reset();
  });

  // ── RUNG 1: loop + wiring + minimal parse ────────────────────────────
  // The whole stepper in one breath: a loop that adds numbers to a var.
  // Note the evaluator is now INJECTED — that's the wiring gap, closed.
  it("applies a single compact rule every step  Level|1|1", () => {
    evaluator.setVar("Level", 1);
    const stepper = new Stepper(evaluator);
    const result = stepper.run("Level|1|1; 3");

    expect(result.final).toEqual({ Level: 4 });
  });

  // ── RUNG 2: the increment is a FORMULA, evaluated against live state ──
  // Forces you to run the formula through lexer→parser→evaluator, not
  // parseInt. "Level" as a formula reads Level's CURRENT value each step.
  // start 2 → +2 → 4 → +4 → 8
  it("evaluates the increment formula against current state", () => {
    evaluator.setVar("Level", 2);
    const stepper = new Stepper(evaluator);
    const result = stepper.run("Level|Level|1; 2");

    expect(result.final).toEqual({ Level: 8 });
  });

  // ── RUNG 3: the divisor is fire-frequency ────────────────────────────
  // Apply a rule only when (step % divisor === 0). divisor 2 → steps 2,4.
  it("fires a rule only when step % divisor === 0", () => {
    evaluator.setVar("CON", 0);
    const stepper = new Stepper(evaluator);
    const result = stepper.run("CON|3|2; 4");

    expect(result.final).toEqual({ CON: 6 });
  });

  // ── RUNG 4: the timeline, with a step-0 baseline ─────────────────────
  // Snapshot length is totalSteps + 1 (step 0 = values before any change).
  it("captures a timeline with a step-0 baseline snapshot", () => {
    evaluator.setVar("Level", 1);
    const stepper = new Stepper(evaluator);
    const result = stepper.run("Level|1|1; 2");

    expect(result.timeline).toEqual([
      { step: 0, vars: { Level: 1 } },
      { step: 1, vars: { Level: 2 } },
      { step: 2, vars: { Level: 3 } },
    ]);
  });

  // ── RUNG 5: multiple rules, applied left-to-right in one step ────────
  // Level updates FIRST, so CON's formula sees the already-bumped Level.
  it("applies rules left-to-right so later rules see earlier updates", () => {
    evaluator.setVar("Level", 0);
    evaluator.setVar("CON", 0);
    const stepper = new Stepper(evaluator);
    const result = stepper.run("Level|1|1; CON|Level|1; 1");

    expect(result.final).toEqual({ Level: 1, CON: 1 });
  });

  // ── RUNG 6: errors propagate from the evaluator ──────────────────────
  // A formula naming an unset variable should throw — you get this free
  // by reusing the evaluator's own validation. (No new error class yet.)
  it("throws UndefinedVariableError when a formula names an unset variable", () => {
    evaluator.setVar("Level", 1);
    const stepper = new Stepper(evaluator);

    expect(() => stepper.run("Level|Mystery|1; 1")).toThrow(UndefinedVariableError);
  });

  // ── RUNG 7: a run leaves the evaluator at its pre-run values ──────────
  // The stepper writes the step-0 baseline back when it finishes, so the
  // evaluator is pristine afterward — no lasting side effect. (ADR 0001.)
  it("restores the evaluator to its pre-run values after a run", () => {
    evaluator.setVar("Level", 1);
    const stepper = new Stepper(evaluator);

    const result = stepper.run("Level|1|1; 3");

    expect(result.final).toEqual({ Level: 4 }); // the run still progressed
    expect(evaluator.getVar("Level")).toBe(1); // ...but the evaluator is reset
  });

  // Because the baseline is restored, the same stepper can be re-run with a
  // different formula and still start from the original value.
  it("can be re-run from the same baseline with a different formula", () => {
    evaluator.setVar("Level", 1);
    const stepper = new Stepper(evaluator);

    const first = stepper.run("Level|1|1; 3"); // +1 x3
    const second = stepper.run("Level|2|1; 3"); // +2 x3, from Level=1 again

    expect(first.final).toEqual({ Level: 4 });
    expect(second.final).toEqual({ Level: 7 });
  });
});
